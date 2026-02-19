# Getting Started

This guide sets up the full local development environment for the CSE DIU Alumni platform.

## Prerequisites

| Tool                    | Version         | Install                               |
| ----------------------- | --------------- | ------------------------------------- |
| Node.js                 | 20 LTS (≥ 20.x) | [nodejs.org](https://nodejs.org/)     |
| pnpm                    | ≥ 9.x           | `npm install -g pnpm`                 |
| Docker & Docker Compose | Latest stable   | [docker.com](https://www.docker.com/) |
| Git                     | ≥ 2.40          | [git-scm.com](https://git-scm.com/)   |

---

## 1. Clone the Repository

```bash
git clone https://github.com/<org>/csediualumni.git
cd csediualumni
```

---

## 2. Configure Environment Variables

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

Open each `.env` file and fill in the required values. Refer to [Environment Variables](../deployment/environment-variables.md) for a full reference.

> **Never commit `.env` files.** They are in `.gitignore`.

---

## 3. Start Dependent Services

```bash
docker compose up -d
```

This starts:

- **PostgreSQL** on `localhost:5432`
- **Redis** on `localhost:6379`
- **MinIO** (S3-compatible) on `localhost:9000` (console at `localhost:9001`)

Verify they are running:

```bash
docker compose ps
```

---

## 4. Install Dependencies

```bash
pnpm install
```

This installs all workspace dependencies (frontend, backend, shared packages) in a single command.

> **Git hooks are activated automatically.** The `prepare` lifecycle script runs `husky` after install, which registers the `pre-commit`, `commit-msg`, and `pre-push` hooks defined in `.husky/`. See [Git Hooks](./git-hooks.md) for details on what each hook enforces.

---

## 5. Set Up the Database

Apply all Prisma migrations and seed reference data:

```bash
pnpm db:migrate    # applies migrations
pnpm db:seed       # seeds roles, permissions, and a Super Admin account
```

The seed script prints the Super Admin credentials to stdout on first run. **Change the password immediately** after first login.

To open Prisma Studio (visual DB browser):

```bash
pnpm db:studio
```

---

## 6. Start Development Servers

```bash
pnpm dev
```

Turborepo starts all apps in parallel:

| App              | URL                              |
| ---------------- | -------------------------------- |
| Next.js frontend | `http://localhost:3000`          |
| NestJS API       | `http://localhost:4000`          |
| API Swagger docs | `http://localhost:4000/api/docs` |
| MinIO console    | `http://localhost:9001`          |

---

## 7. Run Tests

```bash
pnpm test          # run all unit tests
pnpm test:e2e      # run end-to-end tests (requires running services)
pnpm test:cov      # generate coverage report
```

---

## Useful Scripts

| Script            | Description                                                |
| ----------------- | ---------------------------------------------------------- |
| `pnpm dev`        | Start all apps in development mode                         |
| `pnpm build`      | Build all apps for production                              |
| `pnpm lint`       | Lint all workspaces                                        |
| `pnpm format`     | Format all workspaces with Prettier                        |
| `pnpm db:migrate` | Apply pending Prisma migrations                            |
| `pnpm db:seed`    | Seed reference data                                        |
| `pnpm db:studio`  | Open Prisma Studio                                         |
| `pnpm db:reset`   | Drop and recreate the database, re-run migrations and seed |

---

## Troubleshooting

**Port conflicts:** Ensure ports `3000`, `4000`, `5432`, `6379`, `9000`, and `9001` are free before running `docker compose up`.

**`pnpm install` fails:** Make sure you are using Node.js 20+. Run `node --version` to confirm.

**Prisma migration error:** If the database is out of sync, run `pnpm db:reset` (destroys local data) to start fresh.
