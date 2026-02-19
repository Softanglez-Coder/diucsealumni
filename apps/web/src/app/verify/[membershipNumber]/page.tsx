import type { Metadata } from 'next';

interface Props {
  params: Promise<{ membershipNumber: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { membershipNumber } = await params;
  return {
    title: `Verify Membership — ${membershipNumber}`,
    description: `Verify the membership status of CSE DIU Alumni member ${membershipNumber}.`,
  };
}

export default async function VerifyMembershipPage({ params }: Props) {
  const { membershipNumber } = await params;

  // TODO: fetch verification data from API (server-side, no auth required)

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-6 space-y-4">
        <h1 className="text-xl font-bold text-gray-900">Membership Verification</h1>
        <p className="text-gray-600 font-mono">{membershipNumber}</p>
        {/* TODO: render member name, photo, tier, status badge */}
      </div>
    </main>
  );
}
