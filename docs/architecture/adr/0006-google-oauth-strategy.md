# ADR-0006: Backend-Driven Google OAuth via Passport.js

**Status:** Accepted  
**Date:** 2026-02-19

---

## Context

The platform needs social login, specifically **Sign in with Google**. The project has a decoupled architecture: a Next.js frontend and a NestJS backend. There are two main strategies for implementing OAuth in this setup:

**Option A — Frontend-driven OAuth (e.g., NextAuth.js on Next.js)**  
NextAuth.js handles the Google OAuth dance entirely on the Next.js server. After Google authenticates the user, NextAuth issues a session cookie. The NestJS API must then accept and validate NextAuth session tokens, which requires either a shared secret or a JWKS endpoint.

**Option B — Backend-driven OAuth (Passport.js on NestJS)**  
The NestJS API implements the Google OAuth flow using `@nestjs/passport` + `passport-google-oauth20`. The frontend simply redirects to an API endpoint to start the flow. After Google authenticates the user, the API issues its own JWT pair. The frontend stores the access token in memory and the refresh token is delivered as an HttpOnly cookie.

---

## Decision

Adopt **Option B: backend-driven OAuth via Passport.js on NestJS**.

All authentication logic — email/password, Google OAuth, token issuance, rotation, and revocation — lives exclusively in `apps/api`. The Next.js frontend does not manage authentication state beyond storing the in-memory access token.

---

## Rationale

| Criterion                                        | Option A (NextAuth)                         | Option B (Passport.js) ✅      |
| ------------------------------------------------ | ------------------------------------------- | ------------------------------ |
| Single auth authority                            | ✗ Split between Next.js and NestJS          | ✓ NestJS only                  |
| Token contract                                   | NextAuth session + NestJS JWT (two systems) | One JWT contract               |
| Works with non-browser clients (mobile app, CLI) | ✗ Tied to Next.js                           | ✓ Pure HTTP                    |
| Complexity                                       | Higher (two auth systems to maintain)       | Lower                          |
| Testability                                      | Requires testing two auth layers            | One auth module to test        |
| Future providers (LinkedIn, GitHub)              | Requires NextAuth config + API config       | One place: Passport strategies |

NextAuth.js is an excellent choice when a project uses Next.js as a full-stack framework with no separate API. In this project, the NestJS API is the authoritative backend; delegating auth to the frontend layer would create redundancy and tight coupling.

---

## Consequences

**Positive:**

- One canonical auth system; any client (web, future mobile app) uses the same endpoints.
- Refresh token rotation and revocation are fully controlled by the API, with database-backed token records.
- Adding a new OAuth provider (LinkedIn, GitHub) requires only a new Passport strategy — no frontend changes.
- No `NEXTAUTH_SECRET` or `NEXTAUTH_URL` required in the web environment.

**Negative:**

- The post-OAuth redirect passes the access token as a URL query parameter for one navigation. This is mitigated by immediately removing it from the URL after reading it (see [Authentication Architecture](../authentication.md) for details).
- Developers must understand the Passport.js strategy pattern; it has a non-trivial setup compared to NextAuth's configuration object.

---

## Libraries

| Package                   | Purpose                            |
| ------------------------- | ---------------------------------- |
| `@nestjs/passport`        | NestJS Passport.js integration     |
| `passport`                | Core Passport.js                   |
| `passport-google-oauth20` | Google OAuth 2.0 Passport strategy |
| `passport-jwt`            | JWT Bearer token Passport strategy |
| `@nestjs/jwt`             | JWT signing and verification       |

See [Authentication Architecture](../authentication.md) for the complete flow, database schema, and security considerations.
