//おおよそ理解した。ただ、LangContextがexprt functionの中に入っていないのでconst LangContext = createContext(null);が独立しているような違和感がある。
import { createContext, useContext, useMemo, useState } from "react";

const LangContext = createContext(null);

export function LangProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "ja");

    const value = useMemo(
        () => ({
            lang:lang,
            toggle: () => {
                const next = (lang === "en") ? "ja" : "en";
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
    //以下はProvider内で呼び出されていなかったときにそく落とすシステム
    if (!ctx) throw new Error("useLang must be used within LangProvider");
    return ctx;
}
