# ADR-0001: Use pnpm Workspaces Monorepo

**Status:** Accepted  
**Date:** 2026-02-19

---

## Context

The project has at least two deployable applications (`web` and `api`) that share TypeScript types, UI components, and configuration (ESLint, Prettier, TSConfig). Without a shared structure, these would be duplicated or versioned separately, increasing maintenance burden and risk of API contract drift.

## Decision

Adopt a **pnpm workspaces monorepo** managed with **Turborepo** for task orchestration and remote caching.

```
/
├── apps/
│   ├── web/     # Next.js frontend
│   └── api/     # NestJS backend
├── packages/
│   ├── ui/      # Shared React components
│   ├── types/   # Shared TypeScript types / Zod schemas / Prisma DTOs
│   └── config/  # Shared ESLint, Prettier, TSConfig presets
├── turbo.json
└── pnpm-workspace.yaml
```

## Consequences

**Positive:**

- Single repository, single CI pipeline, atomic commits across frontend and backend.
- Shared types eliminate API contract drift; type errors surface at compile time.
- Turborepo caches task output — `build`, `lint`, and `test` only re-run for changed packages.
- New packages can be added without changing the CI workflow.

**Negative:**

- Developers unfamiliar with monorepos need a brief onboarding.
- `pnpm` must be used consistently; mixing with `npm` or `yarn` can corrupt the lockfile.
