import type { Metadata } from 'next';
import Link from 'next/link';

import { LoginForm } from '@/components/auth/login-form';

export const metadata: Metadata = {
  title: 'Sign In — CSE DIU Alumni',
  description: 'Sign in to the CSE DIU Alumni member portal.',
};

export default function LoginPage() {
  return (
    <main className="flex min-h-screen bg-gray-50">
      {/* Left panel — branding (hidden on small screens) */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-12">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white"
          aria-label="CSE DIU Alumni home"
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/20 font-bold text-sm select-none">
            CSE
          </span>
          <span className="font-semibold text-lg">DIU Alumni</span>
        </Link>

        <div className="space-y-4">
          <blockquote className="text-xl font-medium text-white leading-relaxed">
            &ldquo;Reconnect with your CSE family, grow your career, and give back to the
            community.&rdquo;
          </blockquote>
          <p className="text-blue-200 text-sm">
            Department of Computer Science &amp; Engineering, Dhaka International University
          </p>
        </div>

        <div className="flex gap-6 text-blue-200 text-sm">
          <span>1,200+ Alumni</span>
          <span>50+ Events/year</span>
          <span>40+ Mentors</span>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-700 text-white font-bold text-sm">
            CSE
          </span>
          <span className="font-semibold text-gray-900">DIU Alumni</span>
        </Link>

        <div className="w-full max-w-sm">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="mt-1 text-sm text-gray-500">Sign in to your CSE DIU Alumni account.</p>
          </div>

          <LoginForm />

          <p className="mt-8 text-center text-xs text-gray-400">
            By signing in you agree to our{' '}
            <Link href="/terms" className="underline hover:text-gray-600">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline hover:text-gray-600">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
