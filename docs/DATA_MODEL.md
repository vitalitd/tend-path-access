# DATA_MODEL.md  
Tend — Core Data Model  
Quiet, careful, safety‑aware design language

---

## 1. Overview
This document defines the core data structures for the Tend platform.  
It reflects the MVP requirements and provides a stable foundation for future extensions such as tasks, points, and richer safety metadata.

The model is intentionally simple, explicit, and easy to reason about.

---

## 2. Entity List (MVP)

- Users  
- Properties  
- AccessRules  
- AccessRequests  
- Visits  
- Pricing  
- AuditLogs  

### Future (not MVP)
- Tasks  
- Points  

---

## 3. Entity Definitions

---

## 3.1 Users
Represents all authenticated users of the platform.

Fields:
- **id** (UUID)  
- **role** (visitor | landowner | admin)  
- **name**  
- **email**  
- **phone**  
- **created_at**

Notes:
- Landowners can create and manage properties.  
- Visitors can request access and check in/out.  
- Admin is reserved for operational oversight.

---

## 3.2 Properties
Represents a land parcel available for access.

Fields:
- **id** (UUID)  
- **landowner_id** (FK → Users.id)  
- **name**  
- **description**  
- **location** (lat, lng)  
- **boundary_geojson**  
- **allowed_activities** (array of strings)  
- **availability** (boolean or schedule block)  
- **conditions** (safety notes, rules, hazards)  
- **created_at**

Notes:
- Safety notes include livestock, machinery, terrain, weather considerations.  
- Boundary GeoJSON supports map rendering and future routing.

---

## 3.3 AccessRules
Defines constraints and safety‑related requirements for a property.

Fields:
- **id** (UUID)  
- **property_id** (FK → Properties.id)  
- **group_size_limit**  
- **time_restrictions** (e.g., daylight hours only)  
- **warnings** (e.g., bulls, snakes, machinery zones)  
- **no_go_zones_geojson**

Notes:
- Rules are displayed to visitors before requesting access.  
- Acknowledgement is required.

---

## 3.4 AccessRequests
Represents a visitor’s request to access a property.

Fields:
- **id** (UUID)  
- **user_id** (FK → Users.id)  
- **property_id** (FK → Properties.id)  
- **status** (pending | approved | declined | cancelled)  
- **requested_datetime**  
- **group_size**  
- **price_paid**  
- **conditions_acknowledged** (boolean)  
- **created_at**
- **price_paid**  
- payment_status (pending | paid | failed)

Notes:
- Approval triggers instructions and safety reminders.  
- Declines are factual and polite.

---

## 3.5 Visits
Represents an approved