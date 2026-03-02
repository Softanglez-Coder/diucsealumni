import type { Metadata } from 'next';
import Link from 'next/link';

import { PAST_COMMITTEES } from '@/lib/committee-data';

export const metadata: Metadata = {
  title: 'Past Committees — CSE DIU Alumni',
  description:
    'Explore all past executive committees of the CSE DIU Alumni Association since its founding in 2018.',
};

export default function CommitteeHistoryPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-b from-gray-800 to-gray-700 text-white py-16 px-4">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/committee"
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
            Current Committee
          </Link>
          <h1 className="text-4xl font-bold tracking-tight mb-3">Past Committees</h1>
          <p className="text-lg text-gray-300">
            A record of every executive committee that has served since the association was founded
            in 2018. Their work built the community you see today.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 px-4">
        <div className="mx-auto max-w-4xl">
          {/* Current term at top as reference */}
          <div className="flex items-center gap-4 mb-10">
            <div className="flex flex-col items-center">
              <div className="w-4 h-4 rounded-full bg-blue-600 ring-4 ring-blue-100" />
              <div className="w-0.5 h-full bg-gray-200 mt-1" />
            </div>
            <Link
              href="/committee"
              className="flex-1 flex items-center justify-between rounded-2xl border-2 border-blue-200 bg-blue-50 px-6 py-4 hover:border-blue-400 transition-colors group"
            >
              <div>
                <span className="inline-block px-2 py-0.5 rounded-full bg-blue-600 text-white text-xs font-semibold mb-1">
                  Current
                </span>
                <h2 className="font-bold text-gray-900 text-lg">Term 2024 – 2026</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Led by Dr. Mohammed Rafiqul Islam as President
                </p>
              </div>
              <span className="text-blue-600 text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                View
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

          {/* Divider with label */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider whitespace-nowrap">
              Past Terms
            </span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Past terms */}
          <div className="space-y-6">
            {PAST_COMMITTEES.map((term, idx) => {
              const president = term.members.find(
                (m) => m.roleShort === 'President' || m.role.toLowerCase().includes('president'),
              );
              return (
                <div key={term.slug} className="flex items-start gap-4">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center pt-5 shrink-0">
                    <div className="w-3 h-3 rounded-full bg-gray-400 ring-2 ring-gray-100" />
                    {idx < PAST_COMMITTEES.length - 1 && (
                      <div className="w-0.5 flex-1 bg-gray-200 mt-1 min-h-[60px]" />
                    )}
                  </div>

                  {/* Card */}
                  <Link
                    href={`/committee/history/${term.slug}`}
                    className="flex-1 group rounded-2xl border border-gray-100 bg-white p-6 hover:shadow-md hover:border-gray-200 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h2 className="font-bold text-gray-900 text-lg mb-1">Term {term.label}</h2>
                        {president && (
                          <p className="text-sm text-gray-500 mb-3">
                            President:{' '}
                            <span className="font-medium text-gray-700">{president.name}</span>
                            {' · '}
                            {president.batch}
                          </p>
                        )}
                        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                          {term.description}
                        </p>

                        {/* Member avatars preview */}
                        <div className="flex items-center gap-1.5 mt-4">
                          {term.members.slice(0, 6).map((m) => (
                            <div
                              key={m.name}
                              title={m.name}
                              className={`w-7 h-7 rounded-full ${m.avatarColor} flex items-center justify-center text-white text-[10px] font-bold select-none shrink-0`}
                            >
                              {m.initials}
                            </div>
                          ))}
                          {term.members.length > 6 && (
                            <span className="text-xs text-gray-400 ml-1">
                              +{term.members.length - 6} more
                            </span>
                          )}
                          <span className="text-xs text-gray-400 ml-2">
                            {term.members.length} members
                          </span>
                        </div>
                      </div>

                      {/* Highlights preview */}
                      <div className="sm:w-56 shrink-0">
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-2">
                          Highlights
                        </p>
                        <ul className="space-y-1.5">
                          {term.highlights.slice(0, 2).map((h) => (
                            <li key={h} className="flex items-start gap-1.5 text-xs text-gray-500">
                              <span className="text-amber-400 shrink-0 mt-0.5">★</span>
                              <span className="line-clamp-2">{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1 text-xs text-blue-600 font-medium group-hover:gap-2 transition-all">
                      View full committee
                      <svg
                        className="w-3.5 h-3.5"
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
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Founding note */}
          <div className="mt-12 rounded-2xl bg-gray-50 border border-dashed border-gray-200 p-6 text-center">
            <p className="text-2xl mb-2">🏛️</p>
            <p className="text-sm text-gray-500">
              The CSE DIU Alumni Association was founded in{' '}
              <span className="font-semibold text-gray-700">2018</span>. The 2018–2020 committee was
              the founding term.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
