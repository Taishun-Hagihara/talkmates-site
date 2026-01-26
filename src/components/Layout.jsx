import { Link, Outlet, useLocation } from "react-router-dom";
import { useLang } from "../contexts/LangContext";
import TalkMatesLogo from "../assets/TalkMatesLogo.png";
import { cx } from "./ui";
import { Home, CalendarDays, Languages, Shield } from "lucide-react";

export default function Layout() {
  const { lang, toggle } = useLang();
  const loc = useLocation();

  const navItem = (to, label, Icon) => {
    const active = loc.pathname === to || (to === "/events" && loc.pathname.startsWith("/events"));
    return (
      <Link
        to={to}
        className={cx(
          "inline-flex items-center gap-2 rounded-xl border-2 px-3 py-2 text-sm font-semibold transition",
          active
            ? "border-green-200 bg-green-50 text-green-700"
            : "border-slate-100 bg-white text-slate-700 hover:border-green-200 hover:bg-green-50 hover:text-green-700"
        )}
      >
        <Icon className="h-4 w-4" />
        <span className="hidden sm:inline">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b-2 border-slate-100 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <Link to="/" className="flex items-center gap-3 no-underline">
            <img src={TalkMatesLogo} alt="TalkMates" className="h-10 w-10 rounded-2xl" />
            <div className="leading-tight">
              <div className="text-base font-black tracking-tight text-slate-900">
                <span className="text-green-600">Talk</span>Mates
              </div>
              <div className="text-xs font-semibold text-slate-500">
                {lang === "ja" ? "留学生とのイベントサークル" : "Event circle"}
              </div>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            {navItem("/", lang === "ja" ? "ホーム" : "Home", Home)}
            {navItem("/events", lang === "ja" ? "イベント" : "Events", CalendarDays)}

            <button
              onClick={toggle}
              className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
            >
              <Languages className="h-4 w-4" />
              {lang === "en" ? "EN" : "JA"}
            </button>

            <Link
              to="/admin/login"
              className="hidden md:inline-flex items-center gap-2 rounded-xl border-2 border-slate-100 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-green-200 hover:bg-green-50 hover:text-green-700"
            >
              <Shield className="h-4 w-4" />
              Staff
            </Link>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-16 border-t-2 border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-medium text-slate-600">
            made by 萩原大竣 <span className="text-blue-600">/</span> taishun-hagihara
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <a
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
              href="https://taishun-portfolio.com/"
              target="_blank"
              rel="noreferrer"
            >
              ポートフォリオサイトへ↗︎
            </a>
            <a
              className="text-sm font-semibold text-green-700 hover:text-green-800"
              href="https://www.instagram.com/talkmates_2025/"
              target="_blank"
              rel="noreferrer"
            >
              Instagram↗︎
            </a>
            <Link className="text-sm font-semibold text-slate-700 hover:text-slate-900" to="/admin/login">
              Staff Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
