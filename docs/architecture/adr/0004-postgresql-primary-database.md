# ADR-0004: Use PostgreSQL as the Primary Database

**Status:** Accepted  
**Date:** 2026-02-19

---

## Context

The data model is relational: users have profiles, profiles belong to batches, events have RSVPs, forum threads have replies, donations belong to campaigns, roles have permissions. Strong referential integrity and ACID transactions are required (especially for donation processing and membership management).

## Decision

Use **PostgreSQL 16+** as the primary database, accessed exclusively via **Prisma ORM**.  
Use **Redis 7+** as the secondary store for:

- Session / refresh token validation
- API response caching
- BullMQ job queues
- Rate limiting counters

## Consequences

**Positive:**

- ACID compliance ensures financial and membership data integrity.
- Built-in full-text search (`tsvector` / `tsquery`) covers search requirements without a separate service.
- JSONB columns provide flexibility for user-defined metadata without schema migrations.
- Prisma generates fully typed query clients from the schema — no raw SQL required in application code.
- Wide hosting support (managed: AWS RDS, Supabase, Railway; self-managed: Docker).

**Negative:**

- If search requirements grow significantly (faceted search, fuzzy matching at scale), a dedicated Elasticsearch cluster will need to be added.
- Horizontal write scaling requires read replicas + connection pooling (PgBouncer) — planned for phase 2.
