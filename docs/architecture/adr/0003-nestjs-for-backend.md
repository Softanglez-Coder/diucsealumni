# ADR-0003: Use NestJS for the Backend

**Status:** Accepted  
**Date:** 2026-02-19

---

## Context

The backend must serve a REST API, handle background job processing, enforce authentication and dynamic RBAC, and eventually support WebSocket connections (real-time notifications). The team is writing TypeScript end-to-end. The framework must impose enough structure to keep a growing codebase maintainable without being prescriptive about business logic.

## Decision

Use **NestJS** as the backend framework.

- Each feature domain is a NestJS **module** (e.g., `MembersModule`, `EventsModule`).
- Dependency injection is used throughout; services are never instantiated manually.
- Guards handle authentication (`JwtAuthGuard`) and authorization (`RbacGuard`).
- Interceptors handle response transformation, logging, and performance metrics.
- BullMQ is integrated via `@nestjs/bullmq` for background queues.

## Consequences

**Positive:**

- Opinionated module structure keeps features isolated and independently testable.
- Dependency injection makes unit testing straightforward (services can be mocked trivially).
- First-class TypeScript, excellent ecosystem (`@nestjs/*` packages for Prisma, BullMQ, JWT, Swagger, etc.).
- Built-in support for WebSockets (Socket.IO or native WS) for future real-time features.
- OpenAPI / Swagger documentation generated automatically from decorators.

**Negative:**

- Boilerplate is heavier than a minimal Express app — justified by the project's scale.
- Decorators and DI add a learning curve for developers from a functional or Rails background.
