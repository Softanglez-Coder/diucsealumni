import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Discussion Forum — CSE DIU Alumni',
  description:
    'Join discussions on career, technology, campus life, and more with the CSE DIU Alumni community.',
  openGraph: {
    title: 'Discussion Forum — CSE DIU Alumni',
    description: 'Ask questions, share knowledge, and connect with the CSE DIU Alumni community.',
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  threadCount: number;
  latestActivity: string;
  color: string;
}

interface Thread {
  id: string;
  categoryId: string;
  categoryName: string;
  title: string;
  excerpt: string;
  author: string;
  authorBatch: string;
  postedAt: string;
  replyCount: number;
  upvotes: number;
  isPinned?: boolean;
  isHot?: boolean;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function CareerIcon() {
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
        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  );
}
function TechIcon() {
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
        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
      />
    </svg>
  );
}
function CampusIcon() {
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
        d="M12 14l9-5-9-5-9 5 9 5zm0 0v6m-4-3H8m8 3h.01M3 7l9 5 9-5"
      />
    </svg>
  );
}
function HelpIcon() {
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
        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}
function ProjectIcon() {
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
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
      />
    </svg>
  );
}
function MegaphoneIcon() {
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
        d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
      />
    </svg>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES: Category[] = [
  {
    id: 'career',
    name: 'Career & Jobs',
    description: 'Resume tips, interview prep, salary talk, career transitions.',
    icon: <CareerIcon />,
    threadCount: 142,
    latestActivity: '2 hours ago',
    color: 'blue',
  },
  {
    id: 'tech',
    name: 'Technology',
    description: 'Programming discussions, frameworks, open-source, side projects.',
    icon: <TechIcon />,
    threadCount: 218,
    latestActivity: '30 min ago',
    color: 'purple',
  },
  {
    id: 'campus',
    name: 'Campus Life',
    description: 'DIU memories, student questions, alumni perspectives.',
    icon: <CampusIcon />,
    threadCount: 87,
    latestActivity: '5 hours ago',
    color: 'green',
  },
  {
    id: 'help',
    name: 'Help & Support',
    description: 'Questions about the platform, membership, or events.',
    icon: <HelpIcon />,
    threadCount: 54,
    latestActivity: '1 day ago',
    color: 'amber',
  },
  {
    id: 'projects',
    name: 'Projects & Collaboration',
    description: 'Show your work, find co-founders, seek feedback.',
    icon: <ProjectIcon />,
    threadCount: 73,
    latestActivity: '3 hours ago',
    color: 'teal',
  },
  {
    id: 'announcements',
    name: 'Announcements',
    description: 'Official announcements from the platform and department.',
    icon: <MegaphoneIcon />,
    threadCount: 29,
    latestActivity: '2 days ago',
    color: 'red',
  },
];

const THREADS: Thread[] = [
  {
    id: '1',
    categoryId: 'tech',
    categoryName: 'Technology',
    title: "What's your current tech stack for production apps in 2025?",
    excerpt:
      "Curious what fellow alumni are using day-to-day. I've moved to Next.js + NestJS + Postgres and loving it.",
    author: 'Shuvo R.',
    authorBatch: 'Batch 2018',
    postedAt: '30 min ago',
    replyCount: 23,
    upvotes: 41,
    isHot: true,
  },
  {
    id: '2',
    categoryId: 'career',
    categoryName: 'Career & Jobs',
    title: 'How did you negotiate your first senior role offer?',
    excerpt:
      "Just got an offer for a Senior SWE position. First time negotiating at this level. Any advice from those who've done it?",
    author: 'Mehnaz A.',
    authorBatch: 'Batch 2020',
    postedAt: '2 hours ago',
    replyCount: 15,
    upvotes: 33,
  },
  {
    id: '3',
    categoryId: 'announcements',
    categoryName: 'Announcements',
    title: '📢 Digital Membership Cards are now available',
    excerpt:
      'You can now download your membership card from the portal. Go to Portal → Profile → Membership Card.',
    author: 'Platform Team',
    authorBatch: '',
    postedAt: '1 day ago',
    replyCount: 8,
    upvotes: 56,
    isPinned: true,
  },
  {
    id: '4',
    categoryId: 'projects',
    categoryName: 'Projects & Collaboration',
    title: 'Building an open-source Bangla NLP toolkit — looking for contributors',
    excerpt:
      'Working on a tokenizer and POS tagger for Bangla. Would love help from NLP-interested alumni. GitHub link in comments.',
    author: 'Farhan K.',
    authorBatch: 'Batch 2016',
    postedAt: '3 hours ago',
    replyCount: 11,
    upvotes: 27,
  },
  {
    id: '5',
    categoryId: 'campus',
    categoryName: 'Campus Life',
    title: 'Which professors shaped your career the most?',
    excerpt:
      'Thinking back on my time at DIU, a few professors really changed my perspective. Who were yours?',
    author: 'Nadia H.',
    authorBatch: 'Batch 2017',
    postedAt: '5 hours ago',
    replyCount: 34,
    upvotes: 48,
    isHot: true,
  },
  {
    id: '6',
    categoryId: 'tech',
    categoryName: 'Technology',
    title: 'Kubernetes vs. serverless for a mid-size SaaS — pros & cons?',
    excerpt:
      "We're scaling a B2B SaaS to ~5k users and debating between k8s and going fully serverless. Thoughts?",
    author: 'Imran T.',
    authorBatch: 'Batch 2015',
    postedAt: '6 hours ago',
    replyCount: 19,
    upvotes: 35,
  },
];

// ─── Category card ────────────────────────────────────────────────────────────

const CATEGORY_COLOR_STYLES: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700',
  purple: 'bg-purple-50 text-purple-700',
  green: 'bg-green-50 text-green-700',
  amber: 'bg-amber-50 text-amber-700',
  teal: 'bg-teal-50 text-teal-700',
  red: 'bg-red-50 text-red-700',
};

function CategoryCard({ cat }: { cat: Category }) {
  return (
    <Link
      href={`/auth/login?next=/forum/${cat.id}`}
      className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
    >
      <span
        className={`flex items-center justify-center w-10 h-10 rounded-xl shrink-0 ${CATEGORY_COLOR_STYLES[cat.color] ?? 'bg-gray-100 text-gray-600'}`}
      >
        {cat.icon}
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
          {cat.name}
        </h3>
        <p className="mt-0.5 text-xs text-gray-500 leading-relaxed line-clamp-2">
          {cat.description}
        </p>
        <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
          <span>{cat.threadCount} threads</span>
          <span aria-hidden="true">·</span>
          <span>Active {cat.latestActivity}</span>
        </div>
      </div>
    </Link>
  );
}

// ─── Thread row ───────────────────────────────────────────────────────────────

function ThreadRow({ thread }: { thread: Thread }) {
  return (
    <article className="flex items-start gap-4 rounded-xl border border-gray-100 bg-white px-5 py-4 shadow-sm hover:shadow-md transition-shadow">
      {/* Votes */}
      <div className="shrink-0 flex flex-col items-center gap-0.5 pt-0.5">
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
        <span className="text-xs font-semibold text-gray-600">{thread.upvotes}</span>
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">
            {thread.categoryName}
          </span>
          {thread.isPinned && (
            <span className="text-xs font-medium text-amber-700 bg-amber-100 rounded-full px-2.5 py-0.5">
              📌 Pinned
            </span>
          )}
          {thread.isHot && (
            <span className="text-xs font-medium text-red-700 bg-red-100 rounded-full px-2.5 py-0.5">
              🔥 Hot
            </span>
          )}
        </div>

        <Link
          href={`/auth/login?next=/forum/thread/${thread.id}`}
          className="block font-medium text-gray-900 hover:text-blue-700 transition-colors line-clamp-1"
        >
          {thread.title}
        </Link>
        <p className="text-sm text-gray-500 line-clamp-1">{thread.excerpt}</p>

        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>
            {thread.author}
            {thread.authorBatch ? ` · ${thread.authorBatch}` : ''}
          </span>
          <span aria-hidden="true">·</span>
          <span>{thread.postedAt}</span>
          <span aria-hidden="true">·</span>
          <span>{thread.replyCount} replies</span>
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ForumPage() {
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
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Discussion Forum
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Where the community talks</h1>
          <p className="mt-4 text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Ask questions, share knowledge, and connect with 1,200+ alumni across career,
            technology, campus life, and more.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-blue-700 font-semibold text-sm shadow-lg hover:bg-blue-50 transition-colors"
            >
              Sign in to participate
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
              { value: `${CATEGORIES.reduce((s, c) => s + c.threadCount, 0)}`, label: 'Threads' },
              { value: `${CATEGORIES.length}`, label: 'Categories' },
              { value: '1,200+', label: 'Members' },
            ].map(({ value, label }) => (
              <div key={label}>
                <dt className="text-2xl font-bold text-blue-700">{value}</dt>
                <dd className="text-xs text-gray-500 mt-0.5">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {/* Sign-in notice */}
        <div className="rounded-xl bg-blue-50 border border-blue-200 px-5 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 text-blue-600 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-sm text-blue-800">
              The forum is accessible to <strong>approved members only</strong>. Sign in to post,
              reply, and upvote.
            </p>
          </div>
          <Link
            href="/auth/login"
            className="shrink-0 inline-flex items-center px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Categories */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Browse by category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} />
            ))}
          </div>
        </section>

        {/* Recent threads */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent threads
              <span className="ml-2 text-sm font-normal text-gray-400">({THREADS.length})</span>
            </h2>
            <Link
              href="/auth/login?next=/forum"
              className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {THREADS.map((thread) => (
              <ThreadRow key={thread.id} thread={thread} />
            ))}
          </div>
        </section>

        {/* Community CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 px-8 py-10 text-center">
          <h2 className="text-lg font-bold text-gray-900">Ready to join the conversation?</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Apply for CSE DIU Alumni membership to post threads, reply, and vote on the forum.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors"
            >
              Apply for membership
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
