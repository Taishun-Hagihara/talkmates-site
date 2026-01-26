//理解済み
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLang } from "../contexts/LangContext";

function pickLang(lang, en, ja) {
    return lang === "ja" && ja ? ja : en;
}

export default function EventDetail() {
    const { slug } = useParams();
    const { lang } = useLang();
    const [event, setEvent] = useState(null);


    useEffect(() => {
        (async () => {
           
            const { data} = await supabase
                .from("events")
                .select("slug,starts_at,location,cover_path,title_en,title_ja,description_en,description_ja,apply_url")
                .eq("slug", slug)
                .maybeSingle();

            setEvent(data);
        })();
    }, [slug]);


    if (!event) return (
        <div>
            <p>実装中...</p>
            <p>一旦は、Google Formのリンクをここに載せておくつもり、後にここから応募できるようにする</p>
        </div>
    );

    const title = pickLang(lang, event.title_en, event.title_ja);
    const desc = pickLang(lang, event.description_en, event.description_ja);
    const img = event.cover_path
        ? supabase.storage.from("event-covers").getPublicUrl(event.cover_path).data.publicUrl
        : "";

    return (
        <div className="mx-auto w-full max-w-4xl px-4 pb-12 sm:px-6 lg:px-8">
            
            <div className="mt-8">
                <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                    {title}
                </h1>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                        {new Date(event.starts_at).toLocaleString()}
                    </span>

                    {event.location && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                            {event.location}
                        </span>
                    )}
                </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
                <div className="relative aspect-video w-full h-120">
                    <img
                        src={img}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>
            </div>

            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
                    {desc}
                </p>
            </div>
            

            <div className="mt-6 flex flex-wrap gap-3">
                <Link
                    to={`/events/${event.slug}/register`}
                    className="inline-flex items-center justify-center rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                >
                    {lang === "ja" ? "参加する" : "Register"}
                </Link>
            </div>
        </div>
    );

}
