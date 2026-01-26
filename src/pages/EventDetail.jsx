import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLang } from "../contexts/LangContext";
import { Badge, Button, Panel, EmptyState } from "../components/ui";
import { CalendarDays, MapPin, ArrowLeft } from "lucide-react";

function pickLang(lang, en, ja) {
  return lang === "ja" && ja ? ja : en;
}

export default function EventDetail() {
  const { slug } = useParams();
  const { lang } = useLang();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data } = await supabase
        .from("events")
        .select("slug,starts_at,location,cover_path,title_en,title_ja,description_en,description_ja,capacity")
        .eq("slug", slug)
        .maybeSingle();

      setEvent(data ?? null);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-slate-600">
        Loading...
      </div>
    );
  }

  if (!event) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <EmptyState
          title={lang === "ja" ? "イベントが見つかりません" : "Event not found"}
          description={lang === "ja" ? "URLを確認してください。" : "Please check the URL."}
          action={
            <Link to="/events">
              <Button variant="primary">{lang === "ja" ? "イベント一覧へ" : "Back to events"}</Button>
            </Link>
          }
        />
      </div>
    );
  }

  const title = pickLang(lang, event.title_en, event.title_ja);
  const desc = pickLang(lang, event.description_en, event.description_ja);
  const img = event.cover_path
    ? supabase.storage.from("event-covers").getPublicUrl(event.cover_path).data.publicUrl
    : "";

  const dateText = new Date(event.starts_at).toLocaleString(lang === "ja" ? "ja-JP" : "en-US", {
    dateStyle: "full",
    timeStyle: "short",
  });

  return (
    <div className="mx-auto w-full max-w-4xl px-4 pb-14 sm:px-6 lg:px-8">
      <div className="mt-10">
        <Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          {lang === "ja" ? "イベント一覧に戻る" : "Back to events"}
        </Link>

        <h1 className="mt-4 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge variant="neutral">
            <CalendarDays className="h-3.5 w-3.5" />
            {dateText}
          </Badge>
          {event.location && (
            <Badge variant="neutral">
              <MapPin className="h-3.5 w-3.5" />
              {event.location}
            </Badge>
          )}
          {event.capacity !== null && (
            <Badge variant="info">
              {lang === "ja" ? "定員" : "Capacity"}: {event.capacity}
            </Badge>
          )}
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border-2 border-slate-100 bg-slate-100">
        <div className="relative aspect-[16/9] w-full">
          {img ? (
            <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-slate-500">
              No Image
            </div>
          )}
        </div>
      </div>

      <Panel className="mt-6 p-6">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed text-slate-800">
          {desc}
        </p>
      </Panel>

      <div className="mt-6">
        <Link to={`/events/${event.slug}/register`}>
          <Button variant="primary" size="lg">
            {lang === "ja" ? "参加する" : "Register"}
          </Button>
        </Link>
      </div>
    </div>
  );
}
