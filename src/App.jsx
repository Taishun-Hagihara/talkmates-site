import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
  const [event, setEvent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("is_next", true)
        .order("starts_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (error) setError(error.message);
      else setEvent(data);
    })();
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: "system-ui" }}>
      <h1>TalkMates</h1>
      <h2>Next Event</h2>

      {error && <p style={{ color: "crimson" }}>Error: {error}</p>}
      {!error && !event && <p>Loading...</p>}

      {event && (
        <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
          <h3 style={{ margin: 0 }}>{event.title}</h3>
          <p style={{ margin: "8px 0" }}>{new Date(event.starts_at).toLocaleString()}</p>
          <p style={{ margin: "8px 0" }}>{event.location}</p>
          <p style={{ margin: 0 }}>{event.description}</p>
        </div>
      )}
    </div>
  );
}
