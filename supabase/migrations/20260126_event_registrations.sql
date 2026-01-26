-- =====================================================
-- イベント参加フォーム機能 マイグレーション
-- =====================================================

-- 1) events テーブルに capacity カラムを追加
-- NULL = 無制限
ALTER TABLE events ADD COLUMN IF NOT EXISTS capacity integer;

-- 2) event_registrations テーブル作成
-- ※ events.id が bigint 型のため event_id も bigint に合わせる
CREATE TABLE IF NOT EXISTS event_registrations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id bigint NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    campus text NOT NULL,
    name text NOT NULL,
    japanese_level text NOT NULL,
    japanese_motivation text NOT NULL,
    english_level text NOT NULL,
    created_at timestamptz NOT NULL DEFAULT now()
);

-- インデックス作成
CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_created_at ON event_registrations(created_at);

-- 3) RLS 有効化
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;

-- 4) RLS ポリシー設定
-- anon は INSERT のみ許可（RPCから呼ばれる）
DROP POLICY IF EXISTS "anon_insert_registrations" ON event_registrations;
CREATE POLICY "anon_insert_registrations" ON event_registrations
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- authenticated ユーザーは SELECT のみ許可（admin閲覧用）
DROP POLICY IF EXISTS "authenticated_select_registrations" ON event_registrations;
CREATE POLICY "authenticated_select_registrations" ON event_registrations
    FOR SELECT
    TO authenticated
    USING (true);

-- 5) 定員の原子的チェック用 RPC 関数
-- SECURITY DEFINER で実行し、search_path を固定
-- ※ events.id が bigint 型のため p_event_id も bigint に合わせる
CREATE OR REPLACE FUNCTION register_for_event(
    p_event_id bigint,
    p_campus text,
    p_name text,
    p_japanese_level text,
    p_japanese_motivation text,
    p_english_level text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_capacity integer;
    v_current_count integer;
    v_registration_id uuid;
BEGIN
    -- イベント行をロック（同時実行を防ぐ）
    SELECT capacity INTO v_capacity
    FROM events
    WHERE id = p_event_id
    FOR UPDATE;

    -- イベントが存在しない場合
    IF NOT FOUND THEN
        RETURN jsonb_build_object('ok', false, 'reason', 'invalid');
    END IF;

    -- 現在の参加者数をカウント
    SELECT COUNT(*) INTO v_current_count
    FROM event_registrations
    WHERE event_id = p_event_id;

    -- 定員チェック（capacity が NULL なら無制限）
    IF v_capacity IS NOT NULL AND v_current_count >= v_capacity THEN
        RETURN jsonb_build_object('ok', false, 'reason', 'full');
    END IF;

    -- INSERT 実行
    INSERT INTO event_registrations (event_id, campus, name, japanese_level, japanese_motivation, english_level)
    VALUES (p_event_id, p_campus, p_name, p_japanese_level, p_japanese_motivation, p_english_level)
    RETURNING id INTO v_registration_id;

    RETURN jsonb_build_object('ok', true, 'registration_id', v_registration_id);
END;
$$;

-- anon から RPC を実行できるように権限付与
GRANT EXECUTE ON FUNCTION register_for_event(bigint, text, text, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION register_for_event(bigint, text, text, text, text, text) TO authenticated;
