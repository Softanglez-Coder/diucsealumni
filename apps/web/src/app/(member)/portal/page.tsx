import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Portal',
};

export default function PortalDashboardPage() {
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold text-gray-900">My Portal</h1>
      <p className="mt-2 text-gray-600">Welcome back. Your dashboard is coming soon.</p>
    </main>
  );
}
