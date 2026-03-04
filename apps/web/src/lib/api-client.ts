const API_BASE = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000/api/v1';

interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

/**
 * Base fetch wrapper that:
 * - Sets JSON headers
 * - Attaches the in-memory access token when available
 * - Throws a typed error on non-2xx responses
 * - Handles 401 by attempting a single token refresh
 */
export async function apiClient<T>(path: string, options: ApiClientOptions = {}): Promise<T> {
  const { body, ...init } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init.headers as Record<string, string>),
  };

  // Attach access token from Zustand store if available (client-side only)
  if (typeof globalThis !== 'undefined') {
    const { useAuthStore } = await import('./auth');
    const token = useAuthStore.getState().accessToken;
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include', // send HttpOnly refresh cookie
    body: body === undefined ? null : JSON.stringify(body),
  });

  // Attempt a single token refresh on 401
  if (response.status === 401 && typeof globalThis !== 'undefined') {
    const refreshed = await tryRefreshTokens();
    if (refreshed) {
      return apiClient<T>(path, options);
    }
    // Refresh failed — redirect to login
    globalThis.location.href = '/auth/login';
    throw new Error('Session expired.');
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    const error = new ApiError(errorBody?.title ?? 'Request failed', response.status, errorBody);
    throw error;
  }

  const data = (await response.json()) as { data: T };
  return data.data;
}

// Singleton refresh promise — prevents concurrent 401s (e.g. from multiple
// API calls on page load) from triggering parallel token rotations. Token
// rotation invalidates the previous refresh token, so the second concurrent
// refresh would fail, causing a spurious redirect to /auth/login.
let _refreshPromise: Promise<boolean> | null = null;

/**
 * Attempts to refresh the access token by calling `POST /auth/refresh`.
 * Concurrent callers share one in-flight request so token rotation is never
 * triggered twice with the same token.
 *
 * Exported so that the portal auth guard can call it on page load/refresh
 * without each waiting component triggering a separate rotation.
 */
export async function tryRefreshTokens(): Promise<boolean> {
  if (_refreshPromise) return _refreshPromise;

  _refreshPromise = (async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      if (!response.ok) return false;

      const body = (await response.json()) as { data: { accessToken: string } };
      const { useAuthStore } = await import('./auth');
      useAuthStore.getState().setAccessToken(body.data.accessToken);
      return true;
    } catch {
      return false;
    } finally {
      _refreshPromise = null;
    }
  })();

  return _refreshPromise;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public readonly body: any,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
