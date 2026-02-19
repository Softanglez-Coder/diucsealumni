import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sign In',
};

export default function LoginPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">Sign in to your account</h1>

        {/* TODO: replace with LoginForm client component */}
        <p className="text-center text-sm text-gray-500">
          Login form goes here.{' '}
          <Link href="/auth/register" className="underline text-blue-600">
            Register instead
          </Link>
        </p>

        <a
          href={`${process.env['NEXT_PUBLIC_API_URL']}/auth/google`}
          className="block w-full text-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Sign in with Google
        </a>
      </div>
    </main>
  );
}
