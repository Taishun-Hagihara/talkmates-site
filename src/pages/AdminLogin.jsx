import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
//幹部用のログインページを作っている。
//useNavigateはHooksの一つで画面遷移するためのもの。
//つまり nav は、ざっくり言うとnav("/admin") で / admin に移動させる関数
export default function AdminLogin() {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
//理解している
    const onSubmit = async (e) => {
        //formが自動でリロードして処理できなくなることを防ぐためにpreventDefault()
        //preventDefaultはイベントの標準機能
        e.preventDefault();
        setErr("");
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        setLoading(false);
        if (error) return setErr(error.message);
        

        nav("/admin", { replace: true });
    };

//理解している

//errが""ならfalsy文字列が入っていればtruthy
//formが submit されたときに onSubmit が実行されるそして、HTMLでは、formの中の button はデフォルトで type="submit" です。
//ゆえにbuttonをクリックするとsubmitが発生する。
    return (
        <div className="mx-auto max-w-md px-4 py-10">
            <h1 className="text-2xl font-bold text-slate-900"><span className="text-green-600">Staff</span> Login</h1>
            <p className="mt-2 text-sm text-slate-600">幹部のみログインできます。</p>

            {err && (
              <p className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
                {err}
              </p>
            )}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
                

                <div>
                    <label className="text-sm font-medium text-slate-700">メールアドレス</label>
                    <input
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        autoComplete="email"
                        required
                    />
                </div>

                <div>
                    <label className="text-sm font-medium text-slate-700">Password</label>
                    <input
                        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:ring-2 focus:ring-green-500"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        autoComplete="current-password"
                        required
                    />
                </div>

                <button
                    disabled={loading}
                    className="w-full rounded-xl bg-green-600 px-4 py-2.5 font-semibold text-white hover:bg-green-700 disabled:opacity-60"
                >
                    {loading ? "Signing in…" : "Login"}
                </button>
            </form>
        </div>
    );
    //awaitでデータを待っている間のみsetLoadingでloading=trueになるのでその間disabled=trueでボタンが押せなくなる
    //disableの処理により多重クリック防止が実現する。
    //そしてボタンでの表示が、三項演算子によりSigning in…に切り替わる。
}
