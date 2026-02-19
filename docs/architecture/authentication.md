# Authentication Architecture

## Overview

Authentication is handled entirely by the **NestJS API** using [Passport.js](https://www.passportjs.org/) via `@nestjs/passport`. The Next.js frontend delegates all auth flows to the API — it does not manage OAuth itself (no NextAuth.js). This keeps all auth logic in one place and makes the frontend stateless with respect to authentication.

Token strategy:

- **Access token** — short-lived (15 min) JWT, stored in memory on the client (never `localStorage`).
- **Refresh token** — long-lived (7 days) JWT, stored in an **HttpOnly, Secure, SameSite=Strict cookie** so it is inaccessible to JavaScript.

---

## Supported Authentication Methods

| Method                             | Status                         |
| ---------------------------------- | ------------------------------ |
| Email + Password                   | Supported                      |
| **Sign in with Google**            | Supported                      |
| Sign in with LinkedIn              | Planned                        |
| Multi-Factor Authentication (TOTP) | Planned (mandatory for admins) |

---

## Sign in with Google — Full Flow

### 1. Initiate (Frontend → API)

The user clicks the **"Sign in with Google"** button. The frontend redirects the browser to the NestJS OAuth entry point:

```
GET /api/v1/auth/google
```

This endpoint is handled by `GoogleOAuthGuard` (Passport `google` strategy), which immediately redirects the browser to Google's authorization URL:

```
https://accounts.google.com/o/oauth2/v2/auth
  ?client_id=<GOOGLE_CLIENT_ID>
  &redirect_uri=https://csediualumni.com/api/v1/auth/google/callback
  &response_type=code
  &scope=openid%20email%20profile
  &state=<random_csrf_token>
  &access_type=offline
```

### 2. Google Authorization (User → Google)

The user sees Google's consent screen and approves. Google redirects back to the API callback with a `code` and the `state` parameter.

### 3. Callback (Google → API)

```
GET /api/v1/auth/google/callback?code=<auth_code>&state=<state>
```

The `GoogleOAuthGuard` exchanges the `code` for a Google `id_token` + `access_token`, verifies the `id_token`, and extracts the user's profile (`email`, `name`, `picture`, `sub`).

Passport calls the **validate** function:

```typescript
async validate(
  accessToken: string,
  refreshToken: string,
  profile: Profile,
): Promise<User> {
  const { emails, name, photos, id: googleId } = profile;
  const email = emails[0].value;

  // Find or create account linked to this Google ID
  let user = await this.usersService.findByGoogleId(googleId);
  if (!user) {
    user = await this.usersService.findByEmail(email);
    if (user) {
      // Existing email-password account → link Google ID
      await this.usersService.linkGoogleAccount(user.id, googleId);
    } else {
      // New user → create account (membership application auto-created)
      user = await this.usersService.createFromGoogle({
        googleId,
        email,
        firstName: name.givenName,
        lastName: name.familyName,
        avatarUrl: photos[0]?.value,
      });
    }
  }

  if (user.isSuspended) throw new ForbiddenException('Account suspended.');
  return user;
}
```

### 4. Token Issuance (API → Browser)

After successful validation, the callback controller:

1. Generates an **access token** (JWT, 15 min) and a **refresh token** (JWT, 7 days).
2. Stores a hashed copy of the refresh token against the user record in PostgreSQL (for rotation and revocation).
3. Sets the **refresh token in an HttpOnly cookie**:
   ```
   Set-Cookie: refresh_token=<token>; HttpOnly; Secure; SameSite=Strict; Path=/api/v1/auth/refresh; Max-Age=604800
   ```
4. Redirects the browser to the frontend with the access token as a short-lived URL parameter:
   ```
   302 → https://csediualumni.com/auth/callback?access_token=<token>
   ```

### 5. Frontend Token Handling

The Next.js page at `/auth/callback`:

1. Reads `access_token` from the URL query string.
2. Removes it from the URL immediately (`window.history.replaceState`).
3. Stores the access token **in React context / Zustand store (in-memory only)** — never in `localStorage` or `sessionStorage`.
4. Redirects to the member dashboard.

Subsequent API calls include the access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

### 6. Token Refresh

When an API call returns `401 Unauthorized` (access token expired):

1. The frontend sends a `POST /api/v1/auth/refresh` request **with credentials** (so the HttpOnly cookie is sent automatically).
2. The API validates the cookie refresh token against the hashed copy stored in the database.
3. If valid: issues new access + refresh tokens (rotation), updates the cookie, returns the new access token in the response body.
4. If invalid or expired: the frontend redirects to the login page.

### 7. Logout

```
POST /api/v1/auth/logout
```

The API:

1. Deletes the stored refresh token hash from the database (immediate revocation).
2. Clears the `refresh_token` cookie (`Max-Age=0`).
3. Returns `200 OK`.

The frontend clears the in-memory access token and redirects to the home page.

---

## Complete Auth Flow Diagram

```
Browser                         NestJS API                      Google OAuth
   │                                │                                │
   │  GET /api/v1/auth/google       │                                │
   │──────────────────────────────▶│                                │
   │                                │  302 → Google authorization   │
   │◀──────────────────────────────│───────────────────────────────▶│
   │                                │                                │
   │  User grants consent on Google │                                │
   │──────────────────────────────────────────────────────────────▶│
   │                                │                                │
   │  GET /api/v1/auth/google/callback?code=...                      │
   │──────────────────────────────▶│◀───────────────────────────────│
   │                                │  Exchange code → id_token      │
   │                                │  Validate → find/create user   │
   │                                │  Generate JWT pair             │
   │                                │  Store refresh token hash (DB) │
   │  302 → /auth/callback?         │  Set refresh_token cookie      │
   │  access_token=...              │                                │
   │◀──────────────────────────────│                                │
   │                                │                                │
   │  Read token from URL           │                                │
   │  Clear URL                     │                                │
   │  Store in memory               │                                │
   │                                │                                │
   │  GET /api/v1/members/me        │                                │
   │  Authorization: Bearer <token> │                                │
   │──────────────────────────────▶│                                │
   │  200 OK { user }              │                                │
   │◀──────────────────────────────│                                │
```

---

## Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String?   // null for Google-only accounts
  googleId      String?   @unique
  firstName     String
  lastName      String
  avatarUrl     String?
  isEmailVerified Boolean @default(false)
  isSuspended   Boolean   @default(false)
  refreshTokens RefreshToken[]
  roles         UserRole[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  deletedAt     DateTime?

  @@index([email])
  @@index([googleId])
}

model RefreshToken {
  id        String   @id @default(cuid())
  tokenHash String   @unique  // bcrypt hash of the raw token
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userAgent String?
  ipAddress String?
  expiresAt DateTime
  createdAt DateTime @default(now())

  @@index([userId])
}
```

Multiple `RefreshToken` records per user support concurrent sessions (different devices/browsers). Logout revokes only the current session's token.

---

## API Endpoints

| Method | Path                           | Auth   | Description                                 |
| ------ | ------------------------------ | ------ | ------------------------------------------- |
| `GET`  | `/api/v1/auth/google`          | Public | Initiates Google OAuth flow                 |
| `GET`  | `/api/v1/auth/google/callback` | Public | Google OAuth callback (handled by Passport) |
| `POST` | `/api/v1/auth/register`        | Public | Email + password registration               |
| `POST` | `/api/v1/auth/login`           | Public | Email + password login                      |
| `POST` | `/api/v1/auth/refresh`         | Cookie | Refresh access token using HttpOnly cookie  |
| `POST` | `/api/v1/auth/logout`          | Bearer | Revoke current refresh token                |
| `POST` | `/api/v1/auth/logout-all`      | Bearer | Revoke all refresh tokens (all sessions)    |
| `POST` | `/api/v1/auth/forgot-password` | Public | Send password reset email                   |
| `POST` | `/api/v1/auth/reset-password`  | Public | Apply new password via reset token          |
| `POST` | `/api/v1/auth/verify-email`    | Public | Verify email address via token              |

---

## Security Considerations

| Concern                         | Mitigation                                                                                                                                        |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| CSRF on OAuth callback          | `state` parameter validated server-side; callback is a `GET` with no sensitive side-effects                                                       |
| Token leakage via URL           | Access token in callback URL is removed immediately; URL entry is replaced in browser history                                                     |
| XSS stealing tokens             | Access token in memory only (never `localStorage`); refresh token in HttpOnly cookie is XSS-immune                                                |
| Refresh token theft             | HttpOnly + Secure + SameSite=Strict cookie; token rotation on every refresh; immediate revocation on logout                                       |
| Account takeover via email link | If a Google account email matches an existing password account, Google is **linked** to that account — user is prompted to confirm before linking |
| Brute-force on login            | Rate limiting: 5 failed attempts per 15-minute window per IP; Throttler applied at API gateway                                                    |
| Open redirect after OAuth       | Post-auth redirect URL is hardcoded on the server; never taken from user input or URL parameters                                                  |

---

## NestJS Module Structure

```
src/modules/auth/
├── auth.module.ts
├── auth.controller.ts
├── auth.service.ts
├── strategies/
│   ├── jwt.strategy.ts          # validates Bearer tokens on protected routes
│   ├── jwt-refresh.strategy.ts  # validates refresh token from HttpOnly cookie
│   └── google.strategy.ts       # Passport Google OAuth 2.0 strategy
├── guards/
│   ├── jwt-auth.guard.ts
│   ├── jwt-refresh.guard.ts
│   └── google-oauth.guard.ts
├── decorators/
│   └── current-user.decorator.ts
└── dto/
    ├── register.dto.ts
    ├── login.dto.ts
    └── reset-password.dto.ts
```

---

## Google Cloud Console Setup

To configure the Google OAuth app:

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Credentials**.
2. Create an **OAuth 2.0 Client ID** (application type: **Web application**).
3. Add authorized redirect URIs:
   - Development: `http://localhost:4000/api/v1/auth/google/callback`
   - Production: `https://csediualumni.com/api/v1/auth/google/callback`
4. Copy the **Client ID** and **Client Secret** into `apps/api/.env`.
5. On the **OAuth consent screen**, set:
   - App name: `CSE DIU Alumni`
   - Authorized domain: `csediualumni.com`
   - Scopes: `openid`, `email`, `profile`
   - Support email: the association's official email address
6. Submit for Google verification before going live (required for apps with > 100 users).
