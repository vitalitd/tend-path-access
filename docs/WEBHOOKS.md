# Webhooks

This document describes all webhook endpoints used by the Tend Path Access platform, including payload formats, verification, retry logic, and testing procedures.

---

## 1. Overview

Tend uses webhooks to receive asynchronous events from external services, primarily Stripe. Webhooks allow the platform to react to payment events, subscription changes, and payout updates.

---

## 2. Webhook Endpoints

### Stripe Webhook

POST /webhooks/stripe


### Supported Events
- `payment_intent.succeeded`
- `payment_intent.payment_failed`
- `checkout.session.completed`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payout.paid`
- `payout.failed`

---

## 3. Signature Verification

All incoming webhook requests must be verified using Stripe’s signing secret:


STRIPE_WEBHOOK_SECRET


Requests failing verification must return:


400 Bad Request


---

## 4. Retry Logic

Stripe retries failed webhook deliveries for up to **72 hours**.

Your endpoint must be **idempotent**.

---

## 5. Error Handling

- Log all failures
- Store raw payloads for debugging
- Never expose internal errors to the client
- Use correlation IDs for tracing

---

## 6. Local Testing

Use the Stripe CLI:


stripe listen --forward-to localhost:3000/webhooks/stripe


Trigger events:


stripe trigger payment_intent.succeeded


---

## 7. Security

- Validate signatures
- Enforce HTTPS
- Rate-limit webhook endpoint
- Never trust client-supplied data