# Git Workflow

This project follows a **Gitflow-inspired branching strategy** adapted for continuous delivery.

---

## Branch Structure

| Branch        | Purpose                                                 | Direct push          |
| ------------- | ------------------------------------------------------- | -------------------- |
| `main`        | Production-ready code. Every commit is deployable.      | **Prohibited**       |
| `development` | Integration branch. All feature work merges here first. | **Prohibited**       |
| `feature/*`   | New features                                            | Allowed (own branch) |
| `fix/*`       | Bug fixes for issues on `development`                   | Allowed              |
| `hotfix/*`    | Urgent fixes for production bugs, branched from `main`  | Allowed              |
| `chore/*`     | Dependency updates, tooling changes, no business logic  | Allowed              |
| `docs/*`      | Documentation-only changes                              | Allowed              |

`main` and `development` are **protected branches**: direct pushes are blocked by GitHub branch protection rules. All changes go through a Pull Request.

---

## Standard Feature Flow

```
development
  │
  ├─── git checkout -b feature/job-board
  │       │
  │       │  (implement, commit)
  │       │
  │       └─── Pull Request → development
  │                 │
  │             CI passes + 1 review approval
  │                 │
  └─────────── Merge (squash or merge commit)
```

### 1. Create a branch

```bash
git checkout development
git pull origin development
git checkout -b feature/<short-description>
# example: git checkout -b feature/job-board
```

### 2. Develop and commit

Follow [Code Standards](./code-standards.md). Commit frequently with conventional commit messages:

```bash
git add .
git commit -m "feat(jobs): add job posting creation endpoint"
```

### 3. Keep your branch up to date

```bash
git fetch origin
git rebase origin/development
```

Rebase (not merge) to keep history linear.

### 4. Open a Pull Request

- Base branch: `development`
- Title: mirrors the primary commit message (`feat(jobs): add job board module`)
- Fill in the PR template (linked issue, description, testing notes, screenshots if UI change)
- Assign at least one reviewer

### 5. Address review feedback

Push additional commits. Do **not** force-push after a review has started; add fixup commits instead.

### 6. Merge

Once CI passes and the required review approvals are obtained, the PR author merges (squash merge preferred for features to keep `development` history clean).

---

## Hotfix Flow

A hotfix addresses a critical production bug and must bypass `development`.

```bash
git checkout main
git pull origin main
git checkout -b hotfix/fix-payment-callback

# make the fix
git commit -m "fix(payment): handle SSLCommerz IPN timeout correctly"

# open PR against main
# after merge, also back-merge into development:
git checkout development
git merge main
git push origin development
```

---

## Commit Message Convention

Follows [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <short summary>

[optional body]

[optional footer: BREAKING CHANGE or Closes #issue]
```

### Types

| Type       | Use                                |
| ---------- | ---------------------------------- |
| `feat`     | New feature                        |
| `fix`      | Bug fix                            |
| `docs`     | Documentation only                 |
| `style`    | Formatting (no logic change)       |
| `refactor` | Code change with no feature or fix |
| `perf`     | Performance improvement            |
| `test`     | Adding or updating tests           |
| `chore`    | Build process, dependency, tooling |
| `ci`       | CI/CD configuration                |
| `revert`   | Reverting a previous commit        |

### Examples

```
feat(auth): add Google OAuth login
fix(events): correct RSVP count on soft-deleted attendees
docs(rbac): document permission naming convention
chore(deps): upgrade Prisma to 6.3.0
```

Commitlint enforces this format on every commit via a Husky `commit-msg` hook. See [Git Hooks](./git-hooks.md) for the full hook and commitlint configuration.

---

## Pull Request Checklist

Before marking a PR as ready for review, confirm:

- [ ] Branch is rebased on the latest `development` (or `main` for hotfixes)
- [ ] All CI checks pass (lint, type-check, tests)
- [ ] New code has corresponding unit tests
- [ ] Swagger/OpenAPI docs updated if endpoints changed
- [ ] Prisma migration included if schema changed, and migration file is committed
- [ ] `.env.example` updated if new environment variables were added
- [ ] No hardcoded secrets, credentials, or production URLs

---

## Release Process

### Automatic (recommended)

Merging a PR into `main` automatically triggers the production deployment pipeline, which:

1. Builds and deploys the release.
2. Creates a **GitHub Release** tagged `vX.Y.Z` with auto-generated release notes compiled from merged PR titles since the last release.

The version number is read from the root `package.json`. Bump it in the `development → main` PR **before merging**:

```bash
# In your release PR branch:
# Bump version (choose major / minor / patch)
pnpm version minor --no-git-tag-version   # e.g. 1.2.0 → 1.3.0
git add package.json apps/*/package.json packages/*/package.json
git commit -m "chore(release): bump version to 1.3.0"
```

Update `CHANGELOG.md` (generated automatically):

```bash
pnpm changelog   # runs conventional-changelog-cli, appends to CHANGELOG.md
git add CHANGELOG.md
git commit -m "docs(changelog): update for v1.3.0"
```

Open the PR from `development` → `main`. After CI passes and the required approvals are obtained, merge — the rest is automated.

### Three-environment promotion path

```
feature/... ──▶ development ──▶ main
                     │              │
            dev.csediualumni.com   csediualumni.com
              (auto-deploy)         (auto-deploy +
                                    GitHub Release)
```

- **Local** — your machine, any branch.
- **Development** (`development`) — `dev.csediualumni.com`, updated on every merge to `development`.
- **Production** (`main`) — `csediualumni.com`, updated on every merge to `main`; a GitHub Release is created automatically.
