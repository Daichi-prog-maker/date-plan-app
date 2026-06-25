-- placesテーブルにお気に入りフィールドを追加
ALTER TABLE places ADD COLUMN IF NOT EXISTS is_favorite BOOLEAN DEFAULT false;

-- お気に入りのインデックスを追加
CREATE INDEX IF NOT EXISTS idx_places_favorite ON places(is_favorite);

-- Supabase Storageのバケット設定（Supabaseのダッシュボードで手動実行が必要）
-- バケット名: place-photos
-- Public access: true
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp, image/heic
