-- Add user_id column to links table for multi-tenant support
-- Run this in your Supabase SQL Editor (Dashboard → SQL Editor → New Query)

-- 1. Add user_id column (nullable first so existing rows don't break)
ALTER TABLE links ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Create an index for fast per-user lookups
CREATE INDEX IF NOT EXISTS idx_links_user_id ON links(user_id);

-- 3. (Optional) If you want to assign existing links to a specific user, run:
-- UPDATE links SET user_id = 'YOUR_USER_UUID_HERE' WHERE user_id IS NULL;

-- 4. Once all existing rows have a user_id, make the column NOT NULL:
-- ALTER TABLE links ALTER COLUMN user_id SET NOT NULL;

-- 5. Enable Row Level Security (RLS) for extra protection
ALTER TABLE links ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own links
CREATE POLICY "Users can view own links" ON links
    FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert links for themselves
CREATE POLICY "Users can insert own links" ON links
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own links
CREATE POLICY "Users can update own links" ON links
    FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can only delete their own links
CREATE POLICY "Users can delete own links" ON links
    FOR DELETE USING (auth.uid() = user_id);

-- Policy: Service role (used by admin client) bypasses RLS automatically
-- No extra policy needed for supabaseAdmin (service_role key)
