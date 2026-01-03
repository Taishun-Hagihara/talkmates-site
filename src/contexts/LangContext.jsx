import { createContext, useContext, useMemo, useState } from "react";

const LangContext = createContext(null);

export function LangProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "en");

    const value = useMemo(
        () => ({
            lang,
            toggle: () => {
                const next = lang === "en" ? "ja" : "en";
                setLang(next);
                localStorage.setItem("lang", next);
            },
        }),
        [lang]
    );

    return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
    const ctx = useContext(LangContext);
    if (!ctx) throw new Error("useLang must be used within LangProvider");
    return ctx;
}
