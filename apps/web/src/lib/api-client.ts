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

/**
 * Attempts to refresh the access token by calling `POST /auth/refresh`.
 * Updates the in-memory store on success.
 */
async function tryRefreshTokens(): Promise<boolean> {
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
  }
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
