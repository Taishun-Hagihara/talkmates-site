//Card.jsx同様supabaseの理解が浅い
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

export default function RequireAuth({ children }) {
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    useEffect(() => {
        let mounted = true;

        supabase.auth.getSession().then(({ data }) => {
            if (!mounted) return;
            setSession(data.session);
            setLoading(false);
        });

        const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
            setSession(sess);
        });

        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    if (loading) {
        return <div className="mx-auto max-w-5xl px-4 py-10 text-slate-600">Loading…</div>;
    }

    if (!session) return <Navigate to="/admin/login" replace />;

    return children;
}
