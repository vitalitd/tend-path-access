# CONTRIBUTING.md  
Tend — Contribution Guidelines  
Quiet, careful, safety‑aware design language

---

## 1. Purpose
This document provides clear guidelines for contributing to the Tend codebase.  
It ensures consistency, quality, and clarity across frontend, backend, and documentation work.

---

## 2. How We Work
Tend follows a simple, steady workflow:

**Prototype → Engineer → Deploy**

- Lovable may generate initial components  
- VS Code + GitHub Copilot are used for refinement  
- All changes go through GitHub pull requests  
- Documentation lives in `/docs` and must remain up to date  

Notes:  
The tone across all contributions is calm, factual, and safety‑aware.

---

## 3. Branching Strategy

### Main Branches
- **main** — stable, deployable  
- **dev** — active development  

### Feature Branches
Use short, descriptive names:

- `feature/<short-description>`  
- `fix/<short-description>`  
- `docs/<short-description>`  

Notes:  
Branches should be small, focused, and easy to review.

---

## 4. Pull Requests

Every PR must include:

- Summary of changes  
- Linked issue (if applicable)  
- Screenshots for UI changes  
- Notes on breaking changes  
- Tests (where relevant)  

Requirements:
- PRs require at least one approval before merging  
- PR descriptions should be calm, factual, and explicit  
- Large PRs should be broken into smaller pieces  

---

## 5. Code Style

### Frontend
- React or Next.js  
- ESLint + Prettier  
- Functional components  
- Avoid unnecessary state  
- Use TypeScript where possible  
- Keep UI steady, simple, and accessible  

### Backend
- Node.js (Express) or Python (FastAPI)  
- Clear separation of routes, services, and models  
- Use environment variables for secrets  
- Follow REST conventions  
- Validation is strict and predictable  

Notes:  
Backend logic should be explicit and easy to reason about.

---

## 6. Documentation

All major features must include updates to:

- Architecture notes  
- API specification  
- UX flows  
- Data model definitions  

Notes:  
Documentation changes should be included in the same PR as the feature when possible.

---

## 7. Commit Messages

Use **conventional commits**:

- `feat:` add access request flow  
- `fix:` correct map boundary validation  
- `docs:` update architecture  
- `refactor:` simplify booking logic  

Notes:  
Commit messages should be short, clear, and descriptive.

---

## 8. Testing

- Unit tests for backend logic  
- Component tests for critical UI  
- Manual testing for map and offline flows  

Notes:  
Tests should be steady and predictable, not brittle.

---

## 9. Security

- Never commit secrets  
- Follow role‑based access control  
- Validate all inputs  
- Log access events  
- Treat safety‑related logic with extra care  

Notes:  
Security is part of every contribution, not a separate step.

---

## 10. Contact
For questions, open a GitHub issue or contact the maintainers.

