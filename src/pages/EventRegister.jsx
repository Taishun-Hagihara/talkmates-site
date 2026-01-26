import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useLang } from "../contexts/LangContext";
import {
    campusOptions,
    japaneseLevelOptions,
    japaneseMotivationOptions,
    englishLevelOptions,
} from "../lib/formOptions";

function pickLang(lang, en, ja) {
    return lang === "ja" && ja ? ja : en;
}

export default function EventRegister() {
    const { slug } = useParams();
    const { lang } = useLang();

    const [event, setEvent] = useState(null);
    const [currentCount, setCurrentCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    // フォーム state
    const [campus, setCampus] = useState("");
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [hometown, setHometown] = useState("");
    const [japaneseLevel, setJapaneseLevel] = useState("");
    const [japaneseMotivation, setJapaneseMotivation] = useState("");
    const [englishLevel, setEnglishLevel] = useState("");

    // イベント情報と参加者数を取得
    useEffect(() => {
        (async () => {
            setLoading(true);

            // イベント情報取得
            const { data: eventData } = await supabase
                .from("events")
                .select("id,slug,title_en,title_ja,starts_at,location,capacity")
                .eq("slug", slug)
                .maybeSingle();

            if (!eventData) {
                setEvent(null);
                setLoading(false);
                return;
            }

            setEvent(eventData);

            // 参加者数取得（表示用、簡易カウント）
            const { count } = await supabase
                .from("event_registrations")
                .select("*", { count: "exact", head: true })
                .eq("event_id", eventData.id);

            setCurrentCount(count || 0);
            setLoading(false);
        })();
    }, [slug]);

    const isFull = event?.capacity !== null && currentCount >= event?.capacity;

    const validate = () => {
        if (!name.trim()) {
            setError(lang === "ja" ? "名前を入力してください" : "Please enter your name");
            return false;
        }
        if (name.trim().length > 100) {
            setError(lang === "ja" ? "名前は100文字以内で入力してください" : "Name must be 100 characters or less");
            return false;
        }
        if (!phone.trim()) {
            setError(lang === "ja" ? "電話番号を入力してください" : "Please enter your phone number");
            return false;
        }
        if (!hometown.trim()) {
            setError(lang === "ja" ? "出身地を入力してください" : "Please enter your hometown");
            return false;
        }
        if (!campus) {
            setError(lang === "ja" ? "キャンパスを選択してください" : "Please select a campus");
            return false;
        }
        if (!japaneseLevel) {
            setError(lang === "ja" ? "日本語レベルを選択してください" : "Please select your Japanese level");
            return false;
        }
        if (!japaneseMotivation) {
            setError(lang === "ja" ? "参加動機を選択してください" : "Please select your motivation");
            return false;
        }
        if (!englishLevel) {
            setError(lang === "ja" ? "英語レベルを選択してください" : "Please select your English level");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validate()) return;

        setSubmitting(true);

        // RPC で定員チェック＋INSERT を原子的に実行
        const { data, error: rpcError } = await supabase.rpc("register_for_event", {
            p_event_id: event.id,
            p_campus: campus,
            p_name: name.trim(),
            p_phone: phone.trim(),
            p_hometown: hometown.trim(),
            p_japanese_level: japaneseLevel,
            p_japanese_motivation: japaneseMotivation,
            p_english_level: englishLevel,
        });

        setSubmitting(false);

        if (rpcError) {
            setError(rpcError.message);
            return;
        }

        if (!data.ok) {
            if (data.reason === "full") {
                setError(lang === "ja" ? "申し訳ありません。定員に達しました。" : "Sorry, this event is now full.");
                setCurrentCount(event.capacity); // UIを満員に更新
            } else if (data.reason === "invalid") {
                setError(lang === "ja" ? "イベントが見つかりません" : "Event not found");
            } else {
                setError(lang === "ja" ? "エラーが発生しました" : "An error occurred");
            }
            return;
        }

        setSuccess(true);
    };

    if (loading) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-10 text-slate-600">
                Loading...
            </div>
        );
    }

    if (!event) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-10">
                <p className="text-slate-600">
                    {lang === "ja" ? "イベントが見つかりません" : "Event not found"}
                </p>
                <Link to="/events" className="mt-4 inline-block text-[#646cff] hover:underline">
                    {lang === "ja" ? "イベント一覧に戻る" : "Back to events"}
                </Link>
            </div>
        );
    }

    const title = pickLang(lang, event.title_en, event.title_ja);

    // 成功画面
    if (success) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-10">
                <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-green-800">
                        {lang === "ja" ? "参加登録が完了しました！" : "Registration Complete!"}
                    </h2>
                    <p className="mt-2 text-green-700">
                        {lang === "ja"
                            ? `${title}への参加登録を受け付けました。当日お会いできることを楽しみにしています！`
                            : `You have successfully registered for ${title}. We look forward to seeing you!`}
                    </p>
                </div>
                <div className="mt-6 text-center">
                    <Link
                        to={`/events/${slug}`}
                        className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
                    >
                        {lang === "ja" ? "イベント詳細に戻る" : "Back to event details"}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-10">
            {/* ヘッダー */}
            <div className="mb-6">
                <Link
                    to={`/events/${slug}`}
                    className="text-sm text-slate-500 hover:text-slate-700"
                >
                    &larr; {lang === "ja" ? "イベント詳細に戻る" : "Back to event details"}
                </Link>
                <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    {lang === "ja" ? "参加登録" : "Event Registration"}
                </h1>
                <p className="mt-1 text-slate-600">{title}</p>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-600">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                        {new Date(event.starts_at).toLocaleString()}
                    </span>
                    {event.location && (
                        <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                            {event.location}
                        </span>
                    )}
                </div>
                {/* 参加者数 / 定員 表示 */}
                {event.capacity !== null && (
                    <div className="mt-3">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${
                            isFull
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                        }`}>
                            {lang === "ja" ? "参加者" : "Registered"}: {currentCount} / {event.capacity}
                            {isFull && (lang === "ja" ? " (満員)" : " (Full)")}
                        </span>
                    </div>
                )}
            </div>

            {/* 満員表示 */}
            {isFull ? (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
                    <h2 className="text-lg font-bold text-red-800">
                        {lang === "ja" ? "このイベントは満員です" : "This event is full"}
                    </h2>
                    <p className="mt-2 text-red-700">
                        {lang === "ja"
                            ? "申し訳ありませんが、定員に達したため参加登録を受け付けていません。"
                            : "Sorry, we are no longer accepting registrations as the event has reached its capacity."}
                    </p>
                </div>
            ) : (
                /* 参加フォーム */
                <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
                    {error && (
                        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* 名前 */}
                    <div className="mb-5">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            {lang === "ja" ? "名前" : "Name"} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={100}
                            className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[#646cff] focus:outline-none focus:ring-1 focus:ring-[#646cff]"
                            placeholder={lang === "ja" ? "田中 太郎" : "Your name"}
                        />
                    </div>

                    {/* 電話番号 */}
                    <div className="mb-5">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            {lang === "ja" ? "電話番号" : "Phone Number"} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            maxLength={20}
                            className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[#646cff] focus:outline-none focus:ring-1 focus:ring-[#646cff]"
                            placeholder={lang === "ja" ? "090-1234-5678" : "090-1234-5678"}
                        />
                    </div>

                    {/* 出身地 */}
                    <div className="mb-5">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            {lang === "ja" ? "出身地" : "Hometown"} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={hometown}
                            onChange={(e) => setHometown(e.target.value)}
                            maxLength={100}
                            className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 placeholder-slate-400 focus:border-[#646cff] focus:outline-none focus:ring-1 focus:ring-[#646cff]"
                            placeholder={lang === "ja" ? "東京都" : "Tokyo, Japan"}
                        />
                    </div>

                    {/* キャンパス */}
                    <div className="mb-5">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            {lang === "ja" ? "キャンパス" : "Campus"} <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={campus}
                            onChange={(e) => setCampus(e.target.value)}
                            className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-[#646cff] focus:outline-none focus:ring-1 focus:ring-[#646cff]"
                        >
                            <option value="">{lang === "ja" ? "選択してください" : "Select..."}</option>
                            {campusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {lang === "ja" ? opt.label : opt.labelEn}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 日本語レベル */}
                    <div className="mb-5">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            {lang === "ja" ? "日本語レベル" : "Japanese Level"} <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={japaneseLevel}
                            onChange={(e) => setJapaneseLevel(e.target.value)}
                            className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-[#646cff] focus:outline-none focus:ring-1 focus:ring-[#646cff]"
                        >
                            <option value="">{lang === "ja" ? "選択してください" : "Select..."}</option>
                            {japaneseLevelOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {lang === "ja" ? opt.label : opt.labelEn}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 参加動機 */}
                    <div className="mb-5">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            {lang === "ja" ? "参加動機" : "Motivation"} <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={japaneseMotivation}
                            onChange={(e) => setJapaneseMotivation(e.target.value)}
                            className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-[#646cff] focus:outline-none focus:ring-1 focus:ring-[#646cff]"
                        >
                            <option value="">{lang === "ja" ? "選択してください" : "Select..."}</option>
                            {japaneseMotivationOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {lang === "ja" ? opt.label : opt.labelEn}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 英語レベル */}
                    <div className="mb-6">
                        <label className="mb-1.5 block text-sm font-medium text-slate-700">
                            {lang === "ja" ? "英語レベル" : "English Level"} <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={englishLevel}
                            onChange={(e) => setEnglishLevel(e.target.value)}
                            className="block w-full rounded-xl border border-slate-300 px-4 py-2.5 text-slate-900 focus:border-[#646cff] focus:outline-none focus:ring-1 focus:ring-[#646cff]"
                        >
                            <option value="">{lang === "ja" ? "選択してください" : "Select..."}</option>
                            {englishLevelOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {lang === "ja" ? opt.label : opt.labelEn}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 送信ボタン */}
                    <button
                        type="submit"
                        disabled={submitting}
                        className="w-full rounded-full bg-green-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting
                            ? (lang === "ja" ? "送信中..." : "Submitting...")
                            : (lang === "ja" ? "参加登録する" : "Register")}
                    </button>
                </form>
            )}
        </div>
    );
}
