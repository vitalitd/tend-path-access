# Tend  
A quiet, careful digital access platform for landholders and visitors

---

## 1. Overview
Tend is a digital access platform that connects landholders and visitors through a trusted, care‑led system.  
It provides a simple way for visitors to request access to private land, and for landholders to manage availability, safety notes, and on‑property activity.

The platform is designed to be:

- quiet and factual  
- safety‑aware  
- modular and easy to evolve  
- suitable for both prototype and production environments  

Tend supports rapid iteration (Lovable), structured engineering (VS Code + Copilot), and long‑term deployment (Azure).

---

## 2. Core Features (MVP)

### Visitor
- Browse available properties  
- View safety notes and rules  
- Request access  
- Receive approval or decline  
- Check in and check out  

### Landholder
- Create and manage properties  
- Set rules, safety notes, and availability  
- Review and approve/decline access requests  
- Monitor active visitors  

### System
- Authentication (visitor + landholder roles)  
- Access request lifecycle  
- Visit logging  
- Audit logging  
- Map‑based property boundaries  

---

## 3. Architecture Summary
Tend consists of three major layers:

### Frontend
- React or Next.js  
- Calm, steady UI  
- Map‑based navigation  
- Steward and visitor dashboards  

### Backend
- Node.js (Express) or Python (FastAPI)  
- REST API returning JSON  
- Business logic, validation, and rule enforcement  

### Database
- PostgreSQL (Supabase or Azure Postgres)  
- PostGIS for geospatial fields  
- Structured, explicit schema  

For full details, see:  
**/docs/ARCHITECTURE.md**

---

## 4. Data Model Summary
The core entities include:

- Users  
- Properties  
- AccessRules  
- AccessRequests  
- Visits  
- Pricing  
- AuditLogs  

Future extensions include Tasks and Points.

For full definitions, see:  
**/docs/DATA_MODEL.md**

---

## 5. API Summary
The API is REST‑based and predictable.

### Key Endpoints
- `/auth/register`, `/auth/login`  
- `/properties`, `/properties/{id}`  
- `/access-requests`, `/access-requests/{id}`  
- `/visits/check-in`, `/visits/check-out`  
- `/admin/audit`  

For full request/response shapes, see:  
**/docs/API_SPEC.md**

---

## 6. UX Flows
The UX is calm, factual, and safety‑aware
### Steward Flow
- Sign in  
- Manage properties  
- Review access requests  
- Monitor active visitors  

### Visitor Flow
- Browse registry  
- Request access  
- Await approval  
- Check in / check out  

For full flows, see:  
**/docs/UX_FLOWS.md**

---

## 7. Roadmap
Tend follows a clear, phased roadmap:

1. Prototype  
2. MVP  
3. Beta  
4. Launch  
5. Scale  

Each phase builds steadily on the last, prioritising safety, clarity, and trust.

Full roadmap:  
**/docs/ROADMAP.md**

---

## 8. Contribution Guidelines
Contributions follow a simple, steady workflow:

- Prototype → Engineer → Deploy  
- All changes via pull requests  
- Conventional commits  
- Clear branching strategy  
- Documentation updated with each feature  

Full guidelines:  
**/docs/CONTRIBUTING.md**

---

## 9. Development Setup

### Prerequisites
- Node.js or Python (depending on backend choice)  
- PostgreSQL or Supabase  
- Git  
- VS Code with GitHub Copilot  

### Clone the repository

### Install dependencies (example: Node backend)

### Run development server


### Environment variables
Create a `.env` file with:


(See CONTRIBUTING.md for details.)

---

## 10. Deployment
### MVP
- Frontend: Vercel or Lovable hosting  
- Backend: Lovable backend or simple Node server  
- Database: Supabase  

### Production
- Azure Static Web Apps  
- Azure App Service  
- Azure Postgres  
- Azure Blob Storage  
- Azure Application Insights  

---

## 11. Guiding Principles
- Care‑led  
- Secure by design  
- Modular  
- Scalable  
- Transparent  
- Easy to maintain  

---

## 12. License
TBD — choose a license before public release.

