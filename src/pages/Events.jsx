import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLang } from "../contexts/LangContext";
import Card from "../components/Card";


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

//.lengthに関しては表示するものがあるかどうかということ
    //.data：Supabaseの返す「データ本体」フィールド（Supabase仕様）
    return (
        <div className="mx-auto w-full max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
            <h1 className="mt-8 text-4xl font-bold tracking-tight text-slate-800">
                {(lang === "ja") ? "イベント" : "Events"}
            </h1>

            <div className="mt-10">
                <div className="flex items-end justify-between gap-3">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                        {lang === "ja" ? (
                            <span>
                                <span className="text-green-600">次回</span>イベント・予約
                            </span>
                        ) : (
                                <div><span className="text-green-600">Next</span>Event・reservation</div>
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
       


            <div className="mt-20">
                <h2 className="text-3xl font-bold tracking-tight text-slate-800">
                    {lang === "ja" ? (
                        <span>
                            <span className="text-green-600">過去</span>イベント
                        </span>
                    ) : (
                        "Past Events"
                    )}
                </h2>

                <div className="mt-3 h-px w-full bg-slate-200" />

                {pastEvents.length ? (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {pastEvents.map((e) => (
                            <Card key={e.id} e={e} />
                        ))}
                    </div>
                ) : (<div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-600">
                    {lang === "ja" ? "準備中です。" : "Coming soon."}
                </div>)}
            </div>
        </div>
    );

}
