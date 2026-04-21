CONTRIBUTING.md

1. Purpose

This document provides guidelines for contributing to the Tend codebase. It ensures consistency, quality, and clarity across frontend, backend, and documentation work.

2. How We Work

Prototype → Engineer → Deploy workflow

Lovable may generate initial components

VS Code + GitHub Copilot used for refinement

All changes go through GitHub pull requests

Documentation lives in /docs

3. Branching Strategy

main — stable, deployable

dev — active development

Feature branches:

feature/<short-description>
fix/<short-description>
docs/<short-description>

4. Pull Requests

Every PR must include:

Summary of changes

Linked issue (if applicable)

Screenshots for UI changes

Notes on breaking changes

Tests (where relevant)

PRs require at least one approval before merging.

5. Code Style

Frontend

React/Next.js

ESLint + Prettier

Functional components

Avoid unnecessary state

Use TypeScript where possible

Backend

Node.js (Express) or Python (FastAPI)

Clear separation of routes, services, models

Use environment variables for secrets

Follow REST conventions

6. Documentation

All major features must include:

Architecture notes

API updates

UX flow updates

Data model changes

7. Commit Messages

Use conventional commits:

feat: add access request flow
fix: correct map boundary validation
docs: update architecture
refactor: simplify booking logic

8. Testing

Unit tests for backend logic

Component tests for critical UI

Manual testing for map and offline flows

9. Security

Never commit secrets

Follow role‑based access control

Validate all inputs

Log access events

10. Contact

For questions, open a GitHub issue or contact the maintainers.
