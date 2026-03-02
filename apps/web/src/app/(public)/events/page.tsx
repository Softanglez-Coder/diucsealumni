import type { Metadata } from 'next';
import Link from 'next/link';

import type { EventItem } from '@/lib/api/events.server';
import { listEvents } from '@/lib/api/events.server';

export const metadata: Metadata = {
  title: 'Events — CSE DIU Alumni',
  description:
    'Browse upcoming and past events from the CSE DIU Alumni network — reunions, tech talks, career fairs, and more.',
  openGraph: {
    title: 'Events — CSE DIU Alumni',
    description: 'Reunions, tech talks, career fairs, and more. RSVP and stay connected.',
  },
};

// ─── Data transformation ──────────────────────────────────────────────────────

function formatEventDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function formatEventTime(startIso: string, endIso: string | null): string {
  const startTime = new Date(startIso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  if (!endIso) return startTime;
  const endTime = new Date(endIso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${startTime} – ${endTime}`;
}

function isUpcoming(startAt: string): boolean {
  return new Date(startAt) >= new Date();
}

function getLocationType(event: EventItem): 'in-person' | 'virtual' {
  return event.isVirtual ? 'virtual' : 'in-person';
}

function getDisplayLocation(event: EventItem): string {
  if (event.isVirtual) return event.virtualLink ? 'Online' : 'Virtual';
  return event.location ?? 'TBA';
}

// ─── Helper components ────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: 'in-person' | 'virtual' }) {
  const styles = {
    'in-person': 'bg-green-100 text-green-700',
    virtual: 'bg-blue-100 text-blue-700',
  } as const;
  const labels = { 'in-person': 'In-person', virtual: 'Virtual' };
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

function EventCard({ event }: { event: EventItem }) {
  const upcoming = isUpcoming(event.startAt);
  const rsvpCount = event._count.rsvps;
  const full = event.seatLimit !== null && rsvpCount >= event.seatLimit;
  const locationType = getLocationType(event);
  const displayLocation = getDisplayLocation(event);

  return (
    <article className="flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Status colour bar */}
      <div className={`h-1.5 ${upcoming ? 'bg-blue-600' : 'bg-gray-300'}`} aria-hidden="true" />

      <div className="flex flex-col flex-1 p-6 gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <TypeBadge type={locationType} />
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
              {formatEventDate(event.startAt)} · {formatEventTime(event.startAt, event.endAt)}
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
            <span className="line-clamp-1">{displayLocation}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 flex-1">
          {event.description}
        </p>

        {/* Seat availability */}
        {upcoming && event.seatLimit && <SeatBar count={rsvpCount} limit={event.seatLimit} />}
        {upcoming && !event.seatLimit && (
          <p className="text-xs text-gray-400">{rsvpCount} attending · Open registration</p>
        )}

        {/* CTA */}
        {upcoming ? (
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

export default async function EventsPage() {
  // Fetch upcoming and past events in parallel from the real database
  const [upcomingResult, pastResult] = await Promise.allSettled([
    listEvents({ upcoming: true, limit: 50 }),
    listEvents({ upcoming: false, limit: 50 }),
  ]);

  const upcomingEvents = upcomingResult.status === 'fulfilled' ? upcomingResult.value.events : [];
  const pastEvents = pastResult.status === 'fulfilled' ? pastResult.value.events : [];
  const totalRsvps = [...upcomingEvents, ...pastEvents].reduce((sum, e) => sum + e._count.rsvps, 0);

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
              { value: `${upcomingEvents.length}`, label: 'Upcoming events' },
              { value: `${totalRsvps}+`, label: 'Total RSVPs' },
              { value: `${upcomingEvents.length + pastEvents.length}`, label: 'Total events' },
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
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({upcomingEvents.length})
            </span>
          </h2>
          {upcomingEvents.length === 0 ? (
            <p className="text-sm text-gray-400 py-10 text-center border border-dashed border-gray-200 rounded-2xl">
              No upcoming events at the moment. Check back soon!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Past */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Past events
              <span className="ml-2 text-sm font-normal text-gray-400">({pastEvents.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
