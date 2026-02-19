# System Design

## High-Level Component Diagram

```
┌──────────────────────────────────────────────────────────┐
│                    Client (Browser)                       │
│              Next.js — SSR / SSG / CSR                   │
│  ┌────────────┐  ┌───────────────┐  ┌─────────────────┐  │
│  │ Public     │  │ Member Portal │  │  Admin Panel    │  │
│  │ Pages      │  │ (auth-gated)  │  │  (role-gated)   │  │
│  └────────────┘  └───────────────┘  └─────────────────┘  │
└───────────────────────────┬──────────────────────────────┘
                            │ HTTPS / REST API (/api/v1/)
┌───────────────────────────▼──────────────────────────────┐
│                   NestJS API Server                       │
│                                                           │
│  ┌─────────────────┐  ┌───────────────────────────────┐  │
│  │  AuthModule     │  │  RBAC Guard (dynamic, DB-     │  │
│  │  JWT + OAuth2   │  │  driven role/permission check) │  │
│  └─────────────────┘  └───────────────────────────────┘  │
│                                                           │
│  ┌────────────────────────────────────────────────────┐  │
│  │  Feature Modules                                   │  │
│  │  Members · Events · News · Forum · Jobs ·          │  │
│  │  Donations · Mentorship · Notifications ·          │  │
│  │  Search · Admin · Audit Log                        │  │
│  └──────────────────────────┬─────────────────────────┘  │
│                             │                             │
│  ┌──────────────────────────▼─────────────────────────┐  │
│  │  BullMQ Worker (separate process)                  │  │
│  │  Email · Image Processing · Notifications fanout   │  │
│  └────────────────────────────────────────────────────┘  │
└───────┬──────────────────────────┬───────────────────────-┘
        │                          │
┌───────▼──────┐          ┌────────▼───────┐
│  PostgreSQL  │          │     Redis       │
│  (Prisma)    │          │  Cache · Queue  │
│              │          │  · Sessions     │
└──────────────┘          └────────────────┘
        │
┌───────▼──────────────────────────────────┐
│  AWS S3 / MinIO                           │
│  Profile photos · CVs · Event banners ·  │
│  News images · Forum attachments          │
└──────────────────────────────────────────┘
```

---

## Request Lifecycle

1. The browser loads a Next.js page. Public/SEO pages are SSR or SSG; authenticated pages use CSR with API calls.
2. API calls hit `/api/v1/*` on the NestJS server over HTTPS.
3. The **JwtAuthGuard** validates the access token. On expiry, the frontend exchanges the refresh token for a new pair.
4. The **RbacGuard** checks the authenticated user's roles and permissions against the required permission for the route (stored in a database table, evaluated at request time).
5. The controller delegates to the service layer, which uses Prisma to query PostgreSQL or reads from Redis cache.
6. Side-effects (email, push notifications, image processing) are enqueued to a BullMQ queue so the API responds immediately. A dedicated worker process consumes the queue.
7. Files are read/written directly to S3 using pre-signed URLs or server-side SDK calls; the database only stores the S3 key reference.

---

## API Design Standards

- Base path: `/api/v1/`
- RESTful resource naming: plural nouns, no verbs in paths (e.g., `GET /api/v1/events`, `POST /api/v1/events/:id/rsvp`).
- Responses follow a consistent envelope:
  ```json
  {
    "data": { ... },
    "meta": { "page": 1, "total": 120 }   // for paginated responses
  }
  ```
- Errors follow [RFC 7807 Problem Details](https://www.rfc-editor.org/rfc/rfc7807):
  ```json
  {
    "type": "https://csediualumni.com/errors/validation-error",
    "title": "Validation Error",
    "status": 422,
    "detail": "The 'email' field must be a valid email address.",
    "instance": "/api/v1/auth/register"
  }
  ```
- Pagination: cursor-based for large datasets; offset-based for admin lists.
- All timestamps in ISO 8601 UTC format.
- API versioning via URL prefix; breaking changes increment the version.

---

## Data Layer Conventions

- **Soft deletes**: all major entities include `deletedAt: DateTime?`. Queries filter `WHERE deletedAt IS NULL` by default, using Prisma middleware.
- **Audit trail**: a separate `AuditLog` table records actor, action, entity type, entity ID, before/after values, and IP address for all write operations on sensitive resources.
- **Optimistic concurrency**: entities that are frequently updated concurrently include a `version` integer field. Updates fail (409 Conflict) if the version does not match.
- **Indexing**: all foreign keys and common filter/sort columns are indexed. Full-text search vectors are maintained as generated columns.

---

## Caching Strategy

| Resource                       | Cache location | TTL                    | Invalidation trigger    |
| ------------------------------ | -------------- | ---------------------- | ----------------------- |
| Alumni directory page (public) | Redis          | 5 min                  | Member profile update   |
| Individual alumni profile      | Redis          | 10 min                 | Profile save            |
| Event listings                 | Redis          | 2 min                  | Event create/update     |
| News article (public)          | Edge CDN       | 1 hour                 | Article publish/update  |
| User session                   | Redis          | Refresh token lifetime | Logout, password change |
| Rate limit counters            | Redis          | 1 min window           | Rolling                 |

---

## Key Design Decisions

| Decision                              | Rationale                                                                                                                                            |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| SSR/SSG with Next.js for public pages | Required for SEO; pages are crawlable on first request without JavaScript execution                                                                  |
| NestJS modules per feature domain     | Each module has its own controller, service, and repository — enables independent development and testing                                            |
| Dynamic RBAC from database            | Roles and permissions are runtime data, not compile-time constants. System admins configure them without code changes (see [RBAC design](./rbac.md)) |
| BullMQ for async side-effects         | Keeps API latency predictable; failed jobs retry automatically with exponential backoff                                                              |
| Prisma over raw SQL                   | Type-safe queries, auto-generated types align with the shared `packages/types`, and migration tooling keeps schema changes auditable                 |
| Monorepo (pnpm + Turborepo)           | Shared TypeScript types, UI components, and config reduce duplication and eliminate API contract drift                                               |
| S3-compatible storage                 | Decouples file storage from compute; easy to self-host with MinIO during development                                                                 |
