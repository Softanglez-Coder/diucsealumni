import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Mentorship Programme — CSE DIU Alumni',
  description:
    'Connect with experienced alumni mentors or register as a mentor to guide the next generation of CSE graduates.',
};

const FEATURES = [
  {
    title: 'Find a Mentor',
    description:
      'Browse registered mentors by expertise area — software engineering, data science, product management, and more.',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
        />
      </svg>
    ),
  },
  {
    title: 'Become a Mentor',
    description:
      "Share your experience and knowledge. Register as a mentor, set your availability, and make a difference in a junior's career.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    title: 'In-Platform Messaging',
    description:
      "Communicate directly with your mentor or mentee through the platform's built-in messaging system.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    ),
  },
  {
    title: 'Ratings & Feedback',
    description:
      'After each mentorship period ends, both parties leave ratings and feedback to help the community grow.',
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
  },
];

export default function MentorshipPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-indigo-700 to-indigo-800 text-white py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-600 rounded-full px-4 py-1.5 text-xs font-semibold mb-6 uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" />
            Coming Soon
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Mentorship Programme</h1>
          <p className="text-lg text-indigo-100">
            We&rsquo;re building a mentorship platform that connects CSE DIU graduates with junior
            alumni and students. Expect it to launch later this year.
          </p>
        </div>
      </section>

      {/* Feature preview */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-xl font-bold text-gray-900 text-center mb-10">What to Expect</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="bg-white rounded-xl border border-gray-100 p-6 flex gap-4"
              >
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                  <p className="text-sm text-gray-500">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 text-center">
        <p className="text-gray-600 mb-4">
          Want to be notified when it launches? Make sure your notification preferences are on.
        </p>
        <Link
          href="/auth/register"
          className="inline-block px-8 py-3 rounded-lg bg-indigo-700 text-white font-semibold text-sm hover:bg-indigo-800 transition-colors"
        >
          Apply for membership
        </Link>
      </section>
    </div>
  );
}
