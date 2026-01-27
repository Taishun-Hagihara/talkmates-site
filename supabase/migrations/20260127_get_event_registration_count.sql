-- =====================================================
-- 参加人数のみを返す安全な RPC 関数
-- anon でも人数だけは取得可能にする（個人情報は絶対に返さない）
-- =====================================================

-- 参加人数を取得する関数（SECURITY DEFINER で RLS をバイパス）
CREATE OR REPLACE FUNCTION get_event_registration_count(p_event_id bigint)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_count integer;
BEGIN
    -- イベントが存在するか確認
    IF NOT EXISTS (SELECT 1 FROM events WHERE id = p_event_id) THEN
        RETURN NULL;  -- イベントが存在しない場合は NULL
    END IF;

    -- 参加者数をカウント（個人情報は一切返さない）
    SELECT COUNT(*)::integer INTO v_count
    FROM event_registrations
    WHERE event_id = p_event_id;

    RETURN v_count;
END;
$$;

-- anon と authenticated の両方に実行権限を付与
GRANT EXECUTE ON FUNCTION get_event_registration_count(bigint) TO anon;
GRANT EXECUTE ON FUNCTION get_event_registration_count(bigint) TO authenticated;

-- セキュリティ確認用コメント
COMMENT ON FUNCTION get_event_registration_count(bigint) IS
'参加人数（count）のみを返す安全な関数。個人情報（name/phone/hometown等）は絶対に返さない。';
