# Deployment Guide

This document describes how to deploy the Tend Path Access application across local, staging, and production environments. It covers environment setup, build steps, configuration, secrets management, and operational considerations.

---

## 1. Environments

### Local Development
Used for feature development and testing.

### Staging
Used for integration testing, steward onboarding tests, and pre‑production validation.

### Production
Live environment serving landholders, stewards, and visitors.

---

## 2. Technology Stack

- **Frontend:** React / Next.js
- **Backend:** Node.js (Express or equivalent)
- **Database:** PostgreSQL
- **Authentication:** JWT-based
- **Payments:** Stripe
- **Hosting:** (e.g., Vercel, AWS, Azure — update once finalised)
- **CI/CD:** GitHub Actions

---

## 3. Environment Variables

Create a `.env` file for each environment:


DATABASE_URL= JWT_SECRET= STRIPE_SECRET_KEY= STRIPE_WEBHOOK_SECRET= APP_BASE_URL= LOG_LEVEL=


Never commit `.env` files to Git.

---

## 4. Local Setup

1. Clone the repository:

git clone https://github.com/vitalitd/tend-path-access (github.com in Bing)

2. Install dependencies:

npm install

3. Start the development server:

npm run dev


---

## 5. Build & Deployment Steps

### Staging Deployment
1. Merge feature branch into `staging`
2. GitHub Actions triggers:
- Run tests
- Build application
- Deploy to staging environment

### Production Deployment
1. Merge `staging` → `main`
2. GitHub Actions triggers:
- Run full test suite
- Build production bundle
- Deploy to production environment
3. Post-deploy checks:
- API health
- Database migrations
- Stripe connectivity
- Webhook delivery

---

## 6. Database Migrations

Use Prisma or equivalent:


npx prisma migrate deploy


Migrations run automatically during CI/CD.

---

## 7. Rollback Procedure

1. Revert to previous deployment in hosting provider
2. Revert database migration if required:

npx prisma migrate resolve --rolled-back

3. Notify stakeholders

---

## 8. Monitoring & Logging

- Application logs (structured JSON)
- Error tracking (Sentry or equivalent)
- Stripe webhook logs
- Database performance metrics

---

## 9. Security Considerations

- Rotate secrets every 90 days
- Enforce HTTPS everywhere
- Validate all webhook signatures
- Apply rate limiting to public endpoints

---

## 10. Deployment Checklist

- [ ] All tests passing
- [ ] Migrations reviewed
- [ ] Environment variables validated
- [ ] Webhooks tested
- [ ] Monitoring dashboards green
- [ ] Stakeholders notified