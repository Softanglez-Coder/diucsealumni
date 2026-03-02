import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Events — CSE DIU Alumni',
  description:
    'Browse upcoming and past events from the CSE DIU Alumni network — reunions, tech talks, career fairs, and more.',
  openGraph: {
    title: 'Events — CSE DIU Alumni',
    description: 'Reunions, tech talks, career fairs, and more. RSVP and stay connected.',
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'in-person' | 'virtual' | 'hybrid';
  category: string;
  description: string;
  rsvpCount: number;
  seatLimit: number | null;
  isUpcoming: boolean;
  badge?: string;
}

// ─── Placeholder data ─────────────────────────────────────────────────────────

const EVENTS: Event[] = [
  {
    id: '1',
    title: 'Annual Alumni Reunion 2025',
    date: 'March 15, 2025',
    time: '10:00 AM – 5:00 PM',
    location: 'DIU Permanent Campus, Ashulia',
    type: 'in-person',
    category: 'Reunion',
    description:
      'Our flagship yearly reunion bringing together alumni from all batches. Featuring networking sessions, panel discussions, and a gala dinner.',
    rsvpCount: 184,
    seatLimit: 250,
    isUpcoming: true,
    badge: 'Featured',
  },
  {
    id: '2',
    title: 'Tech Talk: AI & Machine Learning in Industry',
    date: 'March 22, 2025',
    time: '7:00 PM – 9:00 PM',
    location: 'Online (Zoom)',
    type: 'virtual',
    category: 'Tech Talk',
    description:
      'Industry experts share how ML is transforming product engineering. Q&A session at the end.',
    rsvpCount: 97,
    seatLimit: 200,
    isUpcoming: true,
  },
  {
    id: '3',
    title: 'Spring Career Fair 2025',
    date: 'April 5, 2025',
    time: '11:00 AM – 4:00 PM',
    location: 'DIU Permanent Campus, Hall A',
    type: 'in-person',
    category: 'Career',
    description:
      'Connect with top companies hiring fresh graduates. Bring your CV and meet recruiters in person.',
    rsvpCount: 56,
    seatLimit: 150,
    isUpcoming: true,
  },
  {
    id: '4',
    title: 'Mentorship Kick-Off Session',
    date: 'April 12, 2025',
    time: '6:00 PM – 8:00 PM',
    location: 'Online (Google Meet)',
    type: 'virtual',
    category: 'Mentorship',
    description:
      'Kick-off for the 2025 mentorship cohort. Mentors and mentees meet for the first time.',
    rsvpCount: 42,
    seatLimit: 80,
    isUpcoming: true,
  },
  {
    id: '5',
    title: 'Winter Reunion & Award Night 2024',
    date: 'December 20, 2024',
    time: '5:00 PM – 10:00 PM',
    location: 'Hotel The Cox Today, Cox&apos;s Bazar',
    type: 'in-person',
    category: 'Reunion',
    description:
      'Year-end celebration honoring alumni achievements with awards, dinner, and entertainment.',
    rsvpCount: 210,
    seatLimit: 210,
    isUpcoming: false,
  },
  {
    id: '6',
    title: 'Board Exam Preparation Workshop',
    date: 'November 10, 2024',
    time: '9:00 AM – 1:00 PM',
    location: 'DIU Permanent Campus, Lab 3',
    type: 'in-person',
    category: 'Workshop',
    description:
      'Expert alumni coaches guide current students through strategies for passing board examinations.',
    rsvpCount: 65,
    seatLimit: 70,
    isUpcoming: false,
  },
];

// ─── Helper components ────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: Event['type'] }) {
  const styles = {
    'in-person': 'bg-green-100 text-green-700',
    virtual: 'bg-blue-100 text-blue-700',
    hybrid: 'bg-purple-100 text-purple-700',
  } as const;
  const labels = { 'in-person': 'In-person', virtual: 'Virtual', hybrid: 'Hybrid' };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[type]}`}
    >
      {labels[type]}
    </span>
  );
}

function SeatBar({ count, limit }: { count: number; limit: number | null }) {
  if (!limit) return null;
  const pct = Math.min((count / limit) * 100, 100);
  const full = count >= limit;
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>{count} RSVPs</span>
        <span className={full ? 'text-red-600 font-medium' : ''}>
          {full ? 'Full' : `${limit - count} spots left`}
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${full ? 'bg-red-500' : (pct > 75 ? 'bg-amber-500' : 'bg-blue-500')}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const full = event.seatLimit !== null && event.rsvpCount >= event.seatLimit;
  return (
    <article className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Category colour bar */}
      <div
        className={`h-1.5 ${event.isUpcoming ? 'bg-blue-600' : 'bg-gray-300'}`}
        aria-hidden="true"
      />

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">
                {event.category}
              </span>
              <TypeBadge type={event.type} />
              {event.badge && (
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 rounded-full px-2.5 py-0.5">
                  {event.badge}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 leading-snug">{event.title}</h3>
          </div>
        </div>

        {/* Meta */}
        <div className="space-y-1.5 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>
              {event.date} · {event.time}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.75}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span className="line-clamp-1">{event.location}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {event.description}
        </p>

        {/* Seat availability */}
        {event.isUpcoming && event.seatLimit && (
          <SeatBar count={event.rsvpCount} limit={event.seatLimit} />
        )}
        {event.isUpcoming && !event.seatLimit && (
          <p className="text-xs text-gray-400">{event.rsvpCount} attending · Open registration</p>
        )}

        {/* CTA */}
        {event.isUpcoming ? (
          <Link
            href={`/auth/login?next=/events/${event.id}`}
            className={`mt-auto inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 ${
              full
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-700 text-white hover:bg-blue-800'
            }`}
            aria-disabled={full}
          >
            {full ? 'Event full' : 'RSVP — Sign in required'}
          </Link>
        ) : (
          <Link
            href={`/events/${event.id}`}
            className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            View photos &amp; recap
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const upcoming = EVENTS.filter((e) => e.isUpcoming);
  const past = EVENTS.filter((e) => !e.isUpcoming);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-800 via-blue-700 to-blue-600 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 text-xs font-medium text-blue-100 mb-5">
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
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            CSE DIU Alumni Events
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">
            Stay connected, stay inspired
          </h1>
          <p className="mt-4 text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Reunions, tech talks, career fairs, workshops, and more — all organized by and for the
            CSE DIU Alumni community.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold text-sm shadow-lg hover:bg-blue-50 transition-colors"
            >
              Sign in to RSVP
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center px-6 py-3 rounded-xl border border-white/30 text-white font-semibold text-sm hover:bg-white/10 transition-colors"
            >
              Apply for membership
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5">
          <dl className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-center">
            {[
              { value: `${upcoming.length}`, label: 'Upcoming events' },
              { value: `${EVENTS.reduce((s, e) => s + e.rsvpCount, 0)}+`, label: 'Total RSVPs' },
              { value: '50+', label: 'Events per year' },
            ].map(({ value, label }) => (
              <div key={label}>
                <dt className="text-2xl font-bold text-blue-700">{value}</dt>
                <dd className="text-xs text-gray-500 mt-0.5">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 space-y-16">
        {/* Upcoming */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Upcoming events
            <span className="ml-2 text-sm font-normal text-gray-400">({upcoming.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Past */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Past events
            <span className="ml-2 text-sm font-normal text-gray-400">({past.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {past.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
