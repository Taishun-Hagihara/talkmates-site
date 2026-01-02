import { Link, Outlet } from "react-router-dom";
import { useLang } from "../contexts/LangContext";
import TalkMatesLogo from "../assets/TalkMatesLogo.png";

export default function Layout() {
    const { lang, toggle } = useLang();

    return (
        <div className="w-full h-500 font-sans bg-white">
            <header className="border-b border-slate-200 px-4 py-4">
                <nav className="flex items-center gap-3">
                    <img src={TalkMatesLogo} alt="talkmates logo" className="h-18 w-18" />
                    <Link
                        to="/"
                        className="font-medium text-[#646cff] no-underline transition-colors hover:text-[#535bf2]"
                    >
                        Home
                    </Link>
                    <Link
                        to="/events"
                        className="font-medium text-[#646cff] no-underline transition-colors hover:text-[#535bf2]"
                    >
                        Events
                    </Link>

                    <button
                        onClick={toggle}
                        className="ml-auto cursor-pointer rounded-[10px] border border-slate-200 bg-white px-2.5 py-2 font-medium text-slate-900 transition-colors hover:border-[#646cff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#646cff]"
                    >
                        {lang === "en" ? "EN" : "JA"}
                    </button>
                </nav>
            </header>

            <main className="mx-auto w-full max-w-245 px-6 py-6">
                <Outlet />
            </main>
        </div>
    );
}
