import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import TalkMatesLogo from "../assets/TalkMatesLogo.png";
import { Alert, Button, Input, Panel } from "../components/ui";
import { Mail, Lock, ArrowLeft } from "lucide-react";

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
    <div className="min-h-[calc(100vh-80px)] px-4 py-12">
      <div className="mx-auto max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" />
          Home
        </Link>

        <Panel className="mt-4 p-8">
          <div className="flex items-center gap-3">
            <img src={TalkMatesLogo} alt="TalkMates" className="h-10 w-10 rounded-2xl" />
            <div>
              <h1 className="text-xl font-black tracking-tight text-slate-900">
                <span className="text-green-600">Staff</span> Login
              </h1>
              <p className="text-sm text-slate-600">幹部のみログインできます。</p>
            </div>
          </div>

          {err && <Alert variant="error" className="mt-4">{err}</Alert>}

          <form onSubmit={onSubmit} className="mt-6 grid gap-4">
            <Input
              label="メールアドレス"
              value={email}
              onChange={setEmail}
              type="email"
              autoComplete="email"
              required
              icon={<Mail className="h-5 w-5" />}
            />
            <Input
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              autoComplete="current-password"
              required
              icon={<Lock className="h-5 w-5" />}
            />

            <Button type="submit" variant="primary" size="lg" fullWidth disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </Button>
          </form>
        </Panel>
      </div>
    </div>
  );
}
