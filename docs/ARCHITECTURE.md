ARCHITECTURE.md

A clear, technical overview of the Tend platform architecture

1. Overview

Tend is a digital access platform that connects landholders and visitors through a trusted, care‑led system. The architecture is designed to be modular, scalable, and easy to evolve from prototype to production. It supports rapid iteration (via Lovable), structured engineering (via VS Code + Copilot), and long‑term deployment (via Azure).

2. System Architecture

Tend consists of three major layers:

1. Frontend (Client Layer)

Framework: React or Next.js

Purpose: User-facing interface for landholders and visitors

Key Features:

Authentication

Property discovery

Access request flow

Check‑in / check‑out

Map-based navigation

Landholder dashboard

2. Backend (Application Layer)

Framework: Node.js (Express) or Python (FastAPI)

Purpose: Business logic, API endpoints, validation, and integrations

Key Responsibilities:

User management

Access request lifecycle

Visit tracking

Rule enforcement

Notifications

Payment integration (future)

Insurance integration (future)

3. Database (Persistence Layer)

Database: PostgreSQL (Supabase or Azure Postgres)

Purpose: Store structured, relational data

Core Tables:

users

properties

rules

access_requests

visits

pricing

audit_logs

3. Data Flow

Visitor Flow

Visitor browses properties

Requests access

Backend validates request

Landholder approves/declines

Visitor receives confirmation

Visitor checks in/out

Visit logged in audit trail

Landholder Flow

Landholder creates property

Sets rules, availability, pricing

Receives access requests

Approves/declines

Views visit history

4. Authentication & Security

Auth Provider: Auth0, Supabase Auth, or Azure AD B2C

Security Measures:

JWT-based authentication

Role-based access control (visitor, landholder, admin)

Audit logging

Input validation

Rate limiting

5. Maps & Geospatial Logic

Map Provider: Mapbox or Leaflet

Features:

Property boundaries

Allowed zones

Restricted zones

Check‑in radius validation

GPS-based visit tracking

6. Integrations (Future)

Payments

Stripe for bookings and payouts

Insurance

API integration for coverage verification

Notifications

Email (SendGrid)

SMS (Twilio)

7. Deployment Architecture

MVP

Frontend: Vercel or Lovable hosting

Backend: Lovable backend or simple Node server

Database: Supabase

Production

Frontend: Azure Static Web Apps

Backend: Azure App Service

Database: Azure Postgres

Storage: Azure Blob Storage

Monitoring: Azure Application Insights

8. Development Workflow

Prototype

Lovable generates UI and initial code

GitHub stores repo

VS Code used for refinement

Engineering

Copilot assists with backend logic

GitHub PRs for structured changes

Automated tests added

Deployment

CI/CD pipeline via GitHub Actions

Azure hosting

9. Guiding Principles

Care-led

Secure by design

Modular

Scalable

Transparent

Easy to maintain