import { supabase } from "./supabase.js";

/**
 * イベントの参加人数を RPC 経由で取得
 * RLS をバイパスして anon でも正確な人数を取得可能
 * 個人情報（name/phone/hometown等）は絶対に返さない
 *
 * @param {number} eventId - イベントID
 * @returns {Promise<{count: number|null, error: string|null}>}
 */
export async function getEventRegistrationCount(eventId) {
  if (!eventId) {
    return { count: null, error: "Invalid event ID" };
  }

  const { data, error } = await supabase.rpc("get_event_registration_count", {
    p_event_id: eventId,
  });

  if (error) {
    return { count: null, error: error.message };
  }

  // data が null の場合はイベントが存在しない
  if (data === null) {
    return { count: null, error: "Event not found" };
  }

  return { count: data, error: null };
}
