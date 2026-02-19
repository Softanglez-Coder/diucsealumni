# Infrastructure

## Containerization

All services are containerized. The repository provides:

- `docker-compose.yml` — local development services (PostgreSQL, Redis, MinIO)
- `docker-compose.prod.yml` — production-oriented composition reference
- `Dockerfile` per app (`apps/api/Dockerfile`, `apps/web/Dockerfile`)

### Production Dockerfiles

Both Dockerfiles use **multi-stage builds**:

1. **deps** stage — installs production dependencies.
2. **builder** stage — compiles TypeScript.
3. **runner** stage — minimal Node.js Alpine image with only production artifacts and `node_modules`.

This keeps production images lean (typically < 300 MB).

---

## CI/CD Pipeline (GitHub Actions)

Pipeline defined in `.github/workflows/`. Triggered on every push and pull request.

### `ci.yml` — runs on every push/PR

```
Jobs (run in parallel where possible):
  lint-and-typecheck
  unit-tests
  integration-tests      ← spins up Postgres & Redis as service containers
  build                  ← depends on lint and tests passing
```

### `deploy-development.yml` — runs on merge to `development`

```
1. Build Docker images (`web`, `api`) tagged with short commit SHA
2. Push to GitHub Container Registry (ghcr.io)
3. SSH into development server
4. Pull new images
5. Run `docker compose pull && docker compose up -d`
6. Run `prisma migrate deploy` (zero-downtime migration)
7. Run smoke tests against dev.csediualumni.com
8. Notify Slack #deployments channel
```

### `deploy-production.yml` — runs on merge to `main`

```
1. Derive version from root package.json (e.g. v1.2.0)
2. Build Docker images tagged with version + commit SHA
3. Push to GitHub Container Registry (ghcr.io)
4. SSH into production server
5. Pull new images
6. Run `docker compose pull && docker compose up -d` (rolling restart)
7. Run `prisma migrate deploy`
8. Run smoke tests against csediualumni.com
9. Create GitHub Release:
   - Tag: vX.Y.Z (created automatically on main HEAD)
   - Title: vX.Y.Z
   - Release notes: auto-generated from merged PR titles since last release
     (using `actions/github-script` or `softprops/action-gh-release`)
   - Attach build artifacts (Docker image digests, CHANGELOG excerpt)
10. Notify Slack #deployments channel
```

All secrets (SSH keys, registry tokens, Slack webhook) are stored in GitHub Actions Secrets — never in the repository.

---

## Domain & DNS

| Concern          | Provider                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------- |
| Domain registrar | [Namecheap](https://www.namecheap.com/) — `csediualumni.com`                                   |
| DNS management   | [Cloudflare](https://www.cloudflare.com/) (nameservers delegated from Namecheap to Cloudflare) |

**Nameserver delegation:** Namecheap's custom nameservers are set to Cloudflare's assigned NS pair (e.g., `aria.ns.cloudflare.com`, `bob.ns.cloudflare.com`). All DNS records (A, CNAME, MX, TXT) are managed exclusively in the Cloudflare dashboard.

### DNS Records

| Name                   | Type  | Value                    | Proxy                     |
| ---------------------- | ----- | ------------------------ | ------------------------- |
| `csediualumni.com`     | A     | Production server IP     | ✅ Proxied (orange cloud) |
| `dev.csediualumni.com` | A     | Development server IP    | ✅ Proxied                |
| `www`                  | CNAME | `csediualumni.com`       | ✅ Proxied                |
| `_dmarc`               | TXT   | DMARC policy             | DNS only                  |
| `@`                    | MX    | Mail provider MX records | DNS only                  |

---

## Hosting

| Component                          | Hosting target                                                         |
| ---------------------------------- | ---------------------------------------------------------------------- |
| API + Web                          | VPS (e.g., DigitalOcean Droplet or AWS EC2, Ubuntu 22.04 LTS)          |
| Reverse proxy                      | Nginx                                                                  |
| TLS — edge (browser → Cloudflare)  | Cloudflare Universal SSL (automatic, free)                             |
| TLS — origin (Cloudflare → server) | Cloudflare Origin Certificate installed on Nginx                       |
| Database                           | PostgreSQL on the same server (or managed: RDS / Supabase for scaling) |
| Redis                              | Same server (or managed: Upstash / ElastiCache for scaling)            |
| File storage                       | AWS S3 (or MinIO on VPS for cost-sensitive phases)                     |
| Container registry                 | GitHub Container Registry (ghcr.io)                                    |

### Cloudflare Configuration

- **SSL/TLS mode:** `Full (strict)` — Cloudflare encrypts traffic to the origin and validates the origin certificate. Never use `Flexible` (terminates TLS at Cloudflare only, plain HTTP to origin).
- **Origin Certificate:** Issue a Cloudflare Origin Certificate (15-year validity) from the Cloudflare dashboard → SSL/TLS → Origin Server. Install it in Nginx as the certificate/key pair.
- **Always Use HTTPS:** Enabled — redirects any HTTP request to HTTPS at the Cloudflare edge.
- **HSTS:** Enabled via Cloudflare Edge Certificate settings (max-age 1 year, include subdomains).
- **Minimum TLS Version:** TLS 1.2.
- **Automatic HTTPS Rewrites:** Enabled.
- **DDoS Protection:** Enabled by default (Cloudflare Magic Transit / L7 DDoS protection at the edge — no origin exposure).
- **Caching:** Static assets (JS, CSS, images, fonts) cached at Cloudflare edge. Cloudflare Page Rules or Cache Rules set `Cache-Control` bypass for `/api/*` paths.
- **Firewall Rules:** Block requests to `/api/*` that are not from legitimate user agents; rate-limit login endpoints at the edge as a first layer (NestJS ThrottlerModule is the second layer).
- **Bot Fight Mode:** Enabled.

### Nginx Configuration (key points)

- Listens on port **443** with the Cloudflare Origin Certificate.
- Port 80 listener redirects to 443 (belt-and-suspenders; Cloudflare already enforces HTTPS).
- **Restrict access to Cloudflare IPs only** — block direct origin access that bypasses Cloudflare:
  ```nginx
  # Allow only Cloudflare IP ranges (keep updated via https://www.cloudflare.com/ips/)
  allow 103.21.244.0/22;
  allow 103.22.200.0/22;
  # ... full list in nginx/cloudflare-ips.conf
  deny all;
  ```
- `upstream api` block proxies `/api/` to the NestJS container.
- All other requests proxied to the Next.js container.
- `gzip on` with appropriate MIME types (Cloudflare also applies gzip/Brotli at the edge).
- `proxy_read_timeout 60s` — covers long-running API operations.
- `proxy_set_header CF-Connecting-IP $http_cf_connecting_ip;` — forward the real client IP (Cloudflare replaces the connecting IP; use `CF-Connecting-IP` header for IP-based rate limiting and audit logs).

---

## Database Backups

| Backup type              | Frequency         | Retention | Storage                                                   |
| ------------------------ | ----------------- | --------- | --------------------------------------------------------- |
| Full PostgreSQL dump     | Daily (02:00 UTC) | 30 days   | AWS S3 (versioned bucket)                                 |
| WAL archiving (optional) | Continuous        | 7 days    | AWS S3                                                    |
| Restore test             | Weekly (Sunday)   | —         | CI job restores to a temp database and runs a smoke query |

Backup script uses `pg_dump --format=custom` (compressed, parallel-restore compatible) and uploads via `aws s3 cp`.

Alerts are sent to the operations email if a backup job fails.

---

## Monitoring & Alerting

| Concern                           | Tool                                            |
| --------------------------------- | ----------------------------------------------- |
| Error tracking & performance      | Sentry (both frontend and backend)              |
| Structured logs                   | Pino → log aggregator (Logtail / Papertrail)    |
| Uptime monitoring                 | Better Uptime or UptimeRobot (ping every 1 min) |
| Infrastructure metrics (optional) | Prometheus + Grafana                            |
| Deployment notifications          | Slack #deployments                              |
| Backup failure alerts             | Email to ops team                               |

On-call escalation: if uptime monitoring detects a failure for > 3 consecutive checks, an email + SMS alert is sent to the on-call engineer.

---

## Secrets Management

- All secrets are stored in **GitHub Actions Secrets** (for CI) and in **`.env` files on the server** (managed manually by ops, never committed to git).
- Rotate JWT secrets, OAuth client secrets, and database passwords on a regular schedule (quarterly minimum) or immediately after any suspected exposure.
- The `.env.example` files in the repository list every required variable with a placeholder value and description — no real values.
