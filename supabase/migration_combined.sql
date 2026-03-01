-- ============================================================
-- COMBINED MIGRATION: Run this in Supabase SQL Editor
-- Dashboard → SQL Editor → New Query → Paste → Run
-- ============================================================

-- ── 1. Add user_id column to links ──────────────────────────
ALTER TABLE links ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);

-- ── 2. Add mode column to links ─────────────────────────────
ALTER TABLE links ADD COLUMN IF NOT EXISTS mode text DEFAULT 'real';

-- ── 3. Add user_agent column to clicks ──────────────────────
ALTER TABLE clicks ADD COLUMN IF NOT EXISTS user_agent text;

-- ── 4. Indexes ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_links_short_code_mode ON links (short_code, mode);
CREATE INDEX IF NOT EXISTS idx_clicks_link_id_user_agent ON clicks (link_id, user_agent)
WHERE user_agent IS NOT NULL;

-- ── 5. Assign existing links to your user (REQUIRED) ────────
-- Replace YOUR_USER_UUID with your actual user ID from Supabase Auth.
-- Find it: Supabase Dashboard → Authentication → Users → copy the UUID
--
-- UPDATE links SET user_id = 'YOUR_USER_UUID' WHERE user_id IS NULL;

-- ── 6. (Optional) Enable RLS after user_id is populated ─────
-- Only run these AFTER step 5 is done for all rows:
--
-- ALTER TABLE links ENABLE ROW LEVEL SECURITY;
--
-- CREATE POLICY "Users can view own links" ON links
--     FOR SELECT USING (auth.uid() = user_id);
-- CREATE POLICY "Users can insert own links" ON links
--     FOR INSERT WITH CHECK (auth.uid() = user_id);
-- CREATE POLICY "Users can update own links" ON links
--     FOR UPDATE USING (auth.uid() = user_id);
-- CREATE POLICY "Users can delete own links" ON links
--     FOR DELETE USING (auth.uid() = user_id);
