-- =========================================
-- ROLES
-- =========================================
CREATE TYPE public.app_role AS ENUM ('visitor', 'landowner', 'admin');
CREATE TYPE public.request_status AS ENUM ('pending', 'approved', 'declined', 'cancelled');
CREATE TYPE public.pricing_type AS ENUM ('per_visit', 'day_pass', 'subscription');

-- =========================================
-- PROFILES
-- =========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- =========================================
-- USER ROLES (separate table for security)
-- =========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own role on signup" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- PROPERTIES
-- =========================================
CREATE TABLE public.properties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  landowner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  region TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  allowed_activities TEXT[] NOT NULL DEFAULT '{}',
  conditions TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  acreage NUMERIC,
  steward_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view available properties" ON public.properties FOR SELECT USING (is_available = true OR landowner_id = auth.uid());
CREATE POLICY "Landowners create properties" ON public.properties FOR INSERT WITH CHECK (auth.uid() = landowner_id AND public.has_role(auth.uid(), 'landowner'));
CREATE POLICY "Landowners update own properties" ON public.properties FOR UPDATE USING (auth.uid() = landowner_id);
CREATE POLICY "Landowners delete own properties" ON public.properties FOR DELETE USING (auth.uid() = landowner_id);

-- =========================================
-- ACCESS RULES
-- =========================================
CREATE TABLE public.access_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL UNIQUE REFERENCES public.properties(id) ON DELETE CASCADE,
  group_size_limit INTEGER DEFAULT 4,
  time_restrictions TEXT,
  warnings TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.access_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view rules" ON public.access_rules FOR SELECT USING (true);
CREATE POLICY "Landowners manage own rules" ON public.access_rules FOR ALL
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.landowner_id = auth.uid()));

-- =========================================
-- PRICING
-- =========================================
CREATE TABLE public.pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id UUID NOT NULL UNIQUE REFERENCES public.properties(id) ON DELETE CASCADE,
  pricing_type pricing_type NOT NULL DEFAULT 'per_visit',
  amount NUMERIC(10,2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'GBP',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.pricing ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view pricing" ON public.pricing FOR SELECT USING (true);
CREATE POLICY "Landowners manage own pricing" ON public.pricing FOR ALL
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.landowner_id = auth.uid()));

-- =========================================
-- ACCESS REQUESTS
-- =========================================
CREATE TABLE public.access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
  status request_status NOT NULL DEFAULT 'pending',
  requested_datetime TIMESTAMPTZ NOT NULL,
  group_size INTEGER NOT NULL DEFAULT 1,
  price_paid NUMERIC(10,2),
  conditions_acknowledged BOOLEAN NOT NULL DEFAULT false,
  visitor_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors view own requests" ON public.access_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Landowners view requests for own properties" ON public.access_requests FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.landowner_id = auth.uid()));
CREATE POLICY "Visitors create own requests" ON public.access_requests FOR INSERT WITH CHECK (auth.uid() = user_id AND conditions_acknowledged = true);
CREATE POLICY "Visitors cancel own requests" ON public.access_requests FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Landowners decide on requests" ON public.access_requests FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.properties p WHERE p.id = property_id AND p.landowner_id = auth.uid()));

-- =========================================
-- VISITS
-- =========================================
CREATE TABLE public.visits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  access_request_id UUID NOT NULL UNIQUE REFERENCES public.access_requests(id) ON DELETE CASCADE,
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visitors view own visits" ON public.visits FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.access_requests ar WHERE ar.id = access_request_id AND ar.user_id = auth.uid()));
CREATE POLICY "Landowners view own property visits" ON public.visits FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.access_requests ar
    JOIN public.properties p ON p.id = ar.property_id
    WHERE ar.id = access_request_id AND p.landowner_id = auth.uid()
  ));
CREATE POLICY "Visitors create own visits" ON public.visits FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.access_requests ar WHERE ar.id = access_request_id AND ar.user_id = auth.uid() AND ar.status = 'approved')
);
CREATE POLICY "Visitors update own visits" ON public.visits FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.access_requests ar WHERE ar.id = access_request_id AND ar.user_id = auth.uid()));

-- =========================================
-- AUDIT LOGS
-- =========================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  property_id UUID REFERENCES public.properties(id) ON DELETE SET NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins view audit logs" ON public.audit_logs FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- =========================================
-- TIMESTAMPS TRIGGER
-- =========================================
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON public.properties FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_access_requests_updated_at BEFORE UPDATE ON public.access_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON public.visits FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =========================================
-- AUTO-CREATE PROFILE ON SIGNUP
-- =========================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)));
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();