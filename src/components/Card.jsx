//理解済み
//supabaseについての理解が浅いと思ってる。

import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLang } from "../contexts/LangContext";


function pickLang(lang, en, ja) {
    return (lang === "ja") && ja ? ja : en;
}
//coverUrl は 「Supabase Storage に保存されている画像のパス（cover_path）から、表示に使えるURL文字列を作って返す」 ための関数
//cover_pathにはsupabaseで画像の情報を入れている。
//supabaseのstorageのevent-coversからcover_path のファイルについて、公開URLを生成します。
//data が存在すれば → data.publicUrl data がなければ → undefined
function coverUrl(cover_path) {
    if (!cover_path) return "";
    const { data } = supabase.storage.from("event-covers").getPublicUrl(cover_path);
    return data?.publicUrl || "";
}


//eには.dataが入ります。
const Card = ({ e }) => {
    const { lang } = useLang();
    const title = pickLang(lang, e.title_en, e.title_ja);
    const desc = pickLang(lang, e.description_en, e.description_ja);
    const img = coverUrl(e.cover_path);

    return (
        <Link
            to={`/events/${e.slug}`}
            className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >

            <div className="relative aspect-video w-full bg-slate-100 h-120">
                <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" />

            </div>

            <div className="p-4">
                <div className="flex items-center gap-2">
                    <div className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        {new Date(e.starts_at).toLocaleDateString()}
                    </div>
                </div>

                <div className="mt-2 text-[15px] font-bold leading-snug tracking-tight">
                    {title}
                </div>

                {desc && (
                    <div className="mt-2 text-sm leading-relaxed text-slate-700">
                        {desc.length > 90 ? desc.slice(0, 90) + "…" : desc}
                    </div>
                )}
            </div>
        </Link>
    );

};




export default Card;
