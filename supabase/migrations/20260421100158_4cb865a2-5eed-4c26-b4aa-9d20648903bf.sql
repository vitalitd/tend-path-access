ALTER TABLE public.access_requests
  ADD COLUMN IF NOT EXISTS payment_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS stripe_session_id text;

-- price_paid already exists as numeric; keep as-is.

-- Optional: constrain payment_status values
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'access_requests_payment_status_check'
  ) THEN
    ALTER TABLE public.access_requests
      ADD CONSTRAINT access_requests_payment_status_check
      CHECK (payment_status IN ('pending', 'paid', 'failed'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_access_requests_stripe_session
  ON public.access_requests(stripe_session_id);
