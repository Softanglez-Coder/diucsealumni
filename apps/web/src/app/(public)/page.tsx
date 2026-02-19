import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Welcome to the CSE DIU Alumni platform — connecting graduates of the Department of Computer Science & Engineering, Dhaka International University.',
};

export default function HomePage() {
  return (
    <main>
      <section className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-4xl font-bold text-gray-900">CSE DIU Alumni</h1>
        <p className="mt-4 text-lg text-gray-600 max-w-xl">
          Connecting graduates of the Department of Computer Science &amp; Engineering, Dhaka
          International University.
        </p>
      </section>
    </main>
  );
}
