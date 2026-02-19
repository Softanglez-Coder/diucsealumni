# Environment Variables Reference

All environment variables are defined in `.env` files that are **never committed to version control**. Copy `.env.example` from each app directory to get started:

```bash
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
```

---

## API (`apps/api/.env`)

### Application

| Variable      | Required | Description                                 | Example                                 |
| ------------- | -------- | ------------------------------------------- | --------------------------------------- |
| `NODE_ENV`    | Yes      | Runtime environment                         | `development` \| `production` \| `test` |
| `PORT`        | No       | HTTP port the API listens on                | `4000`                                  |
| `API_PREFIX`  | No       | Global route prefix                         | `api/v1`                                |
| `CORS_ORIGIN` | Yes      | Allowed frontend origin(s), comma-separated | `http://localhost:3000`                 |

### Authentication

| Variable                 | Required | Description                                      | Example |
| ------------------------ | -------- | ------------------------------------------------ | ------- |
| `JWT_SECRET`             | Yes      | Secret for signing access tokens (min 64 chars)  | —       |
| `JWT_ACCESS_EXPIRES_IN`  | No       | Access token TTL                                 | `15m`   |
| `JWT_REFRESH_SECRET`     | Yes      | Secret for signing refresh tokens (min 64 chars) | —       |
| `JWT_REFRESH_EXPIRES_IN` | No       | Refresh token TTL                                | `7d`    |

### OAuth 2.0 — Google Sign-In

> Google OAuth is handled entirely by the NestJS API via Passport.js. See [Authentication Architecture](../../architecture/authentication.md) for setup instructions including the Google Cloud Console configuration.

| Variable               | Required | Description                                               | Example                                                |
| ---------------------- | -------- | --------------------------------------------------------- | ------------------------------------------------------ |
| `GOOGLE_CLIENT_ID`     | Yes      | Google OAuth 2.0 client ID                                | `123456789-abc.apps.googleusercontent.com`             |
| `GOOGLE_CLIENT_SECRET` | Yes      | Google OAuth 2.0 client secret                            | —                                                      |
| `GOOGLE_CALLBACK_URL`  | Yes      | Registered redirect URI (must match Google Cloud Console) | `https://csediualumni.com/api/v1/auth/google/callback` |
| `FRONTEND_URL`         | Yes      | Base URL of the Next.js app; used for post-OAuth redirect | `https://csediualumni.com`                             |

### OAuth 2.0 — LinkedIn (Planned)

| Variable                 | Required | Description                                              |
| ------------------------ | -------- | -------------------------------------------------------- |
| `LINKEDIN_CLIENT_ID`     | Yes\*    | LinkedIn OAuth app client ID                             |
| `LINKEDIN_CLIENT_SECRET` | Yes\*    | LinkedIn OAuth app client secret                         |
| `LINKEDIN_CALLBACK_URL`  | Yes\*    | `https://csediualumni.com/api/v1/auth/linkedin/callback` |

\* Required when LinkedIn Sign-In is enabled.

### Database

| Variable            | Required  | Description                                  | Example                                                                 |
| ------------------- | --------- | -------------------------------------------- | ----------------------------------------------------------------------- |
| `DATABASE_URL`      | Yes       | PostgreSQL connection string (Prisma format) | `postgresql://user:pass@localhost:5432/csediualumni?schema=public`      |
| `DATABASE_URL_TEST` | Test only | Separate database used in integration tests  | `postgresql://user:pass@localhost:5432/csediualumni_test?schema=public` |

### Redis

| Variable            | Required | Description          | Example                  |
| ------------------- | -------- | -------------------- | ------------------------ |
| `REDIS_URL`         | Yes      | Redis connection URL | `redis://localhost:6379` |
| `REDIS_TTL_SECONDS` | No       | Default cache TTL    | `300`                    |

### File Storage (S3)

| Variable                | Required | Description                           | Example                 |
| ----------------------- | -------- | ------------------------------------- | ----------------------- |
| `AWS_ACCESS_KEY_ID`     | Yes      | IAM access key with S3 permissions    | —                       |
| `AWS_SECRET_ACCESS_KEY` | Yes      | IAM secret access key                 | —                       |
| `AWS_REGION`            | Yes      | S3 bucket region                      | `ap-southeast-1`        |
| `AWS_S3_BUCKET`         | Yes      | S3 bucket name                        | `csediualumni-files`    |
| `AWS_S3_ENDPOINT`       | No       | Custom endpoint for MinIO (local dev) | `http://localhost:9000` |

### Email

| Variable          | Required | Description                             | Example                    |
| ----------------- | -------- | --------------------------------------- | -------------------------- |
| `SMTP_HOST`       | Yes      | SMTP server hostname                    | `smtp.sendgrid.net`        |
| `SMTP_PORT`       | Yes      | SMTP server port                        | `587`                      |
| `SMTP_SECURE`     | No       | Use TLS (`true`) or STARTTLS (`false`)  | `false`                    |
| `SMTP_USER`       | Yes      | SMTP authentication username            | `apikey`                   |
| `SMTP_PASS`       | Yes      | SMTP authentication password or API key | —                          |
| `EMAIL_FROM`      | Yes      | Sender address for outgoing emails      | `noreply@csediualumni.com` |
| `EMAIL_FROM_NAME` | No       | Sender display name                     | `CSE DIU Alumni`           |

### Payment

| Variable                | Required | Description                                |
| ----------------------- | -------- | ------------------------------------------ |
| `SSLCOMMERZ_STORE_ID`   | Yes\*    | SSLCommerz store ID                        |
| `SSLCOMMERZ_STORE_PASS` | Yes\*    | SSLCommerz store password                  |
| `SSLCOMMERZ_IS_LIVE`    | No       | `true` for production, `false` for sandbox |
| `STRIPE_SECRET_KEY`     | Yes\*    | Stripe secret key                          |
| `STRIPE_WEBHOOK_SECRET` | Yes\*    | Stripe webhook signing secret              |

\* Required when the corresponding payment provider is enabled.

### Monitoring

| Variable             | Required   | Description                                              |
| -------------------- | ---------- | -------------------------------------------------------- |
| `SENTRY_DSN`         | Production | Sentry DSN for error reporting                           |
| `SENTRY_ENVIRONMENT` | No         | Tag for Sentry environment (`production`, `development`) |

---

## Web (`apps/web/.env`)

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser bundle. **Never put secrets in `NEXT_PUBLIC_` variables.**

| Variable                        | Required | Description                                                     | Example                           |
| ------------------------------- | -------- | --------------------------------------------------------------- | --------------------------------- |
| `NEXT_PUBLIC_API_URL`           | Yes      | Base URL of the NestJS API                                      | `https://csediualumni.com/api/v1` |
| `NEXT_PUBLIC_APP_URL`           | Yes      | Canonical URL of the Next.js app (used to build absolute links) | `https://csediualumni.com`        |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | No       | Google Analytics 4 measurement ID                               | `G-XXXXXXXXXX`                    |
| `NEXT_PUBLIC_SENTRY_DSN`        | No       | Sentry DSN for frontend error reporting                         | —                                 |

---

## Notes

- Generate strong secrets with: `openssl rand -base64 64`
- In production, inject environment variables via the server's systemd unit file, Docker Compose `env_file`, or a secrets manager — **never commit them to git**.
- When adding a new environment variable, update the corresponding `.env.example` with the key and a descriptive comment.
