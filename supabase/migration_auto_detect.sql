-- Add bot_user_agents column for auto-detection patterns and update mode to support 'auto'
ALTER TABLE links ADD COLUMN IF NOT EXISTS bot_user_agents TEXT;

-- Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
