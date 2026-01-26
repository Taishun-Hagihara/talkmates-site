import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";

const PDF_BUCKET = "staff-pdfs";

const getCategory = (filePath = "") => {
    const s = filePath.toLowerCase();
    if (s.includes("proposal")) return "proposal";
    if (s.includes("report")) return "report";
    return "other";
};

export default function AdminDashboard() {
    const [docs, setDocs] = useState([]);
    const [docErr, setDocErr] = useState("");
    const [tab, setTab] = useState("all");

    // イベント一覧
    const [events, setEvents] = useState([]);
    const [eventsErr, setEventsErr] = useState("");
    const [registrationCounts, setRegistrationCounts] = useState({});

    const loadEvents = async () => {
        setEventsErr("");

        // イベント一覧取得（新しい順）
        const { data, error } = await supabase
            .from("events")
            .select("id,slug,title_ja,title_en,capacity,starts_at")
            .order("starts_at", { ascending: false })
            .limit(50);

        if (error) {
            setEventsErr(error.message);
            return;
        }

        setEvents(data ?? []);

        // 各イベントの参加者数を取得
        const counts = {};
        for (const ev of data ?? []) {
            const { count } = await supabase
                .from("event_registrations")
                .select("*", { count: "exact", head: true })
                .eq("event_id", ev.id);
            counts[ev.id] = count || 0;
        }
        setRegistrationCounts(counts);
    };

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
            .createSignedUrl(file_path, 60);

        if (error) return alert(error.message);
        window.open(data.signedUrl, "_blank", "noreferrer");
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    useEffect(() => {
        loadDocs();
        loadEvents();
    }, []);

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
        <div className="mx-auto max-w-5xl px-4 py-10">
            <div className="flex items-center justify-between gap-3">
                <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                <button
                    onClick={signOut}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-100 hover:text-slate-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>

            {/* イベント参加者管理セクション */}
            <section className="mt-8">
                <div className="flex items-end justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">イベント参加者</h2>
                        <p className="mt-1 text-sm text-slate-600">各イベントの参加者一覧を確認</p>
                    </div>
                </div>

                {eventsErr && (
                    <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {eventsErr}
                    </div>
                )}

                {/* これからのイベント */}
                {(() => {
                    const now = new Date();
                    const upcomingEvents = events
                        .filter((ev) => new Date(ev.starts_at) >= now)
                        .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));
                    const pastEvents = events
                        .filter((ev) => new Date(ev.starts_at) < now)
                        .sort((a, b) => new Date(b.starts_at) - new Date(a.starts_at));

                    const renderEventList = (eventList, emptyMessage) => (
                        <div className="overflow-hidden rounded-2xl border border-slate-200">
                            <ul className="divide-y divide-slate-200">
                                {eventList.map((ev) => {
                                    const count = registrationCounts[ev.id] ?? 0;
                                    const isFull = ev.capacity !== null && count >= ev.capacity;

                                    return (
                                        <li key={ev.id} className="flex items-center justify-between gap-3 px-4 py-3">
                                            <div className="min-w-0">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <p className="truncate font-medium text-slate-900">
                                                        {ev.title_ja || ev.title_en}
                                                    </p>
                                                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                        isFull
                                                            ? "bg-red-100 text-red-700"
                                                            : "bg-green-100 text-green-700"
                                                    }`}>
                                                        {count} / {ev.capacity ?? "∞"}
                                                    </span>
                                                </div>
                                                <p className="mt-0.5 text-xs text-slate-500">
                                                    {new Date(ev.starts_at).toLocaleString()}
                                                </p>
                                            </div>

                                            <Link
                                                to={`/admin/events/${ev.id}/registrations`}
                                                className="shrink-0 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                                            >
                                                参加者を見る
                                            </Link>
                                        </li>
                                    );
                                })}

                                {!eventList.length && (
                                    <li className="px-4 py-6 text-sm text-slate-600">{emptyMessage}</li>
                                )}
                            </ul>
                        </div>
                    );

                    return (
                        <>
                            <div className="mt-6">
                                <h3 className="mb-3 text-sm font-semibold text-slate-700">これからのイベント</h3>
                                {renderEventList(upcomingEvents, "予定されているイベントがありません。")}
                            </div>

                            <div className="mt-6">
                                <h3 className="mb-3 text-sm font-semibold text-slate-700">過去のイベント</h3>
                                {renderEventList(pastEvents, "過去のイベントがありません。")}
                            </div>
                        </>
                    );
                })()}
            </section>

            {/* PDF管理セクション */}
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
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                tab === t.key
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
