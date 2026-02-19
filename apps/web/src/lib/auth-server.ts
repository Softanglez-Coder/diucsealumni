import { cookies } from 'next/headers';

// ─── Server-side session helper ───────────────────────────────────────────────

export interface ServerSession {
  userId: string;
  email: string;
  permissions: string[];
}

/**
 * Reads the refresh token cookie on the server to determine if the user is
 * authenticated. Use this in Server Components and Route Handlers only.
 *
 * Note: This does NOT validate the token — it only checks presence.
 * Full validation happens on the API. Use sparingly; prefer API responses.
 */
export async function getServerSession(): Promise<ServerSession | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get('refresh_token');
  if (!refreshToken?.value) return null;

  // TODO: call /auth/me on the API with the refresh token to get session data
  // For now, return a placeholder to enable layout-level auth guards
  return null;
}
