supabase.md
Tend — Supabase Integration
Quiet, factual, steady documentation

1. Overview
Supabase provides Tend’s hosted PostgreSQL database, authentication system, row‑level security, and auto‑generated APIs.
It acts as the persistence and identity layer for the platform, while Cloudflare Workers handle application logic.

Supabase is intentionally used in a minimal, explicit way:

predictable relational schema

strict access control

simple API surface

easy local development

steady production deployment

2. Components Used
Tend uses the following Supabase services:

2.1 PostgreSQL Database
Primary structured data store.

Used for:

users

properties

access rules

access requests

visits

pricing

audit logs

Notes:

Geospatial fields use PostGIS where required.

All tables enforce least‑privilege access.

Audit logs support operational oversight.

2.2 Supabase Auth
Identity and authentication provider.

Features used:

email‑based sign‑in

JWT access tokens

short‑lived access tokens

refresh tokens (HTTP‑only cookies)

role‑based access control (visitor, steward, landholder, admin)

Notes:

Passwords are hashed using bcrypt.

Email verification is required for all accounts.

2.3 Row Level Security (RLS)
Core security mechanism.

Used to ensure:

users can only access their own records

landholders can only manage their own properties

admins have explicit elevated access

Cloudflare Workers enforce server‑side rules

Notes:

RLS is enabled on all tables.

Policies are explicit and minimal.

2.4 Auto‑Generated REST API
Supabase exposes a REST interface for all tables.

Used by:

Cloudflare Workers

Frontend (for simple reads)

Internal tools (future)

Notes:

All requests are authenticated via JWT.

Service role key is used only in Workers.

2.5 Storage (Optional)
Available for future use:

property photos

documents

attachments

Not required for MVP.

2.6 Backups
Supabase provides daily automated backups.

Used for:

disaster recovery

user data protection

schema restoration

Notes:

Backups include auth tables and all relational data.

Additional external backups can be added if required.

3. Data Model
Tend’s schema is relational and explicit.

Core tables:

users

properties

access_rules

access_requests

visits

pricing

audit_logs

Design notes:

Foreign keys enforce consistency.

Geospatial fields use PostGIS.

Audit logs are append‑only.

RLS policies are defined per table.

4. Authentication Flow
User signs in with email.

Supabase issues a short‑lived JWT.

JWT is stored in memory or secure cookie.

Cloudflare Workers validate the token.

Workers apply role‑based logic.

RLS enforces final access control at the database level.

Notes:

Admin role is reserved for operational oversight.

Refresh tokens are HTTP‑only and secure.

5. Cloudflare Worker Integration
Workers act as Tend’s backend.

They handle:

validation

business logic

rate limiting

secure access to Supabase

service‑role operations (where required)

Workers communicate with Supabase via:

REST API

Supabase client library

signed JWTs

environment variables (anon + service role keys)

Notes:

Service role key is never exposed to the frontend.

Workers enforce additional server‑side rules beyond RLS.

6. Security Model (Supabase‑Specific)
Supabase contributes to Tend’s security posture through:

6.1 Authentication
bcrypt password hashing

verified email identities

short‑lived tokens

secure refresh tokens

6.2 Authorization
RLS on all tables

role‑based access

explicit policies

6.3 Data Protection
encrypted in transit (HTTPS)

encrypted at rest

strict least‑privilege access

6.4 Operational Safeguards
daily backups

audit logs

minimal exposed API surface

7. Environment Variables
Supabase keys are stored in:

Cloudflare Worker environment variables

GitHub Secrets

local .env files (never committed)

Keys used:

SUPABASE_URL

SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

Notes:

Service role key is restricted to Workers only.

Anon key is safe for frontend use due to RLS.

8. Local Development
Local development uses:

Supabase CLI (optional)

local Postgres (optional)

remote Supabase project (default)

Recommended workflow:

Pull schema via SQL dump

Run migrations through GitHub

Test RLS policies locally

Deploy Workers with environment variables

9. Maintenance & Pausing
Supabase free-tier projects may pause after inactivity.

To avoid interruptions:

run periodic database activity

upgrade to Pro for production

monitor dashboard usage

keep Workers active

Notes:

Paused projects can be unpaused within 90 days.

Backups remain available.

10. Future Expansion
Supabase supports future Tend features:

messaging

notifications

property media storage

analytics

insurance integrations

Stripe metadata storage

admin dashboards

The architecture is steady and easy to extend.

11. Guiding Principles
minimal

explicit

secure

predictable

easy to maintain

easy to evolve

Supabase is used as a clear, stable foundation for Tend’s data and identity layer.