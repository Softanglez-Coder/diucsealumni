# Deployment Overview

## Environments

| Environment | Branch        | Base URL                       | Purpose                                                                  |
| ----------- | ------------- | ------------------------------ | ------------------------------------------------------------------------ |
| Local       | any           | `http://localhost:3000`        | Developer's own machine                                                  |
| Development | `development` | `https://dev.csediualumni.com` | Shared integration environment; always reflects the latest `development` |
| Production  | `main`        | `https://csediualumni.com`     | Live users; deployed on every merge to `main`                            |

## Contents

| Document                                            | Description                                          |
| --------------------------------------------------- | ---------------------------------------------------- |
| [Infrastructure](./infrastructure.md)               | Docker setup, CI/CD pipeline, hosting, backups       |
| [Environment Variables](./environment-variables.md) | Full reference of all required environment variables |

## Deployment Workflow Summary

```
┌─────────────────────────────────────────────────────┐
│  Developer pushes to a feature branch               │
│  → CI runs: lint / type-check / unit / integration  │
└───────────────────────┬─────────────────────────────┘
                        │ PR merged to development
┌───────────────────────▼─────────────────────────────┐
│  deploy-development.yml                             │
│  1. Build & push Docker images to GHCR              │
│  2. Deploy to development server                    │
│  3. Run prisma migrate deploy                       │
│  4. Smoke test dev.csediualumni.com                 │
│  5. Notify Slack #deployments                       │
└───────────────────────┬─────────────────────────────┘
                        │ PR merged to main
┌───────────────────────▼─────────────────────────────┐
│  deploy-production.yml                              │
│  1. Build & push Docker images (tagged vX.Y.Z)      │
│  2. Deploy to production server                     │
│  3. Run prisma migrate deploy                       │
│  4. Smoke test csediualumni.com                     │
│  5. Create GitHub Release (auto-generated notes)    │
│  6. Notify Slack #deployments                       │
└─────────────────────────────────────────────────────┘
```

Every deployment to production goes through the development environment first via the normal PR flow — `feature/*` → `development` → `main`.
