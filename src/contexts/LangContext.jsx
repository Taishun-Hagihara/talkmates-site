//ボチボチの理解って感じだけど螺旋的に学習が進んでいくものだとして一旦他のところを勉強する。。
//propsとuseContextの理解を上げる必要がある
import { createContext, useContext, useMemo, useState } from "react";

const LangContext = createContext(null);

export function LangProvider({ children }) {
    const [lang, setLang] = useState(() => localStorage.getItem("lang") || "ja");
    //localStorageに保存されているlangの値について評価している
    //() => localStorage.getItem()とすることでレンダリング時に読み込むのをなくしている。
//[lang]は依存配列、useMemoは依存配列を取れる
    //const obj = { A: B, C: D };と書いた時オブジェクトの中で、キーと値を決めてるobj.AがBでobj.CがDであるそれを応用して以下
    //setItem("lang",,next)でlang問いうキーにnextという値を保存できる。

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
//<何か.Provider value={配りたい値}>
//  {配りたい範囲（子たち）}
//</何か.Provider>
//上記３行のように書いたときvalueの値を中に入ってる {children}：配る対象（この中の子たち全員）
//Contextに対し.Providerが存在する。

export function useLang() {
    const ctx = useContext(LangContext);
    if (!ctx) throw new Error("useLang must be used within LangProvider");
    return ctx;
}
