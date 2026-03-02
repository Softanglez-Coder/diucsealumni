import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About — CSE DIU Alumni',
  description:
    'Learn about the CSE DIU Alumni platform — our mission, the team behind it, and the community we serve.',
};

const STATS = [
  { value: '2,000+', label: 'Registered alumni' },
  { value: '15+', label: 'Graduation batches' },
  { value: '50+', label: 'Events hosted' },
  { value: '100+', label: 'Jobs posted' },
];

const FEATURES = [
  {
    title: 'Alumni Directory',
    description:
      'A searchable, members-only directory of all approved graduates sorted by batch, industry, and skills.',
  },
  {
    title: 'Events & RSVPs',
    description:
      'Browse upcoming reunions, tech talks, and career fairs. RSVP in one click and get automated reminders.',
  },
  {
    title: 'News & Updates',
    description:
      'Stay up to date with department news, alumni achievements, and community announcements.',
  },
  {
    title: 'Job Board',
    description:
      'Alumni-posted job openings reviewed and approved by admins before going live to the community.',
  },
  {
    title: 'Mentorship Programme',
    description:
      'A structured mentorship experience connecting experienced alumni with juniors. Coming soon.',
  },
  {
    title: 'Membership Card',
    description:
      'Every approved member receives a unique membership number and a downloadable digital card with QR code.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-900 to-gray-800 text-white py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight mb-4">About CSE DIU Alumni</h1>
          <p className="text-lg text-gray-300">
            A unified platform connecting graduates of the Computer Science &amp; Engineering
            Department of Dhaka International University.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-blue-700 text-white">
        <div className="mx-auto max-w-4xl grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-black">{s.value}</p>
              <p className="text-sm text-blue-200 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The CSE DIU Alumni platform exists to keep the graduates of Dhaka International
            University&rsquo;s Computer Science &amp; Engineering Department connected — to each
            other and to the institution — long after graduation day.
          </p>
          <p className="text-gray-600 leading-relaxed mb-4">
            We believe that a strong alumni network accelerates careers, fosters mentorship,
            strengthens the department, and gives back to the students who follow in our footsteps.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Whether you graduated last year or a decade ago, this is your professional home.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Platform Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="bg-white rounded-xl border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Department */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">The Department</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            The Department of Computer Science &amp; Engineering at Dhaka International University
            has been training software engineers, researchers, and technology leaders for over two
            decades. Located at DIU Permanent Campus in Ashulia, the department runs B.Sc., M.Sc.,
            and PhD programmes in Computer Science and Engineering.
          </p>
          <a
            href="https://diu.edu.bd"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-blue-700 font-medium hover:underline"
          >
            Visit the DIU website
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 bg-gray-50 text-center border-t border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-3">Ready to join?</h3>
        <p className="text-gray-500 mb-6">Apply for membership and become part of the network.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/auth/register"
            className="inline-block px-8 py-3 rounded-lg bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800 transition-colors"
          >
            Apply for membership
          </Link>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 rounded-lg border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Contact us
          </Link>
        </div>
      </section>
    </div>
  );
}
