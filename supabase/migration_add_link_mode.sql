-- Migration: Add mode column to links table
-- This replaces automatic bot detection with a manual mode toggle per link.
-- mode = 'real' → all visitors treated as real humans (redirect)
-- mode = 'bot'  → all visitors treated as bots (show OG meta page)

ALTER TABLE links
ADD COLUMN IF NOT EXISTS mode text NOT NULL DEFAULT 'real'
CHECK (mode IN ('real', 'bot'));

-- Ensure user_agent column exists in clicks (should already exist)
-- and add an index for efficient user-agent aggregation
ALTER TABLE clicks
ADD COLUMN IF NOT EXISTS user_agent text;

-- Index for faster mode lookups during routing
CREATE INDEX IF NOT EXISTS idx_links_short_code_mode ON links (short_code, mode);

-- Index for user-agent analytics aggregation  
CREATE INDEX IF NOT EXISTS idx_clicks_link_id_user_agent ON clicks (link_id, user_agent)
WHERE user_agent IS NOT NULL;

-- Truncate excessively long user agents to save storage
-- (Optional: run once to clean existing data)
-- UPDATE clicks SET user_agent = LEFT(user_agent, 512) WHERE LENGTH(user_agent) > 512;
