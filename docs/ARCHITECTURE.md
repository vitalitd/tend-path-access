# ARCHITECTURE.md  
Tend — System Architecture  
Quiet, careful, safety‑aware design language

---

## 1. Overview
Tend is a digital access platform that connects landholders and visitors through a trusted, care‑led system.  
The architecture is modular, steady, and easy to evolve from prototype to production.  
It supports:

- rapid iteration (Lovable)  
- structured engineering (VS Code + Copilot)  
- long‑term deployment (Azure)  

The system is intentionally simple and explicit.

---

## 2. System Architecture

Tend consists of three major layers:

---

## 2.1 Frontend (Client Layer)

**Framework:** React or Next.js  
**Purpose:** User‑facing interface for landholders and visitors

Key Responsibilities:
- Authentication  
- Property discovery  
- Access request flow  
- Check‑in / check‑out  
- Map‑based navigation  
- Landholder dashboard  

Notes:
- Tone is quiet and factual.  
- Safety notes are always visible.  

---

## 2.2 Backend (Application Layer)

**Framework:** Node.js (Express) or Python (FastAPI)  
**Purpose:** Business logic, API endpoints, validation, and integrations

Key Responsibilities:
- User management  
- Access request lifecycle  
- Visit tracking  
- Rule enforcement  
- Notifications (future)  
- Payment integration (future)  
- Insurance integration (future)  

Notes:
- API is REST‑based and returns JSON.  
- Validation is strict and predictable.  

---

## 2.3 Database (Persistence Layer)

**Database:** PostgreSQL (Supabase or Azure Postgres)  
**Purpose:** Store structured, relational data

Core Tables:
- users  
- properties  
- access_rules  
- access_requests  
- visits  
- pricing  
- audit_logs  

Notes:
- Geospatial fields use PostGIS where needed.  
- Audit logs support operational oversight.  

---

## 3. Data Flow

---

### 3.1 Visitor Flow
1. Visitor browses available properties  
2. Submits an access request  
3. Backend validates request  
4. Landholder approves or declines  
5. Visitor receives confirmation  
6. Visitor checks in and checks out  
7. Visit is logged in the audit trail  

---

### 3.2 Landholder Flow
1. Landholder creates a property  
2. Sets rules, availability, and pricing  
3. Receives access requests  
4. Approves or declines  
5. Views visit history  

---

## 4. Authentication & Security

**Auth Provider:** Auth0, Supabase Auth, or Azure AD B2C

Security Measures:
- JWT‑based authentication  
- Role‑based access control (visitor, landholder, admin)  
- Audit logging  
- Input validation  
- Rate limiting  

Notes:
- Safety and privacy are prioritised.  
- Admin role is reserved for operational oversight.  

---

## 5. Maps & Geospatial Logic

**Map Provider:** Mapbox or Leaflet

Features:
- Property boundaries  
- Allowed zones  
- Restricted zones  
- Check‑in radius validation  
- GPS‑based visit tracking  

Notes:
- GPS is optional and privacy‑aware.  
- No‑go zones are displayed clearly and calmly.  

---

## 6. Integrations (Future)

### Payments
- Stripe for bookings and payouts

### Insurance
- API integration for coverage verification

### Notifications
- Email (SendGrid)  
- SMS (Twilio)

Notes:
- Not included in MVP.  
- Designed for clean future expansion.  

---

## 7. Deployment Architecture

### MVP
- **Frontend:** Vercel or Lovable hosting  
- **Backend:** Lovable backend or simple Node server  
- **Database:** Supabase  

### Production
- **Frontend:** Azure Static Web Apps  
- **Backend:** Azure App Service  
- **Database:** Azure Postgres  
- **Storage:** Azure Blob Storage  
- **Monitoring:** Azure Application Insights  

Notes:
- Deployment is steady and predictable.  
- Infrastructure is minimal but scalable.  

---

## 8. Development Workflow

### Prototype
- Lovable generates UI and initial code  
- GitHub stores the repo  
- VS Code used for refinement  

### Engineering
- Copilot assists with backend logic  
- GitHub PRs for structured changes  
- Automated tests added  

### Deployment
- CI/CD via GitHub Actions  
- Azure hosting  

---

## 9. Guiding Principles
- Care‑led  
- Secure by design  
- Modular  
- Scalable  
- Transparent  
- Easy to maintain  

