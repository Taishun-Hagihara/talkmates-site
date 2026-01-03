import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLang } from "../contexts/LangContext";

function pickLang(lang, en, ja) {
    return lang === "ja" && ja ? ja : en;
}

function coverUrl(cover_path) {
    if (!cover_path) return "";
    const { data } = supabase.storage.from("event-covers").getPublicUrl(cover_path);
    return data?.publicUrl || "";
}

export default function Events() {
    const { lang } = useLang();
    const [nextEvent, setNextEvent] = useState(null);
    const [pastEvents, setPastEvents] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            setError("");
            const nowIso = new Date().toISOString();

            const nextRes = await supabase
                .from("events")
                .select("id,slug,starts_at,location,cover_path,title_en,title_ja,description_en,description_ja,apply_url")
                .gte("starts_at", nowIso)
                .order("starts_at", { ascending: true })
                .limit(1)
                .maybeSingle();

            const pastRes = await supabase
                .from("events")
                .select("id,slug,starts_at,location,cover_path,title_en,title_ja,description_en,description_ja")
                .lt("starts_at", nowIso)
                .order("starts_at", { ascending: false })
                .limit(24);

            if (nextRes.error) return setError(nextRes.error.message);
            if (pastRes.error) return setError(pastRes.error.message);

            setNextEvent(nextRes.data);
            setPastEvents(pastRes.data ?? []);
        })();
    }, []);

    const Card = ({ e }) => {
        const title = pickLang(lang, e.title_en, e.title_ja);
        const desc = pickLang(lang, e.description_en, e.description_ja);
        const img = coverUrl(e.cover_path);

        return (
            <Link
                to={`/events/${e.slug}`}
                className="block overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 no-underline"
            >
                {img ? (
                    <img src={img} alt="" className="block h-45 w-full object-cover" />
                ) : (
                    <div className="h-45 w-full bg-slate-100" />
                )}

                <div className="p-3.5">
                    <div className="text-sm text-slate-500">
                        {new Date(e.starts_at).toLocaleDateString()}
                    </div>
                    <div className="mt-1.5 font-bold">{title}</div>
                    {desc && (
                        <div className="mt-1.5 text-sm text-slate-700">
                            {desc.length > 90 ? desc.slice(0, 90) + "…" : desc}
                        </div>
                    )}
                </div>
            </Link>
        );
    };

    return (
        <div>
            <h1 className="text-[3.2em] leading-[1.1]">{lang === "ja" ? "イベント" : "Events"}</h1>

            {error && <p className="text-red-600">Error: {error}</p>}

            <h2 className="mt-4.5 text-2xl font-semibold">
                {lang === "ja" ? "次回イベント" : "Next Event"}
            </h2>
            {nextEvent ? (
                <div className="mt-3 max-w-130">
                    <Card e={nextEvent} />
                    {nextEvent.apply_url && (
                        <a
                            href={nextEvent.apply_url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-2.5 inline-block font-medium text-[#646cff] no-underline transition-colors hover:text-[#535bf2]"
                        >
                            {lang === "ja" ? "参加する" : "Apply"}
                        </a>
                    )}
                </div>
            ) : (
                <p>{lang === "ja" ? "準備中です。" : "Coming soon."}</p>
            )}

            <h2 className="mt-7 text-2xl font-semibold">
                {lang === "ja" ? "過去イベント" : "Past Events"}
            </h2>

            <div className="mt-3 grid gap-3.5 grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
                {pastEvents.map((e) => (
                    <Card key={e.id} e={e} />
                ))}
            </div>
        </div>
    );
}
