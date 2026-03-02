import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'My Activity',
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface RsvpItem {
  id: string;
  eventTitle: string;
  date: string;
  location: string;
  status: 'upcoming' | 'attended' | 'cancelled';
}

interface DonationItem {
  id: string;
  campaign: string;
  amount: string;
  date: string;
  anonymous: boolean;
  receiptUrl?: string;
}

interface ForumPost {
  id: string;
  threadTitle: string;
  excerpt: string;
  date: string;
  replies: number;
  category: string;
}

interface MentorshipItem {
  id: string;
  role: 'mentor' | 'mentee';
  partnerName: string;
  topic: string;
  status: 'active' | 'completed' | 'pending';
  since: string;
}

// ─── Placeholder data (replace with API calls once auth is configured) ────────

const RSVPS: RsvpItem[] = [
  {
    id: '1',
    eventTitle: 'Annual Alumni Reunion 2026',
    date: 'March 15, 2026',
    location: 'DIU Permanent Campus, Ashulia',
    status: 'upcoming',
  },
  {
    id: '2',
    eventTitle: 'Tech Career Fair — Spring 2026',
    date: 'February 20, 2026',
    location: 'Online (Zoom)',
    status: 'attended',
  },
  {
    id: '3',
    eventTitle: 'CSE Department Open Day',
    date: 'January 10, 2026',
    location: 'DIU Permanent Campus',
    status: 'attended',
  },
];

const DONATIONS: DonationItem[] = [
  {
    id: '1',
    campaign: '🎓 Scholarships',
    amount: '৳ 2,000',
    date: 'Feb 14, 2026',
    anonymous: false,
    receiptUrl: '#',
  },
  {
    id: '2',
    campaign: '🖥️ Lab & Infrastructure',
    amount: '৳ 1,500',
    date: 'Dec 25, 2025',
    anonymous: true,
  },
];

const FORUM_POSTS: ForumPost[] = [
  {
    id: '1',
    threadTitle: 'Best resources for learning system design in 2026',
    excerpt: 'Ive been preparing for senior-level interviews and wanted to share the resources…',
    date: 'Mar 1, 2026',
    replies: 12,
    category: 'Career',
  },
  {
    id: '2',
    threadTitle: 'React vs. Next.js — when to use which?',
    excerpt: 'Starting a new project and debating architecture choices. Here are my thoughts…',
    date: 'Feb 22, 2026',
    replies: 8,
    category: 'Technology',
  },
];

const MENTORSHIPS: MentorshipItem[] = [
  {
    id: '1',
    role: 'mentor',
    partnerName: 'Farhan Hossain',
    topic: 'Backend development & career guidance',
    status: 'active',
    since: 'Jan 2026',
  },
  {
    id: '2',
    role: 'mentee',
    partnerName: 'Dr. Arif Rahman',
    topic: 'Research methodology & higher studies',
    status: 'completed',
    since: 'Jun 2025',
  },
];

// ─── Shared components ────────────────────────────────────────────────────────

function SectionHeader({
  title,
  count,
  href,
  linkLabel,
}: {
  title: string;
  count?: number;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2.5">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {count !== undefined && (
          <span className="inline-flex items-center justify-center min-w-[1.375rem] h-[1.375rem] px-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
            {count}
          </span>
        )}
      </div>
      {href && linkLabel && (
        <Link href={href} className="text-sm font-medium text-blue-600 hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}

function EmptyState({ message, href, cta }: { message: string; href?: string; cta?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 rounded-2xl bg-gray-50 border border-dashed border-gray-200 text-center px-4">
      <p className="text-sm text-gray-500 mb-3">{message}</p>
      {href && cta && (
        <Link
          href={href}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors"
        >
          {cta}
        </Link>
      )}
    </div>
  );
}

// ─── RSVP status badge ────────────────────────────────────────────────────────

const RSVP_STATUS: Record<RsvpItem['status'], { label: string; cls: string }> = {
  upcoming: { label: 'Upcoming', cls: 'bg-blue-50 text-blue-700' },
  attended: { label: 'Attended', cls: 'bg-green-50 text-green-700' },
  cancelled: { label: 'Cancelled', cls: 'bg-gray-100 text-gray-500' },
};

function RsvpCard({ item }: { item: RsvpItem }) {
  const badge = RSVP_STATUS[item.status];
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 text-blue-700 shrink-0">
        <CalendarIcon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">{item.eventTitle}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {item.date} · {item.location}
        </p>
      </div>
      <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${badge.cls}`}>
        {badge.label}
      </span>
    </div>
  );
}

// ─── Donation card ────────────────────────────────────────────────────────────

function DonationCard({ item }: { item: DonationItem }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-green-50 text-green-700 shrink-0">
        <HeartIcon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{item.campaign}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {item.date}
          {item.anonymous && ' · Anonymous'}
        </p>
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1">
        <span className="text-sm font-bold text-gray-900">{item.amount}</span>
        {item.receiptUrl && (
          <a
            href={item.receiptUrl}
            className="text-xs text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Receipt
          </a>
        )}
      </div>
    </div>
  );
}

// ─── Forum post card ──────────────────────────────────────────────────────────

function ForumPostCard({ item }: { item: ForumPost }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-purple-50 text-purple-700 shrink-0">
        <ChatIcon />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
            {item.category}
          </span>
          <span className="text-xs text-gray-400">{item.date}</span>
        </div>
        <p className="text-sm font-semibold text-gray-900 leading-snug">{item.threadTitle}</p>
        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.excerpt}</p>
      </div>
      <div className="shrink-0 flex items-center gap-1 text-xs text-gray-400">
        <ReplyIcon />
        {item.replies}
      </div>
    </div>
  );
}

// ─── Mentorship card ──────────────────────────────────────────────────────────

const MENTORSHIP_STATUS: Record<MentorshipItem['status'], { label: string; cls: string }> = {
  active: { label: 'Active', cls: 'bg-green-50 text-green-700' },
  completed: { label: 'Completed', cls: 'bg-gray-100 text-gray-600' },
  pending: { label: 'Pending', cls: 'bg-amber-50 text-amber-700' },
};

function MentorshipCard({ item }: { item: MentorshipItem }) {
  const badge = MENTORSHIP_STATUS[item.status];
  return (
    <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-amber-700 shrink-0">
        <MentorIcon />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{item.partnerName}</p>
        <p className="text-xs text-gray-500 mt-0.5">
          {item.role === 'mentor' ? 'You are mentoring' : 'Your mentor'} · {item.topic}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">Since {item.since}</p>
      </div>
      <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${badge.cls}`}>
        {badge.label}
      </span>
    </div>
  );
}

// ─── Summary stat ─────────────────────────────────────────────────────────────

function StatPill({ value, label }: { value: number | string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-5 py-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <span className="text-2xl font-bold text-gray-900">{value}</span>
      <span className="text-xs text-gray-500 text-center leading-tight">{label}</span>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function PortalActivityPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Activity</h1>
        <p className="mt-1 text-sm text-gray-500">
          A summary of your events, donations, forum contributions, and mentorships.
        </p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatPill value={RSVPS.length} label="Events RSVP'd" />
        <StatPill value={DONATIONS.length} label="Donations made" />
        <StatPill value={FORUM_POSTS.length} label="Forum posts" />
        <StatPill value={MENTORSHIPS.length} label="Mentorships" />
      </div>

      {/* RSVPs */}
      <section aria-labelledby="rsvps-heading">
        <SectionHeader
          title="Event RSVPs"
          count={RSVPS.length}
          href="/events"
          linkLabel="Browse events →"
        />
        {RSVPS.length === 0 ? (
          <EmptyState
            message="You haven't RSVP'd to any events yet."
            href="/events"
            cta="Browse upcoming events"
          />
        ) : (
          <div className="space-y-3">
            {RSVPS.map((item) => (
              <RsvpCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Donations */}
      <section aria-labelledby="donations-heading">
        <SectionHeader
          title="Donations"
          count={DONATIONS.length}
          href="/donate"
          linkLabel="Donate →"
        />
        {DONATIONS.length === 0 ? (
          <EmptyState
            message="You haven't made any donations yet."
            href="/donate"
            cta="View fundraising campaigns"
          />
        ) : (
          <div className="space-y-3">
            {DONATIONS.map((item) => (
              <DonationCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Forum posts */}
      <section aria-labelledby="forum-heading">
        <SectionHeader
          title="Forum posts"
          count={FORUM_POSTS.length}
          href="/forum"
          linkLabel="Go to forum →"
        />
        {FORUM_POSTS.length === 0 ? (
          <EmptyState
            message="You haven't posted in the forum yet."
            href="/forum"
            cta="Start a discussion"
          />
        ) : (
          <div className="space-y-3">
            {FORUM_POSTS.map((item) => (
              <ForumPostCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* Mentorships */}
      <section aria-labelledby="mentorship-heading">
        <SectionHeader
          title="Mentorship"
          count={MENTORSHIPS.length}
          href="/mentorship"
          linkLabel="Mentorship programme →"
        />
        {MENTORSHIPS.length === 0 ? (
          <EmptyState
            message="You're not part of any mentorship yet."
            href="/mentorship"
            cta="Explore mentorship"
          />
        ) : (
          <div className="space-y-3">
            {MENTORSHIPS.map((item) => (
              <MentorshipCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CalendarIcon() {
  return (
    <svg
      className="w-5 h-5"
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
  );
}

function HeartIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}

function MentorIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}

function ReplyIcon() {
  return (
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
        d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
      />
    </svg>
  );
}
