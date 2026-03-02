'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function VerifyMembershipIndexPage() {
  const router = useRouter();
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter a membership number.');
      return;
    }
    // Basic format check: CSEDIA-XXX-YYYY-NNNNN
    if (!/^CSEDIA-[A-Z]{3}-\d{4}-\d+$/.test(trimmed)) {
      setError('Invalid format. Expected: CSEDIA-REG-2025-00001 (tier codes: REG, LIF, HON).');
      return;
    }
    setError('');
    router.push(`/verify/${trimmed}`);
  }

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center">
              <svg
                className="w-7 h-7 text-blue-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
                />
              </svg>
            </div>
          </div>

          <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Verify Membership</h1>
          <p className="text-sm text-gray-500 text-center mb-8">
            Enter a CSE DIU Alumni membership number to check its validity and status.
          </p>

          <form onSubmit={handleSubmit} noValidate>
            <label
              htmlFor="membership-number"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Membership number
            </label>
            <input
              id="membership-number"
              type="text"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. CSEDIA-REG-2025-00142"
              className={`w-full px-4 py-2.5 rounded-lg border text-sm font-mono text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                error ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white'
              }`}
              autoComplete="off"
              spellCheck={false}
            />
            {error && (
              <p className="mt-1.5 text-xs text-red-600" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="mt-4 w-full px-4 py-2.5 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Verify
            </button>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-5 text-xs text-center text-gray-400">
          Are you a member?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>{' '}
          to download your membership card.
        </p>

        <div className="mt-3 text-center">
          <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
