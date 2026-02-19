# Testing Strategy

All code that enters `development` must be covered by tests. This document defines what to test, how to test it, and what the targets are.

---

## Test Pyramid

```
         ┌──────────┐
         │   E2E    │  ← Few, slow, high confidence
         ├──────────┤
         │ Integration│ ← API endpoints, DB interactions
         ├──────────┤
         │   Unit   │  ← Many, fast, isolated
         └──────────┘
```

---

## Coverage Requirements

| Scope                              | Lines     | Statements | Functions | Branches  |
| ---------------------------------- | --------- | ---------- | --------- | --------- |
| Project-wide (all packages & apps) | **> 70%** | **> 70%**  | **> 70%** | **> 70%** |
| `apps/api/src/modules/**`          | ≥ 80%     | ≥ 80%      | ≥ 80%     | ≥ 80%     |
| `apps/web/src/hooks/**`            | ≥ 75%     | ≥ 75%      | ≥ 75%     | ≥ 70%     |
| `packages/**`                      | ≥ 80%     | ≥ 80%      | ≥ 80%     | ≥ 75%     |

CI enforces the project-wide thresholds — a PR **cannot be merged** if overall coverage drops below 70% on any metric.

---

## Unit Tests

**Tool:** [Vitest](https://vitest.dev/)  
**Location:** Co-located with the source file (`*.spec.ts`)  
**Coverage target:** ≥ 80% statement coverage on `apps/api/src/modules/**` (project-wide floor: > 70%)

### What to unit test

- Every service method with meaningful logic.
- Custom guards, pipes, interceptors, and decorators.
- Utility functions in `packages/types` and `packages/config`.
- React hooks in `apps/web/src/hooks`.

### What not to unit test

- Framework boilerplate (module wiring, simple controller delegation to service).
- Prisma schema definitions.

### Example (NestJS service)

```typescript
// events.service.spec.ts
describe('EventsService', () => {
  let service: EventsService;
  let prisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EventsService, { provide: PrismaService, useValue: mockDeep<PrismaClient>() }],
    }).compile();

    service = module.get(EventsService);
    prisma = module.get(PrismaService);
  });

  it('should throw NotFoundException when event does not exist', async () => {
    prisma.event.findUnique.mockResolvedValue(null);
    await expect(service.findById('non-existent-id')).rejects.toThrow(NotFoundException);
  });
});
```

---

## Integration Tests

**Tool:** Vitest + Supertest  
**Location:** `apps/api/test/` directory  
**Coverage target:** Every API endpoint has at least one happy-path and one failure-path test

Integration tests run against a **real test database** (a separate PostgreSQL database, reset before each suite via `prisma migrate reset`). Redis is mocked via `ioredis-mock`.

### What to integration test

- Full HTTP request → response cycle for every API controller.
- Authentication flows (login, token refresh, logout).
- RBAC enforcement (correct 403 responses for unauthorized roles).
- Pagination, filtering, and sorting on list endpoints.

### Running integration tests

```bash
pnpm test:e2e --filter=@csediualumni/api
```

The `DATABASE_URL` for the test environment points to a separate `csediualumni_test` database, configured in `apps/api/.env.test`.

---

## End-to-End Tests

**Tool:** [Playwright](https://playwright.dev/)  
**Location:** `apps/web/e2e/`

E2E tests run against a fully running stack (Next.js + NestJS + PostgreSQL + Redis) using a seeded test database.

### What to E2E test

- User registration and login (email + Google OAuth stub).
- Alumni profile creation and public visibility.
- Event RSVP flow.
- Admin approving a membership application.
- Job posting creation and listing.

### Running E2E tests

```bash
pnpm test:e2e --filter=@csediualumni/web
```

E2E tests are run in CI only on PRs targeting `development` and on every push to `main`, using a Docker Compose test environment.

---

## Test Data

- Unit tests use inline fixture objects (no database).
- Integration tests use factory functions in `apps/api/test/factories/` that create minimal valid entities via Prisma.
- E2E tests use a seeded database snapshot (reproduced by `pnpm db:seed --env=test`).
- **Never use production data in tests.**

---

## Continuous Integration

On every push and pull request, the CI pipeline runs:

```
lint → type-check → unit tests → integration tests → build
```

E2E tests run as a separate job that can run in parallel after the build succeeds.

A PR **cannot be merged** if any CI step fails.

---

## Test Coverage Reports

Coverage is generated with Vitest's built-in V8 provider:

```bash
pnpm test:cov
```

Reports are uploaded to [Codecov](https://codecov.io/) in CI. Coverage must not drop below the defined thresholds on a PR — the CI check will fail if it does.

### Vitest coverage configuration

Add the following `coverage` block to each workspace's `vitest.config.ts` to enforce thresholds locally and in CI:

```typescript
// vitest.config.ts (project root or per-app)
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      reportsDirectory: './coverage',
      // Files that must be included even if never imported by a test
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.module.ts', // NestJS module wiring
        'src/main.ts',
        'src/**/*.dto.ts',
        'src/**/*.entity.ts',
        '**/__mocks__/**',
        '**/*.spec.ts',
      ],
      thresholds: {
        lines: 70,
        statements: 70,
        functions: 70,
        branches: 70,
        // Stricter override for the API business logic
        'src/modules/**': {
          lines: 80,
          statements: 80,
          functions: 80,
          branches: 80,
        },
      },
    },
  },
});
```

Vitest will exit with a **non-zero code** when any threshold is not met, causing the CI step to fail automatically.

### Checking coverage locally

```bash
# Run unit tests with coverage for the API
pnpm test:cov --filter=@csediualumni/api

# Run unit tests with coverage for the web app
pnpm test:cov --filter=@csediualumni/web

# Run coverage across all packages at once
pnpm -r test:cov
```

Open `coverage/index.html` in a browser to view the full report.
