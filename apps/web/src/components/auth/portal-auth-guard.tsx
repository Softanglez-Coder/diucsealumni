'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { tryRefreshTokens } from '@/lib/api-client';
import { useAuthStore } from '@/lib/auth';

/**
 * Client-side authentication guard for portal routes.
 *
 * On mount it checks whether an access token is already present in the
 * in-memory Zustand store.  If not (e.g. after a full page refresh clears
 * the store) it immediately calls the token-refresh endpoint so the session
 * is transparently restored from the HttpOnly refresh-token cookie — without
 * a redirect to the sign-in page.
 *
 * The singleton `tryRefreshTokens` helper is used, so concurrent API calls
 * that also hit 401 on hydration share the same in-flight refresh request and
 * never trigger the double-rotation bug.
 *
 * Only redirects to /auth/login when the refresh itself fails (no valid
 * cookie, expired session, etc.).
 */
export function PortalAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const accessToken = useAuthStore((s) => s.accessToken);
  const [ready, setReady] = useState(false);
  // Track whether we've already run the guard so React Strict Mode's
  // double-effect invocation doesn't fire two refresh requests.
  const checked = useRef(false);

  useEffect(() => {
    if (checked.current) return;
    checked.current = true;

    if (accessToken) {
      // Already have a token in memory — nothing to do.
      setReady(true);
      return;
    }

    // No token in memory (common on full-page refresh).
    // Try to restore the session from the HttpOnly refresh-token cookie.
    tryRefreshTokens().then((ok) => {
      if (ok) {
        setReady(true);
      } else {
        router.replace('/auth/login');
      }
    });
  }, [accessToken, router]);

  if (!ready) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin"
            role="status"
            aria-label="Loading portal…"
          />
          <p className="text-sm text-gray-500">Loading…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
