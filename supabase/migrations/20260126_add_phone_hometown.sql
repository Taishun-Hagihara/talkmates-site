-- =====================================================
-- 電話番号と出身地カラムを追加
-- =====================================================

-- 1) event_registrations テーブルにカラム追加
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE event_registrations ADD COLUMN IF NOT EXISTS hometown text;

-- 2) RPC関数を更新（パラメータ追加）
CREATE OR REPLACE FUNCTION register_for_event(
    p_event_id bigint,
    p_campus text,
    p_name text,
    p_phone text,
    p_hometown text,
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
    INSERT INTO event_registrations (event_id, campus, name, phone, hometown, japanese_level, japanese_motivation, english_level)
    VALUES (p_event_id, p_campus, p_name, p_phone, p_hometown, p_japanese_level, p_japanese_motivation, p_english_level)
    RETURNING id INTO v_registration_id;

    RETURN jsonb_build_object('ok', true, 'registration_id', v_registration_id);
END;
$$;

-- 3) 権限付与（新しいシグネチャ用）
GRANT EXECUTE ON FUNCTION register_for_event(bigint, text, text, text, text, text, text, text) TO anon;
GRANT EXECUTE ON FUNCTION register_for_event(bigint, text, text, text, text, text, text, text) TO authenticated;
