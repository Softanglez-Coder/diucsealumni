# ADR-0002: Use Next.js for the Frontend

**Status:** Accepted  
**Date:** 2026-02-19

---

## Context

The platform has two distinct frontend concerns:

1. **Public pages** (alumni profiles, events, news) that must be crawlable by search engines.
2. **Authenticated member portal and admin panel** where SEO is irrelevant.

A purely client-side React SPA would render public pages with JavaScript, making content invisible to most crawlers without additional SSR infrastructure. A fully server-rendered MPA would require re-architecting when rich interactivity is needed.

## Decision

Use **Next.js (App Router)** with TypeScript as the frontend framework.

- Public, SEO-critical pages use **Static Site Generation (SSG)** or **Server-Side Rendering (SSR)**.
- Authenticated, interactive pages use **Client-Side Rendering (CSR)** via React hooks.
- API routes in Next.js are **not** used for business logic; all data is fetched from the NestJS API.

## Consequences

**Positive:**

- Near-instant SEO coverage for public pages without a separate SSR proxy.
- Single framework handles both static marketing/content pages and the dynamic member app.
- Next.js Image component provides automatic WebP conversion and lazy loading.
- Large ecosystem, excellent Vercel/self-hosted deployment support.

**Negative:**

- App Router introduces complexity (server components, streaming) that the team must understand.
- Mixing SSR, SSG, and CSR requires deliberate decision-making per page — this must be documented per page in code comments.
