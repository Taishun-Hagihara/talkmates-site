import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLang } from "../contexts/LangContext";

function pickLang(lang, en, ja) {
    return lang === "ja" && ja ? ja : en;
}

export default function EventDetail() {
    const { slug } = useParams();
    const { lang } = useLang();
    const [event, setEvent] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        (async () => {
            setError("");
            const { data, error } = await supabase
                .from("events")
                .select("slug,starts_at,location,cover_path,title_en,title_ja,description_en,description_ja,apply_url")
                .eq("slug", slug)
                .maybeSingle();

            if (error) setError(error.message);
            else setEvent(data);
        })();
    }, [slug]);

    if (error) return <p className="text-red-600">Error: {error}</p>;
    if (!event) return <p>Loading...</p>;

    const title = pickLang(lang, event.title_en, event.title_ja);
    const desc = pickLang(lang, event.description_en, event.description_ja);
    const img = event.cover_path
        ? supabase.storage.from("event-covers").getPublicUrl(event.cover_path).data.publicUrl
        : "";

    return (
        <div>
            <h1 className="text-[3.2em] leading-[1.1]">{title}</h1>
            <p className="text-slate-500">
                {new Date(event.starts_at).toLocaleString()} {event.location ? ` • ${event.location}` : ""}
            </p>

            {img && (
                <img src={img} alt="" className="w-full max-h-105 rounded-2xl object-cover" />
            )}

            {desc && <p className="mt-3.5 leading-[1.7]">{desc}</p>}

            {event.apply_url && (
                <a
                    href={event.apply_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-block font-medium text-[#646cff] no-underline transition-colors hover:text-[#535bf2]"
                >
                    {lang === "ja" ? "参加する" : "Apply"}
                </a>
            )}
        </div>
    );
}
