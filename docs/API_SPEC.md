# API_SPEC.md  
Tend — MVP API Specification  
Quiet, careful, safety‑aware design language

---

## 1. Overview
This document defines the MVP API endpoints for the Tend platform.  
The API is REST‑based, returns JSON, and follows predictable, explicit patterns.

All endpoints require authentication unless noted.

---

## 2. Authentication

### POST /auth/register
Create a new user.

Request:
{
  "name": "string",
  "email": "string",
  "password": "string",
  "role": "visitor | landholder"
}

Response:
{
  "id": "uuid",
  "email": "string",
  "role": "string"
}

---

### POST /auth/login
Authenticate a user and return a JWT.

Request:
{
  "email": "string",
  "password": "string"
}

Response:
{
  "token": "jwt",
  "user": {
    "id": "uuid",
    "role": "string"
  }
}

---

## 3. Properties

### GET /properties
List all available properties.

Response:
[
  {
    "id": "uuid",
    "name": "string",
    "location": { "lat": number, "lng": number },
    "availability": boolean,
    "safety_notes": "string"
  }
]

---

### GET /properties/{id}
Retrieve property details, rules, and map data.

Response:
{
  "id": "uuid",
  "name": "string",
  "description": "string",
  "location": { "lat": number, "lng": number },
  "boundary_geojson": {},
  "allowed_activities": ["string"],
  "availability": boolean,
  "conditions": "string",
  "rules": {
    "group_size_limit": number,
    "time_restrictions": "string",
    "warnings": ["string"],
    "no_go_zones_geojson": {}
  }
}

---

### POST /properties  (landholder only)
Create a property.

Request:
{
  "name": "string",
  "description": "string",
  "location": { "lat": number, "lng": number },
  "boundary_geojson": {},
  "allowed_activities": ["string"],
  "conditions": "string"
}

Response:
{
  "id": "uuid"
}

---

### PATCH /properties/{id}
Update property details.

Request:
{
  "name": "string?",
  "description": "string?",
  "allowed_activities": ["string"]?,
  "conditions": "string?"
}

---

### POST /properties/{id}/availability
Toggle availability.

Request:
{
  "available": boolean
}

---

## 4. Access Requests

### POST /access-requests
Create a new access request.

Request:
{
  "property_id": "uuid",
  "dates": "string",
  "group_size": number,
  "purpose": "string",
  "conditions_acknowledged": true
}

Response:
{
  "id": "uuid",
  "status": "pending"
}

---

### GET /access-requests/{id}
View request status.

Response:
{
  "id": "uuid",
  "status": "pending | approved | declined | cancelled",
  "property_id": "uuid",
  "visitor_id": "uuid"
}

---

### PATCH /access-requests/{id}/approve  (landholder only)
Approve an access request.

Response:
{
  "status": "approved"
}

---

### PATCH /access-requests/{id}/decline  (landholder only)
Decline an access request.

Request (optional):
{
  "note": "string"
}

Response:
{
  "status": "declined"
}

---

## 5. Visits

### POST /visits/check-in
Record check‑in.

Request:
{
  "access_request_id": "uuid",
  "location": { "lat": number, "lng": number }?
}

Response:
{
  "visit_id": "uuid",
  "check_in_time": "timestamp"
}

---

### POST /visits/check-out
Record check‑out.

Request:
{
  "visit_id": "uuid"
}

Response:
{
  "check_out_time": "timestamp"
}

---

### GET /visits/offline-proof/{id}
Return offline‑safe proof of access.

Response:
{
  "visit_id": "uuid",
  "hash": "string"
}

---

## 6. Payments (Future)

### POST /payments/intent
Create a Stripe Checkout Session.

Request:
{
  "access_request_id": "uuid"
}

Response:
{
  "checkout_url": "string"
}

---

### POST /payments/webhook
Stripe webhook receiver.

Notes:
- Validates Stripe signature  
- Updates payment status  
- Marks access request as “paid”  
- Logs event in audit trail  

## 7. Admin

### GET /admin/audit  (admin only)
List audit logs.

Response:
[
  {
    "id": "uuid",
    "event_type": "string",
    "user_id": "uuid",
    "property_id": "uuid",
    "timestamp": "timestamp",
    "metadata": {}
  }
]

---

## 8. Notes on Tone and Safety
- All responses are calm, factual, and explicit.  
- Error messages avoid blame and provide clear next steps.  
- Safety‑related fields (warnings, conditions, no‑go zones) are always returned when relevant.  
- No marketing language is used.  

