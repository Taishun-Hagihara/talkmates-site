import { Link, Outlet } from "react-router-dom";
import { useLang } from "../contexts/LangContext";

export default function Layout() {
    const { lang, toggle } = useLang();

    return (
        <div style={{ fontFamily: "system-ui" }}>
            <header style={{ padding: 16, borderBottom: "1px solid #eee" }}>
                <nav style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <Link to="/">Home</Link>
                    <Link to="/events">Events</Link>

                    <button
                        onClick={toggle}
                        style={{
                            marginLeft: "auto",
                            padding: "8px 10px",
                            borderRadius: 10,
                            border: "1px solid #ddd",
                            background: "white",
                            cursor: "pointer",
                        }}
                    >
                        {lang === "en" ? "EN" : "JA"}
                    </button>
                </nav>
            </header>

            <main style={{ padding: 24, maxWidth: 980, margin: "0 auto" }}>
                <Outlet />
            </main>
        </div>
    );
}
