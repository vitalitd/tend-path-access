API_SPEC.md

1. Overview

This document defines the MVP API endpoints for the Tend platform.The API is REST‑based and returns JSON.

2. Authentication

POST /auth/register

Create a new user.

POST /auth/login

Return JWT token.

3. Properties

GET /properties

List all available properties.

GET /properties/{id}

Retrieve property details, rules, and map data.

POST /properties

Create a property (landowner only).

PATCH /properties/{id}

Update property details.

POST /properties/{id}/availability

Toggle availability.

4. Access Requests

POST /access-requests

Create a new access request.

GET /access-requests/{id}

View request status.

PATCH /access-requests/{id}/approve

Landowner approves.

PATCH /access-requests/{id}/decline

Landowner declines.

5. Visits

POST /visits/check-in

Record check‑in.

POST /visits/check-out

Record check‑out.

GET /visits/offline-proof/{id}

Return offline‑safe proof of access.

6. Payments

POST /payments/intent

Create payment intent (Stripe).

POST /payments/confirm

Confirm payment.

7. Admin

GET /admin/audit

List audit logs.