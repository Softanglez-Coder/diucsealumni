'use client';

import Link from 'next/link';
import { useParams, notFound } from 'next/navigation';

import { getPastTerm, PAST_COMMITTEES, type PastMember } from '@/lib/committee-data';

export default function PastTermPage() {
  const params = useParams();
  const slug = typeof params['term'] === 'string' ? params['term'] : '';
  const term = getPastTerm(slug);

  if (!term) notFound();

  const idx = PAST_COMMITTEES.findIndex((t) => t.slug === slug);
  const older = idx < PAST_COMMITTEES.length - 1 ? PAST_COMMITTEES[idx + 1] : null;
  const newer = idx > 0 ? PAST_COMMITTEES[idx - 1] : null;

  const president = term.members.find(
    (m) => m.roleShort === 'President' || m.role.toLowerCase().includes('president'),
  );
  const coreRoles = new Set(['President', 'Vice President', 'Gen. Secretary', 'Treasurer']);
  const core = term.members.filter((m) => coreRoles.has(m.roleShort));
  const extended = term.members.filter((m) => !coreRoles.has(m.roleShort));

  return (
    <div className="min-h-screen bg-white">
      {/* Banner */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-700 px-4 pt-12 pb-20">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/committee/history"
            className="inline-flex items-center gap-1.5 text-gray-300 hover:text-white text-sm mb-8 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Past Committees
          </Link>

          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold mb-3 backdrop-blur-sm">
            Historical Record
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Executive Committee {term.label}
          </h1>
          {president && (
            <p className="text-gray-300 text-sm">
              President: <span className="font-medium text-white">{president.name}</span>
              {' · '}
              {president.batch}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 -mt-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: members + description */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-3">Overview</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{term.description}</p>
            </div>

            {/* Core executive */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-semibold text-gray-900 mb-5">Core Executive</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {core.map((member) => (
                  <PastMemberCard key={member.name} member={member} />
                ))}
              </div>
            </div>

            {/* Extended */}
            {extended.length > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-semibold text-gray-900 mb-5">Extended Committee</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {extended.map((member) => (
                    <PastMemberCard key={member.name} member={member} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: highlights + navigation */}
          <div className="space-y-5">
            {/* Highlights */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Key Achievements</h3>
              <ul className="space-y-3">
                {term.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-gray-600">
                    <span className="text-amber-400 shrink-0 mt-0.5">★</span>
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            {/* Term info */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h3 className="text-sm font-semibold text-gray-900">Term Details</h3>
              <div>
                <p className="text-xs text-gray-400">Period</p>
                <p className="text-sm font-medium text-gray-800">{term.label}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Committee size</p>
                <p className="text-sm font-medium text-gray-800">{term.members.length} members</p>
              </div>
            </div>

            {/* Current committee CTA */}
            <Link
              href="/committee"
              className="flex items-center justify-between w-full rounded-xl border-2 border-blue-100 bg-blue-50 px-4 py-3 hover:border-blue-300 transition-colors group"
            >
              <div>
                <p className="text-xs text-blue-500 font-medium">Looking for</p>
                <p className="text-sm font-semibold text-blue-700">Current Committee →</p>
              </div>
              <span className="text-xs text-blue-400 font-medium">2024–2026</span>
            </Link>
          </div>
        </div>

        {/* Prev / Next term navigation */}
        <div className="mt-10 flex gap-4">
          {newer ? (
            <Link
              href={`/committee/history/${newer.slug}`}
              className="flex-1 flex items-center gap-3 rounded-xl border border-gray-100 bg-white p-4 hover:shadow-sm transition-shadow"
            >
              <svg
                className="w-5 h-5 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <div>
                <p className="text-xs text-gray-400">Newer</p>
                <p className="font-medium text-gray-900 text-sm">Term {newer.label}</p>
              </div>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
          {older ? (
            <Link
              href={`/committee/history/${older.slug}`}
              className="flex-1 flex items-center justify-end gap-3 rounded-xl border border-gray-100 bg-white p-4 hover:shadow-sm transition-shadow text-right"
            >
              <div>
                <p className="text-xs text-gray-400">Older</p>
                <p className="font-medium text-gray-900 text-sm">Term {older.label}</p>
              </div>
              <svg
                className="w-5 h-5 text-gray-400 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          ) : (
            <div className="flex-1" />
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Past Member Card ─────────────────────────────────────────────────────────

function PastMemberCard({ member }: { member: PastMember }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
      <div
        className={`w-10 h-10 rounded-xl ${member.avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0 select-none`}
      >
        {member.initials}
      </div>
      <div className="min-w-0">
        <span className="inline-block px-2 py-0.5 rounded-full bg-white border border-gray-200 text-gray-600 text-[10px] font-semibold mb-0.5">
          {member.roleShort}
        </span>
        <p className="font-medium text-gray-900 text-sm leading-tight truncate">{member.name}</p>
        <p className="text-xs text-gray-400 truncate">
          {member.batch} · {member.company}
        </p>
      </div>
    </div>
  );
}
