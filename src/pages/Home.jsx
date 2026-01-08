import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLang } from "../contexts/LangContext";
import { supabase } from "../lib/supabase";
import Card from "../components/Card";

export default function Home() {
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
                .select("id,slug,starts_at,location,cover_path,title_en,title_ja,description_en,description_ja")
                .gte("starts_at", nowIso)
                .order("starts_at", { ascending: true })
                .limit(10);

            const res = await supabase
                .from("events")
                .select("id,slug,starts_at,location,cover_path,title_en,title_ja,description_en,description_ja")
                .lt("starts_at", nowIso)
                .order("starts_at", { ascending: false })
                .limit(10);

            if (nextRes.error) return setError(nextRes.error.message);
            if (res.error) return setError(res.error.message);
            setNextEvents(nextRes.data ?? []);
            setPastEvents(res.data ?? []);
        })();
    }, []);

    return (
        <div className="w-full">

            {lang=="ja" ? <header className="w-13/15 mx-auto">
                <h1 className="text-slate-800 text-4xl mt-6 font-bold">
                    <span className="text-green-600">Talk</span>Mates
                </h1>
                <p className="text-slate-800 text-2xl font-bold mt-6">イベントサークル</p>
                <p className="text-slate-800 text-2xl font-bold">留学生と一緒に活動しよう！</p>
                <div className="mt-6">
                    <a
                        href="https://www.instagram.com/talkmates_2025/"
                        className="text-blue-500"
                    >
                        instagramへ↗︎
                    </a>
                </div>
                <div className="">
                    <h2 className="text-slate-800 text-2xl mt-6 font-bold">TalkMatesとは？？</h2>
                    <p className="text-slate-800 mt-3">同志社大学登録団体サークルで、留学生の数が同志社No.1👑</p>
                    <p className="text-slate-800">英語が苦手な方でも大歓迎🥺</p>
                </div>
            </header> : <header className="w-13/15 mx-auto">
                  <h1 className="text-slate-800 text-4xl mt-6 font-bold">
                    <span className="text-green-600">Talk</span>Mates
                  </h1>

                  <p className="text-slate-800 text-2xl font-bold mt-6">Event Circle</p>
                  <p className="text-slate-800 text-2xl font-bold">
                    Let’s join activities with international students!
                  </p>

                  <div className="mt-6">
                    <a
                      href="https://www.instagram.com/talkmates_2025/"
                      className="text-blue-500"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Go to Instagram ↗︎
                    </a>
                  </div>

                  <div>
                    <h2 className="text-slate-800 text-2xl mt-6 font-bold">
                      What is TalkMates?
                    </h2>
                    <p className="text-slate-800 mt-3">
                      We’re an officially registered circle at Doshisha University, and we have
                      the largest number of international students on campus 👑
                    </p>
                    <p className="text-slate-800">
                      Even if you’re not confident in English, you’re more than welcome 🥺
                    </p>
                  </div>
                </header>

            

            }
            

            <main className="w-full">
                
                <section className="mt-10">

                    <div className="w-13/15 mx-auto flex items-end justify-between gap-3">
                        <h2 className="text-slate-800 text-2xl font-bold">
                            <span className="text-green-600">次回</span>イベント
                        </h2>

                        <Link
                            to="/events"
                            className=" inline-flex items-center justify-center rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                        >
                            {lang === "ja" ? "詳しく見る" : "Details"}
                        </Link>

                    </div>



                    <div className="mt-5">
                        <div className="w-13/15 mx-auto">
                            <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
                                <div className="flex gap-4 snap-x snap-mandatory scroll-px-4">
                                    {nextEvents.map((e) => (
                                        <div
                                            key={e.id}
                                            className="snap-start shrink-0 w-[85%] sm:w-90 lg:w-95"
                                        >
                                            <Card e={e} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!nextEvents.length && (
                                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-600">
                                    {lang === "ja" ? "準備中です。" : "Coming soon."}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                
                <section className="mt-10">
                    
                    <div className="w-13/15 mx-auto flex items-end justify-between gap-3">
                        <h2 className="text-slate-800 text-2xl font-bold">
                            <span className="text-green-600">イベント記録</span> 2025年
                        </h2>

                        <Link
                            to="/events"
                            className=" inline-flex items-center justify-center rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                        >
                            {lang === "ja" ? "すべて見る" : "View all"}
                        </Link>

                    </div>

                
                    <div className="mt-5">
                      
                        <div className="w-13/15 mx-auto">
                            <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
                                <div className="flex gap-4 snap-x snap-mandatory scroll-px-4">
                                    {pastEvents.map((e) => (
                                        <div
                                            key={e.id}
                                            className="snap-start shrink-0 w-[85%] sm:w-90 lg:w-95"
                                        >
                                            <Card e={e} />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {!pastEvents.length && (
                                <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-slate-600">
                                    {lang === "ja" ? "準備中です。" : "Coming soon."}
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
            <footer>
                <div className="mt-15">
                    <div className="w-13/15 mx-auto flex justify-between gap-3">
                        <h3 className="text-1xl text-slate-800"><span className="text-green-600">幹部</span>ページはこちら</h3>
                        <div>
                            <Link
                                to="/admin/login"
                                className="inline-flex items-center justify-center rounded-full bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                            >
                                Staff Login
                            </Link>

                        </div>
                    </div>
                </div>
        </footer>
            
        </div>
    );
}
