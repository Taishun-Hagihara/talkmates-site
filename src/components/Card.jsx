import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLang } from "../contexts/LangContext";
import { Badge } from "./ui";
import { CalendarDays, MapPin } from "lucide-react";

function pickLang(lang, en, ja) {
  return lang === "ja" && ja ? ja : en;
}

function coverUrl(cover_path) {
  if (!cover_path) return "";
  const { data } = supabase.storage.from("event-covers").getPublicUrl(cover_path);
  return data?.publicUrl || "";
}

const Card = ({ e }) => {
  const { lang } = useLang();
  const title = pickLang(lang, e.title_en, e.title_ja);
  const desc = pickLang(lang, e.description_en, e.description_ja);
  const img = coverUrl(e.cover_path);

  const dateText = new Date(e.starts_at).toLocaleString(lang === "ja" ? "ja-JP" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  return (
    <Link
      to={`/events/${e.slug}`}
      className="group block overflow-hidden rounded-2xl border-2 border-slate-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-green-200 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
    >
      <div className="relative aspect-[16/9] w-full bg-slate-100">
        {img ? (
          <img
            src={img}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-500">
            No Image
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/0 to-black/0" />
      </div>

      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral" className="bg-slate-100 text-slate-700">
            <CalendarDays className="h-3.5 w-3.5" />
            {dateText}
          </Badge>
          {e.location && (
            <Badge variant="neutral" className="bg-slate-100 text-slate-700">
              <MapPin className="h-3.5 w-3.5" />
              {e.location}
            </Badge>
          )}
        </div>

        <div className="mt-3 text-lg font-black tracking-tight text-slate-900">
          {title}
        </div>

        {desc && (
          <div className="mt-2 text-sm leading-relaxed text-slate-600">
            {desc.length > 110 ? desc.slice(0, 110) + "…" : desc}
          </div>
        )}

        <div className="mt-4 text-sm font-bold text-green-700 group-hover:text-green-800">
          {lang === "ja" ? "詳細を見る →" : "View details →"}
        </div>
      </div>
    </Link>
  );
};

export default Card;
