# Tech Stack

All technology choices are made to balance developer productivity, ecosystem maturity, long-term maintainability, and production suitability.

## Core Stack

| Layer                   | Technology                                                                                  | Version policy             |
| ----------------------- | ------------------------------------------------------------------------------------------- | -------------------------- |
| Frontend framework      | [Next.js](https://nextjs.org/) (React, TypeScript)                                          | Latest stable              |
| Backend framework       | [NestJS](https://nestjs.com/) (Node.js, TypeScript)                                         | Latest stable              |
| Language                | TypeScript                                                                                  | Strict mode, latest stable |
| Database                | PostgreSQL                                                                                  | 16+                        |
| Cache / Sessions        | Redis                                                                                       | 7+                         |
| ORM                     | [Prisma](https://www.prisma.io/)                                                            | Latest stable              |
| File storage            | AWS S3 (or MinIO for self-hosting)                                                          | —                          |
| Authentication          | Passport.js (`@nestjs/passport`, `passport-google-oauth20`, `passport-jwt`) + `@nestjs/jwt` | Latest stable              |
| Search                  | PostgreSQL full-text search; migrate to Elasticsearch when needed                           | —                          |
| Email                   | Nodemailer + SMTP / SendGrid                                                                | —                          |
| Background jobs         | [BullMQ](https://docs.bullmq.io/) (backed by Redis)                                         | —                          |
| Payment (local)         | [SSLCommerz](https://sslcommerz.com/)                                                       | —                          |
| Payment (international) | [Stripe](https://stripe.com/)                                                               | —                          |
| Image optimization      | [Sharp](https://sharp.pixelplumbing.com/)                                                   | —                          |
| Analytics               | Google Analytics 4 + server-side events                                                     | —                          |
| Error monitoring        | [Sentry](https://sentry.io/)                                                                | —                          |
| Logging                 | [Pino](https://getpino.io/) (structured JSON)                                               | —                          |

## Monorepo Tooling

| Tool                | Purpose                                   |
| ------------------- | ----------------------------------------- |
| pnpm workspaces     | Monorepo package management               |
| Turborepo           | Task orchestration and caching            |
| ESLint              | Static analysis (shared workspace config) |
| Prettier            | Code formatting                           |
| Husky + lint-staged | Pre-commit hooks                          |
| Commitlint          | Conventional commit enforcement           |
| Vitest              | Unit testing                              |
| Playwright          | End-to-end testing                        |

## Infrastructure & DevOps

| Tool                      | Purpose                        |
| ------------------------- | ------------------------------ |
| Docker + Docker Compose   | Containerization (dev & prod)  |
| Nginx                     | Reverse proxy, SSL termination |
| Let's Encrypt (Certbot)   | TLS certificates               |
| GitHub Actions            | CI/CD pipelines                |
| GitHub Container Registry | Docker image storage           |
| Renovate                  | Automated dependency updates   |

## Why TypeScript End-to-End?

Using TypeScript for both the Next.js frontend and NestJS backend allows shared type definitions and DTOs to live in the `packages/types` workspace. A type change in a backend DTO immediately surfaces as a compile error in the frontend — eliminating a whole category of integration bugs without additional effort.

## Why Prisma?

Prisma provides type-safe database access generated from the schema, first-class migration tooling, and excellent developer experience. The schema file serves as the single source of truth for the database model, making it easy to onboard new contributors.

## Why BullMQ for Background Jobs?

Email delivery, report generation, image processing, and notification fanout should never block an API response. BullMQ provides reliable, Redis-backed queues with retry, dead-letter, concurrency control, and a built-in dashboard (Bull Board) — without requiring an additional message broker.
