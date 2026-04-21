# STRIPE.md  
Tend — Stripe Integration Notes  
Quiet, careful, safety‑aware design language

---

## 1. Purpose
This document describes how Stripe integrates with the Tend platform.  
Payments are introduced in the Beta phase and are not part of the MVP.  
The design is simple, explicit, and easy to extend.

---

## 2. Payment Flow Overview

1. Visitor submits an access request  
2. Steward approves the request  
3. System generates a Stripe Checkout Session  
4. Visitor completes payment  
5. Stripe sends a webhook to Tend  
6. Tend marks the access request as “paid”  
7. Visitor can check in  

Notes:  
- Payments occur **after approval**, not before.  
- Pricing is per‑visit in early phases.  
- All safety notes remain visible throughout the flow.

---

## 3. Required Stripe Objects

### 3.1 Checkout Session
Used for simple, secure payments.

Metadata attached:
- `visitor_id`
- `property_id`
- `access_request_id`

### 3.2 Webhooks
Tend listens for:

- `checkout.session.completed`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

Notes:  
Webhook handling must be steady and idempotent.

---

## 4. Backend Endpoints (Future)

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

### POST /payments/webhook
Stripe webhook receiver.

Notes:
- Validates signature  
- Updates `access_requests.price_paid`  
- Marks request as “paid”  
- Logs event in `audit_logs`  

---

## 5. Data Model Notes

### AccessRequests
Add fields:
- `price_paid` (number)
- `payment_status` (pending | paid | failed)

### Pricing
MVP uses:
- `pricing_type: per_visit`
- `amount`
- `currency`

Notes:  
Future versions may support subscriptions or day passes.

---

## 6. Testing

### Test Mode
Use Stripe test keys:
- `pk_test_...`
- `sk_test_...`

### Test Cards
- 4242 4242 4242 4242 — success  
- 4000 0000 0000 9995 — failure  

Notes:  
Testing is calm and predictable.

---

## 7. Deployment Notes
- Webhook endpoint must be publicly accessible  
- Use Stripe CLI for local testing  
- Store secrets in environment variables  
- Do not log sensitive data  

---

## 8. Future Extensions
- Payouts to landholders  
- Refunds  
- Dispute handling  
- Multi‑currency support  
- Insurance bundling  

