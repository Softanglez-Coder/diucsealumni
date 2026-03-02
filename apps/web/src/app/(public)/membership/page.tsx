import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Apply for Membership — CSE DIU Alumni',
  description:
    'Join the CSE DIU Alumni network. Apply for membership and connect with graduates of the Computer Science & Engineering Department of Dhaka International University.',
};

const TIERS = [
  {
    name: 'Regular',
    code: 'REG',
    price: 'BDT 500 / year',
    description: 'For all CSE graduates. Full access to the alumni network.',
    features: [
      'Digital membership card & QR code',
      'Alumni directory access',
      'Event RSVPs & invitations',
      'Job board & mentorship access',
      'Discussion forum participation',
    ],
    highlight: false,
  },
  {
    name: 'Life',
    code: 'LIF',
    price: 'BDT 5,000 one-time',
    description: 'Lifetime membership with premium benefits and recognition.',
    features: [
      'Everything in Regular',
      'Lifetime membership — no renewal',
      'Featured badge on your profile',
      'Priority event seating',
      'Name in the annual honour roll',
    ],
    highlight: true,
  },
  {
    name: 'Honorary',
    code: 'HON',
    price: 'By invitation',
    description: 'Awarded to distinguished alumni and department benefactors.',
    features: [
      'Everything in Life',
      'Honorary recognition at events',
      'Special mention in publications',
      'Advisory board eligibility',
    ],
    highlight: false,
  },
];

// ─── Process steps ────────────────────────────────────────────────────────────

const STEPS = [
  {
    step: '01',
    title: 'Create an account',
    description: 'Register with your email or sign in with Google.',
  },
  {
    step: '02',
    title: 'Complete your application',
    description: 'Fill in your educational background, batch year, and current details.',
  },
  {
    step: '03',
    title: 'Wait for approval',
    description: 'Our admins review applications within 2–3 working days.',
  },
  {
    step: '04',
    title: 'Get your membership card',
    description: 'Once approved, download your digital card with a unique membership number.',
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MembershipPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-700 to-blue-800 text-white py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Join the Alumni Network</h1>
          <p className="text-lg text-blue-100 mb-8">
            Become a member of the CSE DIU Alumni platform. Stay connected, advance your career, and
            give back to your department.
          </p>
          <Link
            href="/auth/register"
            className="inline-block px-8 py-3 rounded-lg bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors"
          >
            Apply now — it&rsquo;s free to start
          </Link>
        </div>
      </section>

      {/* Tiers */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Membership Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <div
                key={tier.code}
                className={`rounded-2xl border p-6 flex flex-col ${
                  tier.highlight
                    ? 'border-blue-500 bg-blue-700 text-white shadow-lg'
                    : 'border-gray-200 bg-white'
                }`}
              >
                <div className="mb-4">
                  <span
                    className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-full mb-2 ${
                      tier.highlight ? 'bg-blue-600 text-blue-100' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {tier.code}
                  </span>
                  <h3
                    className={`text-lg font-bold ${tier.highlight ? 'text-white' : 'text-gray-900'}`}
                  >
                    {tier.name}
                  </h3>
                  <p
                    className={`text-sm mt-1 ${tier.highlight ? 'text-blue-200' : 'text-gray-500'}`}
                  >
                    {tier.description}
                  </p>
                  <p
                    className={`text-xl font-bold mt-3 ${tier.highlight ? 'text-white' : 'text-gray-900'}`}
                  >
                    {tier.price}
                  </p>
                </div>
                <ul className="space-y-2 flex-1">
                  {tier.features.map((f) => (
                    <li
                      key={f}
                      className={`flex items-start gap-2 text-sm ${tier.highlight ? 'text-blue-100' : 'text-gray-600'}`}
                    >
                      <svg
                        className={`w-4 h-4 mt-0.5 flex-shrink-0 ${tier.highlight ? 'text-blue-300' : 'text-blue-600'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {STEPS.map((s) => (
              <div key={s.step} className="flex gap-4">
                <span className="flex-shrink-0 text-2xl font-black text-blue-100 w-10 text-right leading-none mt-1">
                  {s.step}
                </span>
                <div>
                  <h3 className="font-semibold text-gray-900">{s.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-gray-50 text-center border-t border-gray-100">
        <p className="text-gray-600 mb-4">
          Already a member?{' '}
          <Link href="/auth/login" className="text-blue-700 font-medium hover:underline">
            Sign in
          </Link>
        </p>
        <Link
          href="/auth/register"
          className="inline-block px-8 py-3 rounded-lg bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800 transition-colors"
        >
          Start your application
        </Link>
      </section>
    </div>
  );
}
