import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLang } from "../contexts/LangContext";

function pickLang(lang, en, ja) {
    return (lang === "ja") && ja ? ja : en;
}
//coverUrl は 「Supabase Storage に保存されている画像のパス（cover_path）から、表示に使えるURL文字列を作って返す」 ための関数
function coverUrl(cover_path) {
    if (!cover_path) return "";
    const { data } = supabase.storage.from("event-covers").getPublicUrl(cover_path);
    return data?.publicUrl || "";
}

export default function Events() {
    const { lang } = useLang();
    const [nextEvents, setNextEvents] = useState([]);
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
                .limit(10);

            const pastRes = await supabase
                .from("events")
                .select("id,slug,starts_at,location,cover_path,title_en,title_ja,description_en,description_ja")
                .lt("starts_at", nowIso)
                .order("starts_at", { ascending: false })
                .limit(24);

            

            setNextEvents(nextRes.data ?? []);

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
                className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
                
                <div className="relative aspect-video w-full bg-slate-100 h-120">
                    <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
                    
                </div>

                <div className="p-4">
                    <div className="flex items-center gap-2">
                        <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                            {new Date(e.starts_at).toLocaleDateString()}
                        </div>
                    </div>

                    <div className="mt-2 text-[15px] font-bold leading-snug tracking-tight">
                        {title}
                    </div>

                    {desc && (
                        <div className="mt-2 text-sm leading-relaxed text-slate-700">
                            {desc.length > 90 ? desc.slice(0, 90) + "…" : desc}
                        </div>
                    )}
                </div>
            </Link>
        );

    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-800">
                {lang === "ja" ? "イベント" : "Events"}
            </h1>

            
         
            <div className="mt-10">
                <div className="flex items-end justify-between gap-3">
                    <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                        {lang === "ja" ? (
                            <span>
                                <span className="text-green-600">次回</span>イベント
                            </span>
                        ) : (
                            "Next Event"
                        )}
                    </h2>
                </div>

                <div className="mt-3 h-px w-full bg-slate-200" />

                {nextEvents.length ? (
                    <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {nextEvents.map((e) => (
                            <Card key={e.id} e={e} />
                        ))}
                    </div>
                ) : (
                    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-600">
                        {lang === "ja" ? "準備中です。" : "Coming soon."}
                    </div>
                )}

            </div>


            <div className="mt-12">
                <h2 className="text-2xl font-bold tracking-tight text-slate-800">
                    {lang === "ja" ? (
                        <span>
                            <span className="text-green-600">過去</span>イベント
                        </span>
                    ) : (
                        "Past Events"
                    )}
                </h2>

                <div className="mt-3 h-px w-full bg-slate-200" />

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {pastEvents.map((e) => (
                        <Card key={e.id} e={e} />
                    ))}
                </div>
            </div>
        </div>
    );

}
