/**
 * Server-side API client for use in React Server Components and Route Handlers.
 * Uses the internal API base URL (does not require a browser token store).
 *
 * For authenticated requests from the server, pass the Authorization header explicitly.
 */

const API_BASE = process.env['NEXT_PUBLIC_API_URL'] ?? 'http://localhost:4000/api/v1';

/**
 * Fetches data from the internal API server-side.
 * Throws when the response is not 2xx.
 */
export async function serverFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    // Disable Next.js cache by default to get fresh data on every request.
    // Individual call sites can pass { next: { revalidate: N } } to opt into caching.
    cache: options.cache ?? 'no-store',
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${path}`);
  }

  const body = (await response.json()) as { data: T };
  return body.data;
}
