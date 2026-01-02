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
                style={{
                    textDecoration: "none",
                    color: "inherit",
                    border: "1px solid #eee",
                    borderRadius: 16,
                    overflow: "hidden",
                    display: "block",
                    background: "white",
                }}
            >
                {img ? (
                    <img
                        src={img}
                        alt=""
                        style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                    />
                ) : (
                    <div style={{ width: "100%", height: 180, background: "#f3f4f6" }} />
                )}

                <div style={{ padding: 14 }}>
                    <div style={{ fontSize: 14, color: "#64748b" }}>
                        {new Date(e.starts_at).toLocaleDateString()}
                    </div>
                    <div style={{ fontWeight: 700, marginTop: 6 }}>{title}</div>
                    {desc && (
                        <div style={{ marginTop: 6, color: "#334155", fontSize: 14 }}>
                            {desc.length > 90 ? desc.slice(0, 90) + "…" : desc}
                        </div>
                    )}
                </div>
            </Link>
        );
    };

    return (
        <div>
            <h1>{lang === "ja" ? "イベント" : "Events"}</h1>

            {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

            <h2 style={{ marginTop: 18 }}>{lang === "ja" ? "次回イベント" : "Next Event"}</h2>
            {nextEvent ? (
                <div style={{ marginTop: 12, maxWidth: 520 }}>
                    <Card e={nextEvent} />
                    {nextEvent.apply_url && (
                        <a
                            href={nextEvent.apply_url}
                            target="_blank"
                            rel="noreferrer"
                            style={{ display: "inline-block", marginTop: 10 }}
                        >
                            {lang === "ja" ? "参加する" : "Apply"}
                        </a>
                    )}
                </div>
            ) : (
                <p>{lang === "ja" ? "準備中です。" : "Coming soon."}</p>
            )}

            <h2 style={{ marginTop: 28 }}>{lang === "ja" ? "過去イベント" : "Past Events"}</h2>

            <div
                style={{
                    marginTop: 12,
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                    gap: 14,
                }}
            >
                {pastEvents.map((e) => (
                    <Card key={e.id} e={e} />
                ))}
            </div>
        </div>
    );
}
