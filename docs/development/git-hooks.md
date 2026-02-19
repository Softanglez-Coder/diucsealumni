# Git Hooks

Git hooks enforce code quality **before code ever reaches the remote repository**. The project uses [Husky](https://typicode.github.io/husky/) to manage hooks declaratively in the repository, so every developer gets them automatically on `pnpm install`.

There are two enforcement layers:

| Layer                             | Trigger                                               | What it catches                                                          |
| --------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| **Local Git hooks** (Husky)       | Every `git commit` and `git push`                     | Formatting, lint, type errors, broken tests — on the developer's machine |
| **GitHub branch protection + CI** | Every push / pull request to `development` and `main` | Same checks, but server-side — cannot be bypassed                        |

Both layers are required. Local hooks give fast feedback; CI is the authoritative gate.

---

## Hook Overview

| Hook         | Runs on      | Checks                                                             |
| ------------ | ------------ | ------------------------------------------------------------------ |
| `pre-commit` | `git commit` | Prettier (format staged files), ESLint (lint staged files)         |
| `commit-msg` | `git commit` | Commitlint (validates commit message against Conventional Commits) |
| `pre-push`   | `git push`   | TypeScript type-check across all packages, unit tests              |

---

## Installation

Husky installs itself automatically when dependencies are installed because of the `prepare` lifecycle script in the root `package.json`:

```json
// package.json (root)
{
  "scripts": {
    "prepare": "husky"
  }
}
```

Running `pnpm install` for the first time will:

1. Install all npm packages.
2. Trigger `prepare`, which runs `husky` and activates the hooks defined in `.husky/`.

No manual setup is required. If you ever need to reinstall the hooks manually:

```bash
pnpm husky
```

---

## Hook Files

All hook files live in `.husky/` at the monorepo root and are committed to the repository.

### `.husky/pre-commit`

Runs **lint-staged**, which applies Prettier and ESLint only to the files that are staged for the current commit (not the entire codebase — fast).

```sh
pnpm lint-staged
```

### `.husky/commit-msg`

Runs **commitlint** against the commit message to enforce the [Conventional Commits](https://www.conventionalcommits.org/) format.

```sh
pnpm commitlint --edit "$1"
```

### `.husky/pre-push`

Runs a **TypeScript type-check** and **unit tests** across all packages before the push reaches the remote. This catches type errors and test regressions before a CI run is triggered.

```sh
pnpm typecheck && pnpm test
```

> If you are pushing a work-in-progress branch and intentionally want to skip the pre-push hook (e.g., to save a draft remotely), use `git push --no-verify`. This is only acceptable for personal branches — **never** for PRs targeting `development` or `main`.

---

## lint-staged Configuration

`lint-staged.config.mjs` at the monorepo root:

```js
export default {
  // TypeScript and JavaScript source files
  '**/*.{ts,tsx,js,jsx,mjs,cjs}': ['prettier --write', 'eslint --fix --max-warnings=0'],

  // JSON, Markdown, YAML, CSS files — format only
  '**/*.{json,md,yaml,yml,css}': ['prettier --write'],
};
```

**Key points:**

- `--max-warnings=0` means ESLint warnings are treated as errors in the hook. If a rule flags something, the commit is blocked until it is fixed (or the rule is explicitly disabled with a comment).
- `prettier --write` modifies the file in place. lint-staged automatically re-stages the formatted file so the commit contains the clean version.
- Only staged files are processed — a change to `apps/api` will not trigger ESLint on `apps/web`.

---

## commitlint Configuration

`commitlint.config.mjs` at the monorepo root:

```js
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Scope is optional but recommended
    'scope-case': [2, 'always', 'kebab-case'],

    // Subject must not be capitalized and must not end with a period
    'subject-case': [2, 'always', ['lower-case', 'sentence-case']],
    'subject-full-stop': [2, 'never', '.'],

    // Body lines max length
    'body-max-line-length': [2, 'always', 120],

    // Allowed types — must match the list in git-workflow.md
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'chore', 'ci', 'revert'],
    ],
  },
};
```

A commit message that fails commitlint will be **rejected immediately** with a clear error:

```
✖   subject may not be empty [subject-empty]
✖   type must be one of [feat, fix, docs, ...] [type-enum]
```

---

## Required Packages

These are already included in the root `package.json` `devDependencies`. Listed here for reference:

```json
{
  "devDependencies": {
    "husky": "^9.x",
    "lint-staged": "^15.x",
    "@commitlint/cli": "^19.x",
    "@commitlint/config-conventional": "^19.x"
  }
}
```

---

## Bypassing Hooks (When Is It Acceptable?)

| Scenario                                                     | Allowed?                                              | How                                                                      |
| ------------------------------------------------------------ | ----------------------------------------------------- | ------------------------------------------------------------------------ |
| Saving a WIP branch to remote before it's ready              | `pre-push` only, personal branch                      | `git push --no-verify`                                                   |
| Emergency hotfix under time pressure                         | **No** — run the hooks, they are fast                 | —                                                                        |
| Auto-generated commits (e.g., Renovate bot, release scripts) | Yes — CI bot commits bypass local hooks by definition | Managed by CI, not Husky                                                 |
| Skipping `pre-commit` permanently                            | **Never**                                             | Setting `HUSKY=0` disables all hooks — do not add this to shell profiles |

---

## GitHub Branch Protection Rules

Local hooks prevent bad code from being committed, but GitHub branch protection rules **prevent bad code from being merged** — even if hooks were bypassed or a developer pushes directly from a machine that doesn't have Husky installed.

### Protected Branches

Configure these rules in **GitHub → Repository → Settings → Branches** for both `main` and `development`:

#### `main` (production)

| Rule                                                             | Setting                                                          |
| ---------------------------------------------------------------- | ---------------------------------------------------------------- |
| Require a pull request before merging                            | ✅ Enabled                                                       |
| Required approvals                                               | **2**                                                            |
| Dismiss stale pull request approvals when new commits are pushed | ✅ Enabled                                                       |
| Require review from Code Owners                                  | ✅ Enabled (if `CODEOWNERS` file is present)                     |
| Require status checks to pass before merging                     | ✅ Enabled                                                       |
| Required status checks                                           | `lint-and-typecheck`, `unit-tests`, `integration-tests`, `build` |
| Require branches to be up to date before merging                 | ✅ Enabled                                                       |
| Require conversation resolution before merging                   | ✅ Enabled                                                       |
| Require linear history                                           | ✅ Enabled (enforces squash or rebase merge only)                |
| Do not allow bypassing the above settings                        | ✅ Enabled (applies to admins too)                               |
| Restrict who can push to matching branches                       | ✅ Enabled — CI bot only (no direct pushes)                      |

#### `development` (integration)

Same as `main` with one difference:

| Rule               | Setting |
| ------------------ | ------- |
| Required approvals | **1**   |

### Required Status Checks (CI Job Names)

These correspond to the job names defined in `.github/workflows/ci.yml`:

```
lint-and-typecheck
unit-tests
integration-tests
build
```

A PR cannot be merged unless all four checks report green. Cloudflare Pages / deployment preview checks (if used) can be added as optional status checks.

### CODEOWNERS

Create `.github/CODEOWNERS` to require review from domain experts on specific paths:

```
# Global — all changes require a review from a core maintainer
*                           @org/maintainers

# Backend — API changes require a backend owner review
/apps/api/                  @org/backend-team

# Frontend — UI changes require a frontend owner review
/apps/web/                  @org/frontend-team

# Infrastructure / deployment — require DevOps review
/.github/                   @org/devops
/docker-compose*.yml        @org/devops

# Database schema — require a senior review on every migration
/apps/api/prisma/           @org/backend-team @org/maintainers
```

### Rulesets (GitHub Enterprise / modern repos)

If using **GitHub Rulesets** (the modern replacement for branch protection rules), create two rulesets targeting `refs/heads/main` and `refs/heads/development` with equivalent settings. Rulesets can also be applied across the entire organization.

---

## Summary: What Gets Blocked and Where

| Bad code                            | Blocked by                                        |
| ----------------------------------- | ------------------------------------------------- |
| Unformatted file                    | `pre-commit` (lint-staged + Prettier)             |
| ESLint violation                    | `pre-commit` (lint-staged + ESLint)               |
| Invalid commit message              | `commit-msg` (commitlint)                         |
| TypeScript type error               | `pre-push` (tsc) + CI (`lint-and-typecheck` job)  |
| Failing unit test                   | `pre-push` (vitest) + CI (`unit-tests` job)       |
| Failing integration test            | CI (`integration-tests` job)                      |
| Unreviewed PR                       | GitHub branch protection (required approvals)     |
| PR with failing CI                  | GitHub branch protection (required status checks) |
| Direct push to `main`/`development` | GitHub branch protection (restrict pushes)        |
