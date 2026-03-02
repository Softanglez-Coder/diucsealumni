import type { Metadata } from 'next';
import Link from 'next/link';

import { COMMITTEE } from '@/lib/committee-data';

export const metadata: Metadata = {
  title: 'Executive Committee — CSE DIU Alumni',
  description:
    'Meet the elected executive committee of the CSE DIU Alumni Association — the volunteers who lead and serve the community.',
};

export default function CommitteePage() {
  const executive = COMMITTEE.filter((m) => m.isKeyMember);
  const extended = COMMITTEE.filter((m) => !m.isKeyMember);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-800 to-blue-700 text-white py-16 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-3">
            Term 2024 – 2026
          </p>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Executive Committee</h1>
          <p className="text-lg text-blue-100">
            The CSE DIU Alumni Association is led by elected alumni volunteers committed to serving
            the community. Meet the team behind the platform.
          </p>
        </div>
      </section>

      {/* Core executive */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Core Executive</h2>
          <p className="text-gray-500 text-sm mb-10">
            The four-member core executive who carry primary responsibility for the association.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {executive.map((member) => (
              <MemberCard key={member.slug} member={member} featured />
            ))}
          </div>
        </div>
      </section>

      {/* Extended committee */}
      <section className="py-4 pb-20 px-4 bg-gray-50">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 mt-4">Extended Committee</h2>
          <p className="text-gray-500 text-sm mb-10">
            Additional secretaries and elected officers who run specific portfolios.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {extended.map((member) => (
              <MemberCard key={member.slug} member={member} featured={false} />
            ))}
          </div>
        </div>
      </section>

      {/* Explore past committees */}
      <section className="py-10 px-4 border-t border-gray-100">
        <div className="mx-auto max-w-6xl">
          <Link
            href="/committee/history"
            className="group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-5 hover:border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-200 group-hover:bg-blue-100 flex items-center justify-center text-xl transition-colors shrink-0">
                🏛️
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  Explore Past Committees
                </h3>
                <p className="text-sm text-gray-500">
                  Browse the full history of elected committees since the association was founded in
                  2018 — three archived terms available.
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 group-hover:gap-2.5 transition-all shrink-0">
              View history
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </span>
          </Link>
        </div>
      </section>

      {/* Want to join */}
      <section className="bg-blue-700 py-14 px-4 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-bold text-white mb-3">Want to serve on the committee?</h2>
          <p className="text-blue-100 text-sm mb-6">
            Committee elections are held every two years. Active alumni members with good standing
            are eligible to nominate themselves or others.
          </p>
          <Link
            href="/membership"
            className="inline-block px-8 py-3 rounded-lg bg-white text-blue-700 font-semibold text-sm hover:bg-blue-50 transition-colors"
          >
            Apply for membership
          </Link>
        </div>
      </section>
    </div>
  );
}

// ─── Member Card ──────────────────────────────────────────────────────────────

function MemberCard({
  member,
  featured,
}: {
  member: (typeof COMMITTEE)[number];
  featured: boolean;
}) {
  return (
    <Link
      href={`/committee/${member.slug}`}
      className={`group block rounded-2xl border bg-white p-6 transition-all hover:shadow-md hover:-translate-y-0.5 ${
        featured ? 'border-blue-100 shadow-sm' : 'border-gray-100'
      }`}
    >
      {/* Avatar */}
      <div
        className={`w-16 h-16 rounded-2xl ${member.avatarColor} flex items-center justify-center text-white text-xl font-bold mb-4 select-none`}
      >
        {member.initials}
      </div>

      {/* Role badge */}
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold mb-2 ${
          featured ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
        }`}
      >
        {member.roleShort}
      </span>

      <h3 className="font-semibold text-gray-900 leading-snug group-hover:text-blue-700 transition-colors">
        {member.name}
      </h3>
      <p className="text-xs text-gray-500 mt-0.5">{member.batch}</p>
      <p className="text-xs text-gray-400 mt-2 line-clamp-1">{member.jobTitle}</p>
      <p className="text-xs text-gray-400">{member.company}</p>

      <div className="mt-4 flex items-center gap-1 text-xs text-blue-600 font-medium group-hover:gap-2 transition-all">
        View profile
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
