import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Management Overview',
};

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  change,
  href,
  color = 'blue',
}: {
  label: string;
  value: string | number;
  change?: string;
  href?: string;
  color?: 'blue' | 'emerald' | 'amber' | 'violet' | 'rose';
}) {
  const colorMap = {
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-700',
    rose: 'bg-rose-50 text-rose-700',
  };

  const card = (
    <div
      className={`rounded-2xl border border-gray-100 bg-white shadow-sm p-5 hover:shadow-md transition-shadow ${href ? 'cursor-pointer' : ''}`}
    >
      <div
        className={`inline-flex items-center rounded-lg px-2 py-0.5 text-xs font-medium mb-3 ${colorMap[color]}`}
      >
        {label}
      </div>
      <div className="flex items-end gap-2">
        <span className="text-3xl font-bold text-gray-900">{value}</span>
        {change && <span className="mb-0.5 text-sm text-gray-400">{change}</span>}
      </div>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {card}
      </Link>
    );
  }
  return card;
}

// ─── Section shortcut ─────────────────────────────────────────────────────────

function ShortcutCard({
  href,
  icon,
  title,
  description,
  badge,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white shadow-sm p-5 hover:shadow-md hover:border-blue-100 transition-all group"
    >
      <span className="shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-100 transition-colors">
        {icon}
      </span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
            {title}
          </p>
          {badge !== undefined && badge > 0 && (
            <span className="inline-flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full bg-orange-100 text-orange-600 text-xs font-semibold">
              {badge}
            </span>
          )}
        </div>
        <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{description}</p>
      </div>
      <ArrowRightIcon />
    </Link>
  );
}

// ─── Recent activity row ──────────────────────────────────────────────────────

function ActivityRow({
  actor,
  action,
  target,
  time,
}: {
  actor: string;
  action: string;
  target: string;
  time: string;
}) {
  return (
    <li className="flex items-start gap-3 py-3">
      <div className="shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 uppercase">
        {actor.slice(0, 2)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800">
          <span className="font-medium">{actor}</span>{' '}
          <span className="text-gray-500">{action}</span>{' '}
          <span className="font-medium">{target}</span>
        </p>
        <p className="text-xs text-gray-400 mt-0.5">{time}</p>
      </div>
    </li>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManageOverviewPage() {
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-8">
      {/* Heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Management Overview</h1>
        <p className="mt-1 text-sm text-gray-500">
          Platform at a glance — memberships, content, roles, committees, and more.
        </p>
      </div>

      {/* Stats grid */}
      <section aria-labelledby="stats-heading">
        <h2
          id="stats-heading"
          className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4"
        >
          Platform stats
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <StatCard label="Total alumni" value="1,248" color="blue" href="/portal/manage/members" />
          <StatCard label="Active members" value="1,102" color="emerald" />
          <StatCard
            label="Pending approvals"
            value={14}
            change="+3 today"
            color="amber"
            href="/portal/manage/members"
          />
          <StatCard label="Upcoming events" value={5} color="violet" />
          <StatCard label="Donations (Mar)" value="৳ 48,500" color="rose" />
        </div>
      </section>

      {/* Shortcut cards */}
      <section aria-labelledby="sections-heading">
        <h2
          id="sections-heading"
          className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4"
        >
          Management sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <ShortcutCard
            href="/portal/manage/members"
            icon={<MembersIcon />}
            title="Members"
            description="Approve applications, manage membership status, export member list."
            badge={14}
          />
          <ShortcutCard
            href="/portal/manage/content"
            icon={<ContentIcon />}
            title="Content"
            description="Publish news, manage events and job postings, moderate forum content."
          />
          <ShortcutCard
            href="/portal/manage/roles"
            icon={<RolesIcon />}
            title="Roles & Permissions"
            description="Create roles, assign permissions, manage user role assignments."
          />
          <ShortcutCard
            href="/portal/manage/committees"
            icon={<CommitteeIcon />}
            title="Committees"
            description="Create committees, add members with designations, manage terms."
          />
          <ShortcutCard
            href="/portal/manage/designations"
            icon={<DesignationIcon />}
            title="Designations"
            description="Define committee designations and their associated permissions."
          />
        </div>
      </section>

      {/* Recent audit log entries */}
      <section aria-labelledby="activity-heading">
        <div className="flex items-center justify-between mb-4">
          <h2
            id="activity-heading"
            className="text-xs font-semibold uppercase tracking-widest text-gray-400"
          >
            Recent admin activity
          </h2>
          <Link
            href="/portal/manage/audit-log"
            className="text-xs text-blue-600 hover:underline font-medium"
          >
            View all →
          </Link>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6">
          <ul className="divide-y divide-gray-100" aria-label="Recent activity">
            <ActivityRow
              actor="Admin"
              action="approved membership for"
              target="Arif Hossain"
              time="2 minutes ago"
            />
            <ActivityRow
              actor="Moderator"
              action="pinned forum thread"
              target="'Best practices for NestJS'"
              time="18 minutes ago"
            />
            <ActivityRow
              actor="Admin"
              action="published news article"
              target="'Annual Reunion 2026 Recap'"
              time="1 hour ago"
            />
            <ActivityRow
              actor="Admin"
              action="assigned role Moderator to"
              target="Tahmina Khatun"
              time="3 hours ago"
            />
            <ActivityRow
              actor="Admin"
              action="created committee"
              target="'Technical Affairs Sub-Committee'"
              time="Yesterday"
            />
          </ul>
        </div>
      </section>
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function MembersIcon() {
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

function ContentIcon() {
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
        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
      />
    </svg>
  );
}

function RolesIcon() {
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
        d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
      />
    </svg>
  );
}

function CommitteeIcon() {
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
        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}

function DesignationIcon() {
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
        d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      className="w-4 h-4 shrink-0 text-gray-300 group-hover:text-blue-400 transition-colors mt-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}
