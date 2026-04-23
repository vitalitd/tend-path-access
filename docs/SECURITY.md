# Security Guidelines

This document outlines the security model, authentication flows, data protection practices, and operational safeguards for the Tend Path Access platform.

---

## 1. Authentication Model

- JWT-based authentication
- Access tokens with short expiry
- Refresh tokens stored securely (HTTP-only cookies)
- Role-based access control:
  - Visitor
  - Steward
  - Landholder
  - Admin

---

## 2. Password & Account Security

- Minimum 12-character passwords
- Password hashing using bcrypt
- Password reset tokens expire in 15 minutes
- Email verification required for all accounts

---

## 3. Data Protection

- All data encrypted in transit (HTTPS)
- Sensitive fields encrypted at rest
- Strict least-privilege database access

---

## 4. API Security

- Input validation on all endpoints
- Rate limiting on public endpoints
- Audit logging for sensitive actions
- CSRF protection for browser-based flows

---

## 5. Stripe Security

- Validate webhook signatures
- Never store raw card data
- Use Stripe Checkout or Payment Elements

---

## 6. Incident Response

1. Identify and isolate issue
2. Rotate secrets
3. Review logs and audit trails
4. Patch vulnerability
5. Notify affected users if required
6. Document incident

---

## 7. Secure Coding Practices

- Avoid dynamic SQL
- Sanitize all user input
- Use parameterized queries
- Avoid storing unnecessary personal data