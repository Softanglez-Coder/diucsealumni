import type { Metadata } from 'next';
import Link from 'next/link';

import { RegisterForm } from '@/components/auth/register-form';

export const metadata: Metadata = {
  title: 'Apply for Membership — CSE DIU Alumni',
  description:
    'Apply for membership to the CSE DIU Alumni network. Connect with 1,200+ graduates of Dhaka International University.',
};

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen bg-gray-50">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 flex-col justify-between bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 p-12">
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

        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white leading-snug">
            Join the CSE DIU Alumni network
          </h2>
          <ul className="space-y-3 text-blue-100">
            {[
              'Access the member directory and reconnect with classmates',
              'Browse and post jobs in the alumni job board',
              'RSVP to events, reunions, and tech talks',
              'Find a mentor or become one',
              'Get your official membership card',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <svg
                  className="w-4 h-4 mt-0.5 shrink-0 text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-blue-200 text-sm">
          Already a member?{' '}
          <Link href="/auth/login" className="text-white font-medium underline hover:no-underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 overflow-y-auto">
        {/* Mobile logo */}
        <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
          <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-700 text-white font-bold text-sm">
            CSE
          </span>
          <span className="font-semibold text-gray-900">DIU Alumni</span>
        </Link>

        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Membership application</h1>
            <p className="mt-1 text-sm text-gray-500">
              Complete the form below. Your application will be reviewed by our admin team.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}
