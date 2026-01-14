import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function AdminDashboard() {
    const [apps, setApps] = useState([]);
    const [error, setError] = useState("");
    const [tab, setTab] = useState("all"); // all | proposal | report | other

    const load = async () => {
        setError("");
        const { data, error } = await supabase
            .from("applications")
            .select("id,created_at,name,email,grade,message,event_id")
            .order("created_at", { ascending: false })
            .limit(200);

        if (error) return setError(error.message);
        setApps(data ?? []);
    };

    const PDF_BUCKET = "staff-pdfs";
    const getCategory = (filePath = "") => {
        const s = filePath.toLowerCase();
        if (s.includes("proposal")) return "proposal";
        if (s.includes("report")) return "report";
        return "other";
    };



    const [docs, setDocs] = useState([]);
    const [docErr, setDocErr] = useState("");

    const loadDocs = async () => {
        setDocErr("");
        const { data, error } = await supabase
            .from("staff_documents")
            .select("id,title,file_path,category,created_at")
            .order("created_at", { ascending: false })
            .limit(200);

        if (error) return setDocErr(error.message);
        setDocs(data ?? []);
    };

    const openPdf = async (file_path) => {
        const { data, error } = await supabase.storage
            .from(PDF_BUCKET)
            .createSignedUrl(file_path, 60); // 60秒有効

        if (error) return alert(error.message);
        window.open(data.signedUrl, "_blank", "noreferrer");
    };

    useEffect(() => {
        loadDocs();
    }, []);



    useEffect(() => {
        load();


        const ch = supabase
            .channel("applications_changes")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "applications" },
                () => load()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(ch);
        };
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };
    const categorized = docs.map((d) => ({
        ...d,
        _cat: getCategory(d.file_path),
    }));

    const counts = {
        all: categorized.length,
        proposal: categorized.filter((d) => d._cat === "proposal").length,
        report: categorized.filter((d) => d._cat === "report").length,
        other: categorized.filter((d) => d._cat === "other").length,
    };

    const filteredDocs =
        tab === "all" ? categorized : categorized.filter((d) => d._cat === tab);


    return (
        <div className="mx-auto max-w-5xl px-4 py-10 ">
            <div className="flex items-end justify-between gap-3 ">

                
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin</h1>
                    <p className="mt-1 text-sm text-slate-600">参加希望（applications）一覧</p>
                </div>

                <button
                    onClick={signOut}
                    className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                    Logout
                </button>
            </div>

            {error && (
                <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600">
                        <tr>
                            <th className="px-4 py-3">Time</th>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Grade</th>
                            <th className="px-4 py-3">Message</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                        {apps.map((a) => (
                            <tr key={a.id} className="text-slate-800">
                                <td className="px-4 py-3 whitespace-nowrap">
                                    {new Date(a.created_at).toLocaleString()}
                                </td>
                                <td className="px-4 py-3">{a.name}</td>
                                <td className="px-4 py-3">{a.email || "-"}</td>
                                <td className="px-4 py-3">{a.grade || "-"}</td>
                                <td className="px-4 py-3">{a.message || "-"}</td>
                            </tr>
                        ))}
                        {!apps.length && (
                            <tr>
                                <td className="px-4 py-6 text-slate-600" colSpan={5}>
                                    まだ参加希望データがありません（Google Form運用中なのでここは空で問題ない）
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <section className="mt-8">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">PDF</h2>
                        <p className="mt-1 text-sm text-slate-600">企画書・反省文書など</p>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                    {[
                        { key: "all", label: `All (${counts.all})` },
                        { key: "proposal", label: `Proposals (${counts.proposal})` },
                        { key: "report", label: `Reports (${counts.report})` },
                        { key: "other", label: `Others (${counts.other})` },
                    ].map((t) => (
                        <button
                            key={t.key}
                            onClick={() => setTab(t.key)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${tab === t.key
                                    ? "bg-green-600 text-white"
                                    : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {docErr && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {docErr}
                    </div>
                )}

                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                    <ul className="divide-y divide-slate-200">
                        {filteredDocs.map((d) => (
                            <li key={d.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                <div className="min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className="truncate font-medium text-slate-900">{d.title}</p>
                                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                                            {d._cat.toUpperCase()}
                                        </span>
                                    </div>
                                    <p className="mt-0.5 text-xs text-slate-500">
                                        {d.file_path} • {new Date(d.created_at).toLocaleString()}
                                    </p>
                                </div>

                                <button
                                    onClick={() => openPdf(d.file_path)}
                                    className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Open
                                </button>
                            </li>
                        ))}

                        {!filteredDocs.length && (
                            <li className="px-4 py-6 text-sm text-slate-600">No PDFs.</li>
                        )}
                    </ul>
                </div>
            </section>


        </div>
    );
}
