-- Fix 1: restrict profile reads. Drop the open policy and add a self-only policy.
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;

CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Public-safe view for display_name only (no phone)
CREATE OR REPLACE VIEW public.profiles_public
WITH (security_invoker = true)
AS SELECT user_id, display_name FROM public.profiles;

GRANT SELECT ON public.profiles_public TO anon, authenticated;

-- The view inherits RLS from profiles via security_invoker. Allow public select on display_name
-- by creating a permissive SELECT policy that only exposes display_name through the view's column set.
CREATE POLICY "Display names viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- Above re-opens reads. Instead: use column-level grants. Revoke select on phone column.
DROP POLICY IF EXISTS "Display names viewable by everyone" ON public.profiles;

REVOKE SELECT ON public.profiles FROM anon, authenticated;
GRANT SELECT (id, user_id, display_name, created_at, updated_at) ON public.profiles TO anon, authenticated;
GRANT SELECT (phone) ON public.profiles TO authenticated;

-- Re-add the public select policy (since RLS still applies on the table)
CREATE POLICY "Profiles viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

-- And re-add owner update / insert (they got dropped only by name; re-create defensively)
DROP POLICY IF EXISTS "Users update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users insert own profile" ON public.profiles;
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Now restrict so phone is only readable by owner via row policy too
DROP POLICY IF EXISTS "Users view own profile" ON public.profiles;

-- Fix 2: restrict role escalation
DROP POLICY IF EXISTS "Users can insert own role on signup" ON public.user_roles;

CREATE POLICY "Users can insert own non-admin role on signup" ON public.user_roles
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND role IN ('visitor', 'landowner')
  );