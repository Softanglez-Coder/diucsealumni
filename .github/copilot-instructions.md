# GitHub Copilot Instructions — CSE DIU Alumni Platform

These instructions are automatically included in every Copilot Chat context. Read them fully before generating any code, tests, migrations, or documentation for this project.

---

## Project overview

**CSE DIU Alumni** is a full-stack web platform for alumni of the Computer Science & Engineering department of Dhaka International University. It connects alumni with each other and with the institution through profiles, events, a job board, a donation system, a discussion forum, a mentorship programme, and more.

Full functional requirements → `docs/requirements/functional.md`  
Full non-functional requirements → `docs/requirements/non-functional.md`

---

## Architecture — most important rules

### Single application — no separate admin app

There is **one** Next.js frontend (`apps/web`). There is no separate admin panel or admin subdomain. All management features (membership approval, role management, content moderation, analytics, audit log, system settings) live at `/portal/manage/**` inside the same site. Permissions control what each user sees — never create a second frontend application.

### Permission-driven UI

Every page, button, and API route is gated by the RBAC system. The UI must never show a control that the current user is not permitted to use. Guard checks happen on both the NestJS API (permission guards) and the Next.js frontend (conditional rendering based on the session's permission set).

### Monorepo structure

```
apps/
  web/        ← Next.js (React, TypeScript) — public site + member portal
  api/        ← NestJS (Node.js, TypeScript) — REST API
packages/
  types/      ← Shared TypeScript types and Zod schemas
  config/     ← Shared ESLint, Prettier, TypeScript configs
  prisma/     ← Prisma schema and migrations (single source of truth for the DB model)
```

Full architecture details → `docs/architecture/system-design.md`  
ADRs → `docs/architecture/adr/`

---

## Tech stack (non-negotiable — do not suggest alternatives)

| Layer            | Choice                                                       |
| ---------------- | ------------------------------------------------------------ |
| Frontend         | Next.js (App Router), React, TypeScript strict               |
| Backend          | NestJS, TypeScript strict                                    |
| Database         | PostgreSQL 16+ via Prisma ORM                                |
| Cache / Queues   | Redis 7+ — sessions (refresh tokens), BullMQ background jobs |
| Auth             | Passport.js + `@nestjs/passport` — JWT + Google OAuth 2.0    |
| File storage     | AWS S3 / MinIO                                               |
| Search           | PostgreSQL full-text search (Elasticsearch if/when needed)   |
| Email            | Nodemailer + SMTP / SendGrid                                 |
| Payments         | SSLCommerz (BDT), Stripe (international)                     |
| Image processing | Sharp                                                        |
| Error monitoring | Sentry                                                       |
| Logging          | Pino (structured JSON)                                       |
| Monorepo tooling | pnpm workspaces + Turborepo                                  |
| Unit testing     | Vitest                                                       |
| E2E testing      | Playwright                                                   |
| CI/CD            | GitHub Actions                                               |

Full stack rationale → `docs/architecture/tech-stack.md`

---

## RBAC model

- Roles and permissions are **database records**, not hardcoded enums. Never hardcode role names in business logic — always check permissions by name (e.g., `events:create`), not by role name.
- Permission naming convention: `<resource>:<action>` (e.g., `members:approve`, `events:delete`).
- A user can hold multiple roles simultaneously; effective permissions = union of all role permissions.
- System roles (`admin`, `moderator`, `member`) cannot be deleted.
- Always use the `@RequirePermissions('resource:action')` decorator on NestJS controllers/handlers; never rely on role names in guards.

Full RBAC design → `docs/architecture/rbac.md`

---

## Authentication model

- **Access token:** short-lived JWT (15 min), stored in memory on the client.
- **Refresh token:** long-lived (7 days), stored in an `HttpOnly Secure SameSite=Strict` cookie, hashed in the database, rotated on every use.
- **Google OAuth 2.0** via Passport — new accounts still require membership approval before accessing member-only areas.
- MFA (TOTP) is mandatory for admins, optional for regular users.
- Session invalidation is immediate — use token blacklisting via Redis.
- Never store tokens in `localStorage`.

Full auth design → `docs/architecture/authentication.md`

---

## Member portal

Authenticated users land at `/portal`. The portal is the single entry point for all authenticated actions:

- `/portal` — personalised dashboard (upcoming RSVPs, notifications, membership status, recent activity)
- `/portal/profile` — edit profile, privacy settings, CV upload, linked OAuth providers
- `/portal/activity` — RSVPs, donations, forum posts, mentorship history
- `/portal/settings` — notification preferences, password change, account deletion
- `/portal/manage/**` — management sections, visible only to `moderator` / `admin` roles

---

## Key feature modules (summary)

1. **Authentication & Authorization** — email/password + Google OAuth, JWT sessions, MFA
2. **Membership Management** — application submission, approval workflow, tiered membership, membership number issuance
3. **Alumni Profile & Member Portal** — public profile at `/alumni/[username]`, unified authenticated portal
4. **Alumni Directory** — members-only searchable/filterable directory
5. **Event Management** — RSVP, attendee lists, reminders, photo galleries
6. **News & Updates** — rich-text articles, draft/publish workflow, comments, newsletter
7. **Discussion Forum** — categories, threads, upvoting, moderation
8. **Donation & Fundraising** — campaigns, SSLCommerz + Stripe, anonymous donations
9. **Job Board** — postings with admin approval, email notifications, expiry
10. **Mentorship Program** — mentor registration, request/accept flow, messaging, ratings
11. **Notification System** — in-app bell, per-user preferences, email digest
12. **Management Panel** — role-gated at `/portal/manage/**`; moderator queue + full admin section
13. **Search & Discovery** — global search across profiles, events, news, forum, jobs; membership number lookup
14. **Membership Card** — unique membership number (`CSEDIA-<TIER>-<YEAR>-<SEQ>`), downloadable PDF/PNG card, QR code, public verification page at `/verify/[membership-number]`

The **Shop** feature is deferred — do **not** implement or scaffold anything shop-related.

---

## Code standards (enforced — do not deviate)

- **TypeScript strict mode everywhere.** No `any` without an `// eslint-disable-next-line` comment and a clear reason.
- `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess` are all enabled.
- **NestJS patterns:** use modules, services, controllers, guards, pipes, and interceptors as intended. No business logic in controllers — delegate entirely to services.
- **No raw SQL.** All database access through Prisma parameterized queries.
- **No `console.log` in production code.** Use Pino logger via the NestJS `LoggerService`.
- **Prettier config:** `singleQuote: true`, `trailingComma: 'all'`, `printWidth: 100`, `semi: true`, `tabWidth: 2`, `endOfLine: 'lf'`.
- **Import order:** enforced by `eslint-plugin-import`. External packages first, then internal workspace packages (`@csedia/*`), then relative imports.
- **Conventional Commits** format for all commit messages (`feat:`, `fix:`, `chore:`, `docs:`, `test:`, `refactor:`, etc.).
- **No dead code.** Remove unused imports, variables, and functions.

Full standards → `docs/development/code-standards.md`

---

## Testing requirements

| Scope                     | Lines     | Statements | Functions | Branches  |
| ------------------------- | --------- | ---------- | --------- | --------- |
| **Project-wide**          | **> 70%** | **> 70%**  | **> 70%** | **> 70%** |
| `apps/api/src/modules/**` | ≥ 80%     | ≥ 80%      | ≥ 80%     | ≥ 80%     |
| `apps/web/src/hooks/**`   | ≥ 75%     | ≥ 75%      | ≥ 75%     | ≥ 70%     |
| `packages/**`             | ≥ 80%     | ≥ 80%      | ≥ 80%     | ≥ 75%     |

- **Unit tests:** Vitest, co-located `*.spec.ts` files. Every service method with meaningful logic must have a unit test.
- **Integration tests:** Vitest + Supertest, in `apps/api/test/`. Every API endpoint needs at least one happy-path and one failure-path test.
- **E2E tests:** Playwright, in `apps/web/e2e/`. Cover critical user journeys (registration, login, profile, event RSVP, membership).
- Use `mockDeep<PrismaClient>()` (vitest-mock-extended) for Prisma in unit tests — never hit a real database in unit tests.
- Never use production data in tests.
- CI blocks merges if coverage drops below project-wide thresholds.

Full testing strategy → `docs/development/testing.md`

---

## Non-functional constraints (binding)

- **TTFB** < 200 ms, **LCP** < 2.5 s, **API p95** < 300 ms (read) / 800 ms (write).
- **HTTPS only.** All security headers enforced (CSP, HSTS, X-Frame-Options, etc.).
- **WCAG 2.1 Level AA** accessibility on all pages.
- **SSR/SSG** for all public-facing pages (Next.js App Router).
- **Uptime SLA:** 99.9%.
- **Background jobs** (email, image processing, notifications) must use BullMQ — never block the API response path.
- **File uploads:** validate MIME type, magic bytes, size limit, virus scanning.
- Sensitive fields (phone, email) encrypted at rest.

Full NFRs → `docs/requirements/non-functional.md`

---

## What NOT to do

- Do **not** create a separate admin application or admin subdomain.
- Do **not** hardcode role names in guards or business logic — check permissions by name.
- Do **not** store tokens in `localStorage` or expose them in the URL.
- Do **not** write raw SQL — use Prisma.
- Do **not** put business logic in NestJS controllers.
- Do **not** use `any` without justification.
- Do **not** scaffold or implement anything related to the Shop feature.
- Do **not** use `console.log` — use the injected logger.
- Do **not** skip tests for service methods with meaningful logic.
- Do **not** commit secrets or environment variables — use `.env` files (gitignored) and the documented env var schema.

---

## Docs index

| Document                      | Path                                       |
| ----------------------------- | ------------------------------------------ |
| Functional requirements       | `docs/requirements/functional.md`          |
| Non-functional requirements   | `docs/requirements/non-functional.md`      |
| System design & architecture  | `docs/architecture/system-design.md`       |
| Authentication design         | `docs/architecture/authentication.md`      |
| RBAC design                   | `docs/architecture/rbac.md`                |
| Tech stack                    | `docs/architecture/tech-stack.md`          |
| Architecture decision records | `docs/architecture/adr/`                   |
| Getting started               | `docs/development/getting-started.md`      |
| Code standards                | `docs/development/code-standards.md`       |
| Testing strategy              | `docs/development/testing.md`              |
| Git workflow                  | `docs/development/git-workflow.md`         |
| Git hooks                     | `docs/development/git-hooks.md`            |
| Environment variables         | `docs/deployment/environment-variables.md` |
| Infrastructure                | `docs/deployment/infrastructure.md`        |
