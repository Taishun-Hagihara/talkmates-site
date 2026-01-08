//理解済み
import { Link, Outlet } from "react-router-dom";
import { useLang } from "../contexts/LangContext";
import TalkMatesLogo from "../assets/TalkMatesLogo.png";

export default function Layout() {
    const { lang, toggle } = useLang();

    return (
        <div className="w-full font-sans bg-white">
            <header className="border-b border-slate-200 px-4 py-4 ">
                <nav className="flex items-center gap-3">
                    <img src={TalkMatesLogo} alt="talkmates logo" className="h-18 w-18" />
                    <div className="ml-auto flex items-center gap-3 ">
                        <div className="text-slate-600 cursor-pointer rounded-[10px] border border-slate-200 bg-white px-2.5 py-2 font-medium  transition-colors hover:border-green-500 hover:bg-green-500 focus-visible:outline-none focus-visible:ring-2">
                            <Link
                                to="/"
                                className="font-medium  no-underline transition-colors hover:text-slate-600"
                            >
                                Home
                            </Link>
                        </div>
                        <div className=" text-slate-600 cursor-pointer rounded-[10px] border hover:bg-green-500 border-slate-200 bg-white px-2.5 py-2 font-medium  transition-colors hover:border-green-500 focus-visible:outline-none focus-visible:ring-2">
                            <Link
                                to="/events"
                                className="font-medium  no-underline transition-colors hover:text-slate-600 "
                            >
                                Events
                            </Link>
                        </div>
                        <button
                            onClick={toggle}
                            className="text-slate-600 m-0 ml-auto cursor-pointer rounded-[10px] border border-slate-200 bg-white px-2.5 py-2 font-medium  transition-colors hover:border-green-500 hover:bg-green-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#646cff]"
                        >
                            {lang === "en" ? "EN" : "JA"}
                        </button>

                    </div>
                    
                </nav>
            </header>

            <main className="">
                <Outlet />
            </main>
            <footer className="mt-10 border-t border-slate-200 px-4 py-4">
                <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-600">
                        made by 萩原大竣 <span className="text-blue-600"> / </span>taishun-hagihara
                    </p>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">

                        <a
                            className="text-sm font-medium text-blue-500 hover:text-blue-600"
                            href="https://taishun-portfolio.com/"
                            target="_blank"
                            rel="noreferrer"
                        >
                            ポートフォリオサイトへ↗︎
                        </a>

                    </div>
                </div>
            </footer>

        </div>
    );
}
