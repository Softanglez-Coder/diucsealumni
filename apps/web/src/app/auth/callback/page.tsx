'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';

import { useAuthStore } from '@/lib/auth';

/**
 * Handles the post-OAuth redirect from the API.
 * Reads the access_token from the URL, stores it in memory, then clears the URL.
 */
function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAccessToken = useAuthStore((s) => s.setAccessToken);

  useEffect(() => {
    const token = searchParams.get('access_token');
    if (token) {
      setAccessToken(token);
      // Remove token from URL immediately — never leave it in browser history
      globalThis.history.replaceState({}, '', '/auth/callback');
      router.replace('/portal');
    } else {
      router.replace('/auth/login');
    }
  }, [searchParams, setAccessToken, router]);

  return <p className="text-gray-500">Signing you in&hellip;</p>;
}

export default function AuthCallbackPage() {
  return (
    <main className="flex items-center justify-center min-h-screen">
      <Suspense fallback={<p className="text-gray-500">Loading&hellip;</p>}>
        <CallbackContent />
      </Suspense>
    </main>
  );
}
