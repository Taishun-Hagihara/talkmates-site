import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function AdminLogin() {
    const nav = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setErr("");
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        setLoading(false);
        if (error) return setErr(error.message);

        nav("/admin", { replace: true });
    };

    return (
        <div className="mx-auto max-w-md px-4 py-10">
            <h1 className="text-2xl font-bold text-slate-900"><span className="text-green-600">Staff</span> Login</h1>
            <p className="mt-2 text-sm text-slate-600">幹部のみログインできます。</p>

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
}
