# Code Standards

Consistent code style and standards are enforced automatically — do not rely on developers remembering them.

---

## Language

- **TypeScript** is used for every package: frontend, backend, and shared.
- `strict: true` is enabled in all `tsconfig.json` files. No `any` without an explicit `// eslint-disable-next-line` comment explaining why.
- `noImplicitReturns`, `noFallthroughCasesInSwitch`, and `noUncheckedIndexedAccess` are enabled.

---

## Linting

ESLint is configured via a shared `packages/config/eslint` preset and extended per app:

```bash
pnpm lint          # lint entire monorepo
pnpm lint --filter=@csediualumni/api   # lint only the API
```

Key rule sets:

- `@typescript-eslint/recommended-type-checked`
- `eslint-plugin-import` (enforce module import ordering)
- `eslint-plugin-unicorn` (modern JS practices)
- NestJS-specific rules via `eslint-plugin-nestjs` in `apps/api`
- React / Next.js rules via `eslint-plugin-react` and `eslint-config-next` in `apps/web`

Linting runs automatically on every commit via the `pre-commit` hook (lint-staged, staged files only) and on every CI run. PRs with lint errors will not be merged. See [Git Hooks](./git-hooks.md) for hook configuration.

---

## Formatting

[Prettier](https://prettier.io/) is the sole formatter. No manual formatting debates.

Configuration (in `packages/config/prettier`):

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "semi": true,
  "tabWidth": 2,
  "endOfLine": "lf"
}
```

Prettier runs automatically on staged files via the `pre-commit` hook (lint-staged) on every commit, and re-stages the formatted result so the committed version is always clean. To format manually:

```bash
pnpm format
```

See [Git Hooks](./git-hooks.md) for the lint-staged configuration.

---

## Naming Conventions

| Artifact               | Convention                                   | Example              |
| ---------------------- | -------------------------------------------- | -------------------- |
| Files (TS source)      | `kebab-case`                                 | `event-service.ts`   |
| Classes                | `PascalCase`                                 | `EventService`       |
| Interfaces / Types     | `PascalCase`, no `I` prefix                  | `CreateEventDto`     |
| Variables & functions  | `camelCase`                                  | `getActiveMembers`   |
| Database columns       | `snake_case` (in Prisma schema)              | `created_at`         |
| Environment variables  | `SCREAMING_SNAKE_CASE`                       | `DATABASE_URL`       |
| Constants              | `UPPER_SNAKE_CASE`                           | `MAX_UPLOAD_SIZE_MB` |
| React components       | `PascalCase`                                 | `MemberCard.tsx`     |
| CSS / Tailwind classes | utility-first, no custom CSS unless required | —                    |

---

## File & Folder Structure

### Backend (`apps/api`)

Follow NestJS conventions strictly:

```
src/
├── modules/
│   └── events/
│       ├── events.module.ts
│       ├── events.controller.ts
│       ├── events.service.ts
│       ├── events.repository.ts    # Prisma queries isolated here
│       ├── dto/
│       │   ├── create-event.dto.ts
│       │   └── update-event.dto.ts
│       └── events.controller.spec.ts
├── common/
│   ├── guards/
│   ├── decorators/
│   ├── interceptors/
│   ├── filters/
│   └── pipes/
├── prisma/
│   └── prisma.service.ts
└── main.ts
```

### Frontend (`apps/web`)

```
src/
├── app/                   # Next.js App Router pages
│   ├── (public)/          # Public route group
│   └── (member)/          # Auth-gated route group
├── components/
│   ├── ui/                # Primitive UI components
│   └── features/          # Feature-specific composed components
├── hooks/                 # Custom React hooks
├── lib/                   # API client, utility functions, constants
└── types/                 # Local type extensions (prefer packages/types)
```

---

## Documentation Comments

- All public **service methods** and **API controllers** must have a TSDoc comment explaining what the method does, its parameters, and its return value or thrown exceptions.
- Inline comments explain _why_, not _what_. If a comment is needed to explain what a line does, refactor the line first.

```typescript
/**
 * Approves a pending membership application and sends a confirmation email.
 *
 * @param applicationId - The ID of the MembershipApplication to approve.
 * @param adminId - The ID of the administrator performing the action.
 * @throws {NotFoundException} If the application does not exist.
 * @throws {ConflictException} If the application is not in PENDING status.
 */
async approveMembership(applicationId: string, adminId: string): Promise<Membership> { ... }
```

---

## Dependency Rules

- **Backend** must never import from `apps/web`. It may import from `packages/types` and `packages/config`.
- **Frontend** must never import from `apps/api`. It may import from `packages/ui`, `packages/types`, and `packages/config`.
- **Circular imports** between packages are forbidden. Turborepo's `check-cycles` task enforces this in CI.

---

## Security Coding Rules

- Never log or expose passwords, JWT secrets, API keys, or PII in logs or error responses.
- Always validate and sanitize all user-supplied input using `class-validator` DTOs before it reaches a service.
- Use Prisma parameterized queries exclusively — no string interpolation in queries.
- All file uploads must be validated for MIME type (check magic bytes, not just extension) and size before processing.
- External URLs (e.g., profile links) must be validated as safe URLs before storage; never rendered as raw HTML without sanitization.
