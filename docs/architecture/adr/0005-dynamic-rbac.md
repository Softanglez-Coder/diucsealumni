# ADR-0005: Implement Dynamic Database-Driven RBAC

**Status:** Accepted  
**Date:** 2026-02-19

---

## Context

The platform requires multiple user types (alumni, moderators, event managers, administrators) with overlapping but distinct permissions. The exact set of roles and their permissions was not known at build time, and the client (alumni association administration) requires the ability to define and adjust roles without a code change or redeployment.

## Decision

Implement a **database-driven RBAC model** where:

- `Permission` records are named capability strings (e.g., `events:create`).
- `Role` records group permissions.
- Users are assigned one or more roles.
- NestJS guards resolve the current user's effective permissions at request time by querying the database (with Redis caching).

See [RBAC Design](../rbac.md) for the full model and implementation.

## Alternatives Considered

| Alternative                                | Reason rejected                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------ |
| Hardcoded role enum in code                | Cannot adapt to new roles without a deployment                           |
| Attribute-Based Access Control (ABAC)      | Overly complex for current requirements; RBAC is sufficient              |
| Third-party IAM (e.g., Casbin, Auth0 RBAC) | Adds external dependency; simpler to own given the straightforward model |

## Consequences

**Positive:**

- System Administrator can create and configure roles and permissions at runtime.
- No deployment required to adjust access control.
- Clear audit trail when role/permission assignments change.
- Permission caching in Redis (5-minute TTL with immediate invalidation on change) keeps performance impact negligible.

**Negative:**

- Permissions must be seeded or documented so admins know what strings are valid.
- All new protected endpoints must be decorated with the correct permission string and tested; forgetting to do so leaves routes unprotected.
- Permission resolution adds one Redis/DB lookup per authenticated request (mitigated by caching).
