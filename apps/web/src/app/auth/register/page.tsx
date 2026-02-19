import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Register',
};

export default function RegisterPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center text-gray-900">Create an account</h1>

        {/* TODO: replace with RegisterForm client component */}
        <p className="text-center text-sm text-gray-500">
          Registration form goes here.{' '}
          <Link href="/auth/login" className="underline text-blue-600">
            Already have an account?
          </Link>
        </p>
      </div>
    </main>
  );
}
