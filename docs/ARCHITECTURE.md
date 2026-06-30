ARCHITECTURE.md
Tend — System Architecture
Quiet, careful, safety‑aware design language

1. Overview
Tend is a digital access platform that connects landholders and visitors through a trusted, care‑led system.
The architecture is modular, steady, and easy to evolve from prototype to production.

It supports:

rapid iteration

structured engineering

long‑term deployment

The system is intentionally simple and explicit.

2. System Architecture
Tend consists of three major layers:

Frontend (Client Layer)

Backend (Application Layer)

Database (Persistence Layer)

The platform uses Cloudflare Workers for backend logic and Supabase for identity and data storage.

2.1 Frontend (Client Layer)
Framework: TanStack Start (React)
Hosting: Cloudflare Pages

Purpose:
Provide a calm, factual interface for landholders and visitors.

Key Responsibilities:

Authentication

Property discovery

Access request flow

Check‑in / check‑out

Map‑based navigation

Landholder dashboard

Notes:

Tone is quiet and factual.

Safety notes are always visible.

Frontend communicates with Workers using JSON APIs.

2.2 Backend (Application Layer)
Runtime: Cloudflare Workers
Purpose: Business logic, validation, and secure access to Supabase

Key Responsibilities:

User management

Access request lifecycle

Visit tracking

Rule enforcement

Payment integration (future)

Insurance integration (future)

Notifications (future)

Notes:

Workers act as Tend’s backend.

All sensitive operations use the Supabase service‑role key stored securely in Worker environment variables.

Validation is strict and predictable.

Workers enforce rate limiting and safety rules.

2.3 Database (Persistence Layer)
Database: Supabase PostgreSQL
Purpose: Store structured, relational data with strong security guarantees

Core Tables:

users

properties

access_rules

access_requests

visits

pricing

audit_logs

Notes:

Geospatial fields use PostGIS where needed.

Row Level Security (RLS) is enabled on all tables.

Audit logs support operational oversight.

Daily backups are provided automatically.

3. Data Flow
3.1 Visitor Flow
Visitor browses available properties

Submits an access request

Worker validates request

Landholder approves or declines

Visitor receives confirmation

Visitor checks in and checks out

Visit is logged in the audit trail

3.2 Landholder Flow
Landholder creates a property

Sets rules, availability, and pricing

Receives access requests

Approves or declines

Views visit history

4. Authentication & Security
Auth Provider: Supabase Auth
Security Enforcement: RLS + Worker validation

Security Measures:

JWT‑based authentication

Role‑based access control (visitor, steward, landholder, admin)

Audit logging

Input validation

Rate limiting

Strict least‑privilege access

Notes:

Admin role is reserved for operational oversight.

Passwords are hashed using bcrypt.

Email verification is required for all accounts.

5. Maps & Geospatial Logic
Map Provider: Mapbox or Leaflet

Features:

Property boundaries

Allowed zones

Restricted zones

Check‑in radius validation

GPS‑based visit tracking

Notes:

GPS is optional and privacy‑aware.

No‑go zones are displayed clearly and calmly.

6. Integrations (Future)
Payments
Stripe for bookings and payouts

No credit card data stored in Tend

Insurance
API integration for coverage verification

Notifications
Email (SendGrid)

SMS (Twilio)

Notes:

Not included in MVP.

Designed for clean future expansion.

7. Deployment Architecture
MVP
Frontend: Cloudflare Pages

Backend: Cloudflare Workers

Database: Supabase

Storage: Supabase Storage (optional)

Production
Frontend: Cloudflare Pages

Backend: Cloudflare Workers

Database: Supabase Pro

Storage: Supabase Storage

Monitoring: Cloudflare Analytics + Supabase Logs

Notes:

Deployment is steady and predictable.

Infrastructure is minimal but scalable.

No servers to maintain.

8. Development Workflow
Prototype
Lovable generates UI and initial code

GitHub stores the repo

VS Code used for refinement

Engineering
Copilot assists with backend logic

GitHub PRs for structured changes

Automated tests added

Deployment
CI/CD via GitHub Actions

Cloudflare deployment

9. Guiding Principles
Care‑led

Secure by design

Modular

Scalable

Transparent

Easy to maintain

Tend’s architecture is intentionally quiet, predictable, and safe.