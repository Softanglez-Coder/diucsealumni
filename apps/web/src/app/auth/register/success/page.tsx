import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Application Submitted — CSE DIU Alumni',
};

export default function RegisterSuccessPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <span className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Application submitted!</h1>
          <p className="mt-3 text-gray-500 text-sm leading-relaxed">
            Thank you for applying to the CSE DIU Alumni network. Your application is now
            <strong> pending review</strong> by the admin team. You&apos;ll receive a confirmation
            email at the address you provided once your membership is approved.
          </p>
        </div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-800">
          <strong>What happens next?</strong> The admin team typically reviews applications within
          2–5 business days. You&apos;ll be notified by email.
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Back to home
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-blue-700 text-sm font-semibold text-white hover:bg-blue-800 transition-colors"
          >
            Browse events
          </Link>
        </div>
      </div>
    </main>
  );
}
