import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import {
    campusOptions,
    japaneseLevelOptions,
    japaneseMotivationOptions,
    englishLevelOptions,
} from "../lib/formOptions";

// 選択肢のvalueからラベルを取得するヘルパー
function getLabel(options, value) {
    const opt = options.find((o) => o.value === value);
    return opt ? opt.label : value;
}

export default function AdminEventRegistrations() {
    const { id } = useParams(); // event_id
    const [event, setEvent] = useState(null);
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [sortOrder, setSortOrder] = useState("desc"); // desc = 新しい順, asc = 古い順

    useEffect(() => {
        loadData();
    }, [id]);

    const loadData = async () => {
        setLoading(true);
        setError("");

        // イベント情報取得
        const { data: eventData, error: eventError } = await supabase
            .from("events")
            .select("id,slug,title_ja,title_en,capacity,starts_at")
            .eq("id", id)
            .maybeSingle();

        if (eventError) {
            setError(eventError.message);
            setLoading(false);
            return;
        }

        if (!eventData) {
            setError("イベントが見つかりません");
            setLoading(false);
            return;
        }

        setEvent(eventData);

        // 参加者一覧取得
        const { data: regData, error: regError } = await supabase
            .from("event_registrations")
            .select("id,name,phone,hometown,campus,japanese_level,japanese_motivation,english_level,created_at")
            .eq("event_id", id)
            .order("created_at", { ascending: false });

        if (regError) {
            setError(regError.message);
            setLoading(false);
            return;
        }

        setRegistrations(regData ?? []);
        setLoading(false);
    };

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    // 検索フィルタ
    const filteredRegistrations = registrations.filter((r) =>
        r.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // 並び替え
    const sortedRegistrations = [...filteredRegistrations].sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    if (loading) {
        return (
            <div className="mx-auto max-w-6xl px-4 py-10 text-slate-600">
                Loading...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl px-4 py-10">
            {/* ヘッダー */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <Link
                        to="/admin"
                        className="text-sm text-slate-500 hover:text-slate-700"
                    >
                        &larr; ダッシュボードに戻る
                    </Link>
                    <h1 className="mt-2 text-2xl font-bold text-slate-900">
                        参加者一覧
                    </h1>
                    {event && (
                        <p className="mt-1 text-slate-600">
                            {event.title_ja || event.title_en}
                        </p>
                    )}
                </div>
                <button
                    onClick={signOut}
                    className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm transition hover:bg-slate-100 hover:text-slate-800"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>

            {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {event && (
                <>
                    {/* 参加者数 / 定員 */}
                    <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-600">参加者数:</span>
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-lg font-bold ${
                                    event.capacity !== null && registrations.length >= event.capacity
                                        ? "bg-red-100 text-red-700"
                                        : "bg-green-100 text-green-700"
                                }`}>
                                    {registrations.length} / {event.capacity ?? "∞"}
                                </span>
                            </div>
                            <div className="text-sm text-slate-500">
                                開催日: {new Date(event.starts_at).toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* 検索・並び替え */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="名前で検索..."
                                className="w-full max-w-xs rounded-xl border border-slate-300 px-4 py-2 text-sm text-slate-900 placeholder-slate-400 focus:border-[#646cff] focus:outline-none focus:ring-1 focus:ring-[#646cff]"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-600">並び替え:</span>
                            <select
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-700 focus:border-[#646cff] focus:outline-none focus:ring-1 focus:ring-[#646cff]"
                            >
                                <option value="desc">新しい順</option>
                                <option value="asc">古い順</option>
                            </select>
                        </div>
                    </div>

                    {/* テーブル */}
                    <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            名前
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            電話番号
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            出身地
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            キャンパス
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            日本語レベル
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            参加動機
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            英語レベル
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                                            登録日時
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-200 bg-white">
                                    {sortedRegistrations.map((r) => (
                                        <tr key={r.id} className="hover:bg-slate-50">
                                            <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                                                {r.name}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                                                {r.phone || "-"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                                                {r.hometown || "-"}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                                                {getLabel(campusOptions, r.campus)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                                                {getLabel(japaneseLevelOptions, r.japanese_level)}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-slate-700">
                                                {getLabel(japaneseMotivationOptions, r.japanese_motivation)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                                                {getLabel(englishLevelOptions, r.english_level)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500">
                                                {new Date(r.created_at).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                    {sortedRegistrations.length === 0 && (
                                        <tr>
                                            <td colSpan={8} className="px-4 py-6 text-center text-sm text-slate-500">
                                                {searchQuery
                                                    ? "該当する参加者がいません"
                                                    : "参加者がいません"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 件数表示 */}
                    <div className="mt-3 text-sm text-slate-500">
                        {searchQuery && (
                            <span>検索結果: {sortedRegistrations.length}件 / </span>
                        )}
                        全{registrations.length}件
                    </div>
                </>
            )}
        </div>
    );
}
