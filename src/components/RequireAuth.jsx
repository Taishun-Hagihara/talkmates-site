
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

//supabase.auth.getSession()
//ログインしていれば sessionオブジェクト
//
export default function RequireAuth({ children }) {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        let mounted = true;
//thenはjsの仕様でawait asyncみたいな感じで処理待ちできる
        //onAuthStateChangeはSupabase Authの監視を開始するAPI
        //.sessionはSupabaseの 認証（Auth） 機能が「今ログインしてるユーザーの情報（トークン等）」を返すためのオブジェクトなのでcolumnにあるわけではない。
        //supabase.auth.onAuthStateChange(コールバック関数)という形でSupabase側が「認証状態が変わったら」そのコールバック関数を呼びます。
        //Supabaseはコールバックを呼ぶときに二つの値を返してくるので_event,sessという形にしている、event＝何が起きたか　sess=その時のセッション、ログアウトしているならnull
        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            setSession(data.session);
            setLoading(false);
        });

        const result = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });
//supabaseの戻り値の多くはdataで定義されている。
        const sub = result.data;
        //unsubscribe()は監視を止めるためのsupabaseが用意している関数のことである
        //厳密には違うが、sessにはログインしているかの情報が入っている。(本当はオブジェクトかnull)のでそれに対して監視を止めるということ
        return () => {
            sub.subscription.unsubscribe();
        };

    }, []);

    if (loading) {
        return <div className="mx-auto max-w-5xl px-4 py-10 text-slate-600">Loading…</div>;
    }
//NavigateはLinkと異なって条件を満たしたら勝手に飛ばす。対し、Linkはaタグのような感じであった。
    if (!session) return <Navigate to="/admin/login" replace />;

    return children;
}
