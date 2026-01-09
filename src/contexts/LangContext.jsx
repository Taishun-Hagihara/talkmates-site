// ボチボチの感じだけど、螺旋的に学習が進んでいるとして一旦他のところを勉強する
import { createContext, useContext, useMemo, useState } from "react";

const LangContext = createContext(null);

export function LangProvider({ children }) {
    // localStorage に保存された lang を初期値として読む
    // 初回レンダリングだけ実行するために関数を渡す
    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "ja");
    // [lang] は依存配列、useMemo は依存が変わると値を再計算する
    // setItem("lang", next) で localStorage に保存する

    const value = useMemo(
        () => ({
            lang: lang,
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
// <何か.Provider value={配りたい値}>
//   {配りたい子たち}
// </何か.Provider>
// Provider が Context の値を子コンポーネントへ配る

export function useLang() {
    const ctx = useContext(LangContext);
    if (!ctx) throw new Error("useLang must be used within LangProvider");
    return ctx;
}
