# Non-Functional Requirements

This document defines the quality attributes the CSE DIU Alumni platform must satisfy. These requirements are binding constraints that apply across all features.

---

## 1. Performance

| Metric                          | Target                               |
| ------------------------------- | ------------------------------------ |
| Time to First Byte (TTFB)       | < 200 ms (server-rendered pages)     |
| Largest Contentful Paint (LCP)  | < 2.5 s on a 4G connection           |
| API response time (p95)         | < 300 ms for read operations         |
| API response time (p95)         | < 800 ms for write operations        |
| Concurrent users (steady state) | 500 simultaneous without degradation |
| Database query time (p99)       | < 100 ms                             |

- Redis is used to cache frequently read data (alumni directory, event listings) with appropriate TTLs.
- Static assets are served via CDN with aggressive cache headers.
- Images are optimized at upload time (resizing, WebP conversion) via Sharp.

---

## 2. Scalability

- Stateless API servers allow horizontal scaling behind a load balancer.
- Database connection pooling via PgBouncer to prevent connection exhaustion under load.
- Background jobs (email sending, report generation, image processing) run in a separate worker process via BullMQ + Redis queues, keeping the API response path lean.
- File storage (S3) scales independently of compute.
- The monorepo structure allows independent deployment scaling of `web` and `api` services.

---

## 3. Security

- All traffic served over HTTPS (TLS 1.2+); HTTP redirects to HTTPS.
- Passwords hashed with bcrypt (cost factor ≥ 12).
- JWT secrets rotated on a defined schedule; compromised tokens can be blacklisted immediately.
- OAuth 2.0 scopes limited to minimum required (profile, email).
- Input validated and sanitized on the API layer (class-validator + class-transformer). No raw SQL; all queries via Prisma parameterized queries.
- Rate limiting on all public endpoints (express-rate-limit / NestJS ThrottlerModule).
- CSRF protection for state-mutating API calls.
- Security headers enforced: `Content-Security-Policy`, `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Referrer-Policy`.
- File uploads validated: MIME type, magic bytes, size limit, virus scanning via ClamAV or cloud-based equivalent.
- Dependency vulnerability scanning on every CI run (npm audit / Snyk).
- Sensitive fields (phone numbers, emails) encrypted at rest in the database.
- Audit log records all privileged actions (user management, role changes, content deletion).

---

## 4. SEO

- All public-facing pages server-side rendered (SSR) or statically generated (SSG) via Next.js.
- Every page has unique `<title>`, `<meta name="description">`, and Open Graph tags managed dynamically.
- Semantic HTML5 markup throughout.
- Structured data (JSON-LD) on profile pages, event pages, and news articles.
- `robots.txt` and `sitemap.xml` generated automatically and submitted to Google Search Console.
- Canonical URLs enforced to avoid duplicate content.
- Image `alt` attributes required on all user-facing images.
- Core Web Vitals (LCP, CLS, FID/INP) monitored and kept in the "Good" range.

---

## 5. Accessibility

- Conform to WCAG 2.1 Level AA.
- Full keyboard navigability.
- ARIA roles and labels on all interactive components.
- Sufficient color contrast ratios (4.5:1 for normal text, 3:1 for large text).
- Focus indicators visible at all times.
- Screen-reader tested with NVDA / VoiceOver.

---

## 6. Reliability & Availability

- Target uptime: **99.9%** (≤ 8.7 hours downtime per year).
- Automated health checks on API and database; failed checks trigger PagerDuty / email alerts.
- Daily PostgreSQL backups to S3 with 30-day retention and weekly restore tests.
- Graceful degradation: if a non-critical service (e.g., analytics, search index) is unavailable, core functionality remains operational.
- Maintenance mode toggle (admin-controlled) shows a friendly maintenance page without requiring a deployment.

---

## 7. Maintainability

- Codebase structured as a pnpm monorepo; each app and package has a single responsibility.
- All configuration externalized via environment variables (12-factor app).
- Database schema changes managed through Prisma migration files committed to version control.
- Code coverage targets (enforced in CI — PRs cannot merge if thresholds are not met):
  - Project-wide: **> 70%** lines, statements, functions, and branches.
  - `apps/api/src/modules/**`: ≥ 80% across all metrics.
  - `apps/web/src/hooks/**`: ≥ 75% lines/statements/functions, ≥ 70% branches.
  - `packages/**`: ≥ 80% lines/statements/functions, ≥ 75% branches.
- JSDoc / TSDoc comments on all public service methods and API controllers.
- Dependency updates automated via Renovate bot (weekly PRs).

---

## 8. Internationalisation & Localisation

- UI text stored in i18n resource files (next-intl or react-i18next) from day one, even if only Bengali and English are supported initially.
- Date and time displayed in the user's local timezone.
- Currency formatted per locale (BDT by default, USD for international donors).

---

## 9. Analytics & Observability

- Google Analytics 4 for frontend user behavior tracking.
- Server-side event tracking for conversion events (registration, donation, job application click).
- Structured logging (JSON) on the API layer (Winston / Pino) aggregated in a log management tool (e.g., Papertrail, Logtail).
- Application performance monitoring (APM) via Sentry or Datadog for error tracking and distributed tracing.
- Prometheus metrics endpoint + Grafana dashboards for infrastructure health.
