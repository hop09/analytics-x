-- Add per-mode columns for bot: separate redirect URL, title, and image
ALTER TABLE links ADD COLUMN IF NOT EXISTS bot_redirect_url TEXT;
ALTER TABLE links ADD COLUMN IF NOT EXISTS bot_custom_title TEXT;
ALTER TABLE links ADD COLUMN IF NOT EXISTS bot_custom_image_url TEXT;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
