-- Lock down profiles: only owner reads full row; public uses the view
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Users view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

-- Tighten access_requests UPDATE policies
DROP POLICY IF EXISTS "Visitors cancel own requests" ON public.access_requests;
DROP POLICY IF EXISTS "Landowners decide on requests" ON public.access_requests;

CREATE POLICY "Visitors can only cancel own pending requests" ON public.access_requests
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND status = 'cancelled');

CREATE POLICY "Landowners decide on requests for own properties" ON public.access_requests
  FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.landowner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.landowner_id = auth.uid()));

-- Prevent role accumulation: trigger blocks insert if user already has a non-admin role
CREATE OR REPLACE FUNCTION public.prevent_role_accumulation()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.role <> 'admin' AND EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = NEW.user_id AND role <> 'admin'
  ) THEN
    RAISE EXCEPTION 'User already has a primary role assigned';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_prevent_role_accumulation ON public.user_roles;
CREATE TRIGGER trg_prevent_role_accumulation
  BEFORE INSERT ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.prevent_role_accumulation();