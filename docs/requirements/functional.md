# Functional Requirements

This document specifies the functional requirements of the CSE DIU Alumni platform, organized by feature module. Each module lists its actors, core capabilities, and acceptance criteria.

> **Architecture note:** The platform is a **single public-facing Next.js application**. There is no separate admin app. Every page and action is governed by the RBAC permission system — the UI surfaces only the controls a user is permitted to use. A logged-in user with the `admin` or `moderator` role sees additional management controls inline within the same site; a regular member sees only member-relevant actions; and an unauthenticated visitor sees only public content.

---

## 1. Authentication & Authorization

**Actors:** All users, System Administrator

> See [Authentication Architecture](../architecture/authentication.md) for the full technical design, flow diagram, and security model.

### Requirements

#### Email & Password

- Users can register with an email address and a strong password (min 8 chars, must include upper, lower, number, symbol).
- Email verification is required before the account is activated.
- Password reset is available via a time-limited, single-use link sent to the registered email.

#### Sign in with Google

- A **"Sign in with Google"** button is shown on the login and registration pages.
- Clicking it redirects the browser to the NestJS API, which initiates the Google OAuth 2.0 flow.
- If the Google account email matches an existing password-based account, the Google identity is **linked** to that account after user confirmation.
- If no account exists, a new user account is automatically created using the Google profile (name, email, avatar).
- A new account created via Google still requires membership approval before accessing member-only areas.

#### Sessions & Tokens

- JWT-based sessions: short-lived access token (15 min) stored in memory; long-lived refresh token (7 days) stored in an HttpOnly, Secure, SameSite=Strict cookie.
- Refresh tokens are rotated on every use and stored as hashed records in the database.
- Logout immediately revokes the current session's refresh token.
- "Log out of all devices" revokes all refresh tokens for the user.

#### Security

- Multi-factor authentication (MFA/TOTP): optional for regular users, mandatory for administrators.
- Rate limiting: 5 failed login attempts per 15-minute window per IP trigger a temporary lockout.
- Session invalidation is immediate (token blacklisting via database + Redis).

---

## 2. Membership Management

**Actors:** Alumni (Applicant), Administrator, Moderator

### Requirements

- Alumni can submit a membership registration form including personal details, educational background, and current occupation.
- Administrators can approve, reject, or request revision of membership applications.
- Membership tiers supported (e.g., Regular, Life, Honorary) with configurable benefits.
- Membership expiry and automated renewal reminders via email and in-app notifications.
- Administrators can manually manage membership status (suspend, reinstate, upgrade).
- Exportable member list (CSV / Excel) for administrators.
- Upon approval, a unique membership number is automatically issued (see [Section 14 — Membership Card](#14-membership-card)).

---

## 3. Alumni Profile & Member Portal

**Actors:** Alumni, Public Visitor, Moderator, Administrator

### Public profile page

- Every approved alumni has a dedicated profile page accessible via a public URL (SEO-friendly slug: `/alumni/[username]`).
- Profile fields: full name, photo, batch year, current job title, employer, location, bio, skills, LinkedIn, GitHub, personal website.
- Alumni can upload and manage their CV (PDF, max 5 MB); visitors can download it.
- Profile visibility settings: public, members-only, or private.
- Alumni can post their achievements, projects, and experiences as timeline entries.
- Administrators can feature alumni on the homepage.

### Member portal (`/portal`)

Once authenticated, every user is directed to their personal portal — a unified dashboard within the public site. The portal is the single entry point for all authenticated actions.

- **Dashboard home** — a personalised overview: upcoming events the user has RSVP'd to, unread notifications, pending membership status, recent forum activity, and any role-specific action items.
- **Edit my profile** — the user can update all profile fields, manage privacy settings, upload a CV, and link/unlink social accounts.
- **My activity** — history of RSVPs, donations, forum posts, job applications, and mentorship relationships.
- **Settings** — notification preferences, password change, connected OAuth providers, and account deletion request.
- **Permission-driven sections** — every management control (approve membership, moderate content, manage events, view analytics, etc.) is rendered inside the same portal but is only visible and accessible to users who hold the required role/permission. Users without the requisite permission simply do not see those menu items or pages.
  - A `moderator` sees a **Moderation** section for content queues and flagged posts.
  - An `admin` sees the full **Management** section (all of section 12 below) alongside their own member portal.
  - A regular `member` sees only their personal sections.

---

## 4. Alumni Directory

**Actors:** Authenticated Alumni, Administrator

### Requirements

- Searchable and filterable directory of all active alumni profiles.
- Filter options: batch year, current location, industry, skill, employment status.
- Search via name, company, or skill keyword.
- Pagination with configurable page size.
- Results are hidden from unauthenticated visitors (members-only).

---

## 5. Event Management

**Actors:** Administrator, Moderator, Alumni, Public Visitor

### Requirements

- Create events with: title, description, date/time, location (physical or virtual), banner image, registration link, seat limit.
- Public event listing page with a calendar view and list view.
- Alumni can RSVP to events; administrators see attendee lists.
- Automated reminder notifications before event date (1 week, 1 day).
- Events can be marked as past and archived with photo galleries.
- Export attendee list (CSV) per event.

---

## 6. News & Updates

**Actors:** Administrator, Moderator, Public Visitor, Alumni

### Requirements

- Rich-text news articles with featured image, tags, author, and publication date.
- Draft / Published / Archived status workflow.
- Public listing with pagination; individual SEO-friendly article URLs (`/news/[slug]`).
- Alumni can comment on news articles (subject to moderation).
- Newsletter: administrators can send news via email to opted-in members.

---

## 7. Discussion Forum

**Actors:** Authenticated Alumni, Moderator, Administrator

### Requirements

- Organized into categories (e.g., Career, Technology, Campus Life).
- Alumni can create threads and reply to existing threads.
- Rich-text editor with code block support.
- Upvoting / downvoting on posts and replies.
- Moderators can pin, lock, move, or delete threads.
- Reporting system: alumni can flag inappropriate content for moderator review.
- Inline notifications for replies to threads the user is subscribed to.

---

## 8. Donation & Fundraising

**Actors:** Alumni, Public Visitor, Administrator

### Requirements

- Donation campaigns with goal amount, progress bar, deadline, and description.
- Secure online payment via SSLCommerz (Bangladesh) and Stripe (international).
- Donors receive an automated payment receipt via email.
- Anonymous donation option.
- Administrators view donation reports per campaign: total raised, donor list, transaction history.
- Donation history visible to each donor in their profile.

---

## 9. Job Board

**Actors:** Alumni, Administrator, Moderator, Public Visitor

### Requirements

- Job postings with: title, company, location (remote/hybrid/on-site), job type, description, requirements, application link or email, expiry date.
- Alumni and administrators can post jobs; posts go through admin approval before publishing.
- Categorized by industry and job type.
- Email notification to opted-in members when new jobs are posted.
- Expired jobs automatically archived.
- Job poster can mark a position as filled.

---

## 10. Mentorship Program

**Actors:** Alumni (Mentor), Current Student / Junior Alumni (Mentee), Administrator

### Requirements

- Alumni can register as mentors specifying their expertise areas and availability.
- Students/junior alumni can browse and request a mentor.
- Mentor can accept or decline requests.
- Messaging between matched mentor/mentee pairs (in-platform or email-forwarded).
- Administrators view and manage all mentorship relationships.
- Feedback / rating collected at the end of a mentorship period.

---

## 11. Notification System

**Actors:** All authenticated users

### Requirements

- In-app notification bell with unread count badge.
- Notifications for: new event, job posting, membership status change, forum reply, donation campaign, direct message, admin announcement.
- Per-user notification preferences (which events to receive in-app vs. email).
- Mark as read individually or in bulk.
- Email digest option (daily or weekly summary).

---

## 12. Management Panel (role-gated, within the member portal)

**Actors:** Administrator, System Administrator, Moderator

> This is **not** a separate application. It is a set of portal sections rendered at `/portal/manage/**` and protected by RBAC. Users without the required permissions are redirected to their member dashboard.

### Moderator section (`moderator` role or higher)

- Content moderation queue: pending news comments and flagged forum posts, with approve / reject / edit actions.
- Ability to pin, lock, move, or delete forum threads from within the forum UI.
- Event attendee lists for events the moderator manages.

### Admin section (`admin` role or higher)

- **Overview** — statistics: total alumni, active members, pending applications, upcoming events, recent donations.
- **User management** — list, search, view, edit, suspend, delete any user account.
- **Membership applications** — approve, reject, or request revision; bulk actions supported.
- **Role & permission management** — create/edit/delete roles; assign/revoke permissions per role; assign roles to users (see [RBAC design](../architecture/rbac.md)).
- **Content management** — create/edit/publish/archive news articles, events, and job postings on behalf of the organisation.
- **Analytics panel** — page views, active users, new registrations over time (integrated with GA4 and server-side events).
- **Donation reports** — per-campaign totals, donor lists, and transaction history.
- **System settings** — site name, contact email, maintenance mode toggle, feature flags.
- **Audit log** — timestamped record of all sensitive admin actions, filterable by user and action type.
- **Exports** — member list (CSV/Excel), event attendee list (CSV), donation report (CSV).

---

## 13. Search & Discovery

**Actors:** All users (scope varies by authentication state)

### Requirements

- Global search bar accessible from every page.
- Searches across: alumni profiles, events, news articles, forum threads, job listings.
- Results grouped by type with relevance ranking.
- Search index updated in real time on content create/update/delete.
- Unauthenticated users see limited results (public content only).
- Membership number look-up: entering a membership number in the search bar navigates directly to the public verification page for that member.

---

## 14. Membership Card

**Actors:** Approved Alumni, Administrator

### Membership number

- A unique membership number is automatically generated when an application is approved.
- **Format:** `CSEDIA-<TIER>-<YEAR>-<SEQUENCE>` (e.g., `CSEDIA-REG-2025-00142`), where:
  - `TIER` is a 3-letter code for the membership tier (`REG`, `LIF`, `HON`).
  - `YEAR` is the 4-digit approval year.
  - `SEQUENCE` is a zero-padded, incrementing integer unique within the year.
- The number is immutable once issued; it stays with the member for life even if the tier changes (tier changes are tracked separately).
- The number is human-readable, referenceable in emails and physical correspondence, and traceable in the audit log.

### Digital membership card

- A member can generate and download their membership card from the member portal as a **PDF and a PNG image**.
- Card displays: member name, photo, batch year, membership tier, membership number, valid-from / expiry date, and a QR code.
- The QR code encodes the public verification URL: `/verify/[membership-number]`.
- Members can regenerate the card at any time (e.g., after a profile photo update); previously downloaded cards remain visually valid but the QR code always resolves to the latest data.

### Public verification page (`/verify/[membership-number]`)

- Publicly accessible (no login required) — intended for real-world verification (events, job applications, etc.).
- Displays: member name, photo, tier, membership status (`Active` / `Expired` / `Suspended`), and valid-from / expiry dates.
- Does **not** expose private profile fields (contact info, CV, etc.).
- Returns a clear visual indicator (green / amber / red) so a non-technical verifier can instantly understand the status.

### Admin controls

- Administrators can reissue a card (generates a new PDF but **does not** change the membership number).
- Administrators can mark a membership as suspended, which immediately reflects on the verification page.
- Bulk export of all membership numbers with statuses (CSV).
