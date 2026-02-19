# Architecture Decision Records (ADRs)

An ADR documents a significant architectural decision: the context that led to it, the decision made, and its consequences. Records are immutable — to reverse or supersede a decision, a new ADR is added.

## Format

Each ADR follows the [MADR](https://adr.github.io/madr/) template (Markdown Architectural Decision Records).

## Index

| #                                               | Title                                       | Status   |
| ----------------------------------------------- | ------------------------------------------- | -------- |
| [0001](./0001-monorepo-with-pnpm-workspaces.md) | Use pnpm workspaces monorepo                | Accepted |
| [0002](./0002-nextjs-for-frontend.md)           | Use Next.js for the frontend                | Accepted |
| [0003](./0003-nestjs-for-backend.md)            | Use NestJS for the backend                  | Accepted |
| [0004](./0004-postgresql-primary-database.md)   | Use PostgreSQL as the primary database      | Accepted |
| [0005](./0005-dynamic-rbac.md)                  | Implement dynamic database-driven RBAC      | Accepted |
| [0006](./0006-google-oauth-strategy.md)         | Backend-driven Google OAuth via Passport.js | Accepted |

## Status Vocabulary

- **Proposed** — Under discussion, not yet adopted.
- **Accepted** — Decision is in effect.
- **Deprecated** — No longer recommended, kept for historical context.
- **Superseded by [XXXX]** — Replaced by a later ADR.
