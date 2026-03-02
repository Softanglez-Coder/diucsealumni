import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'News & Updates — CSE DIU Alumni',
  description:
    'Stay up to date with department news, alumni achievements, and platform announcements from CSE DIU Alumni.',
  openGraph: {
    title: 'News & Updates — CSE DIU Alumni',
    description: 'Alumni achievements, department news, and platform announcements.',
  },
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readMinutes: number;
  category: string;
  featured: boolean;
  tag?: string;
}

// ─── Placeholder data ─────────────────────────────────────────────────────────

const ARTICLES: Article[] = [
  {
    id: '1',
    slug: 'alumni-cto-appointment-2025',
    title: 'CSE Alumnus Md. Rakibul Islam Appointed CTO at Leading Fintech',
    excerpt:
      "Batch 2014 alumnus Rakibul Islam has been appointed Chief Technology Officer at Paywell Technologies, one of Bangladesh's fastest-growing fintech companies — a proud milestone for our community.",
    author: 'Editorial Team',
    publishedAt: 'Feb 28, 2025',
    readMinutes: 3,
    category: 'Alumni Achievement',
    featured: true,
    tag: 'Featured',
  },
  {
    id: '2',
    slug: 'annual-reunion-recap-2024',
    title: 'Annual Alumni Reunion 2024 — A Night to Remember',
    excerpt:
      'Over 200 alumni gathered at DIU Permanent Campus for the 2024 reunion. Highlights include the Outstanding Alumnus Award ceremony and a panel on career trends in tech.',
    author: 'Events Team',
    publishedAt: 'Feb 20, 2025',
    readMinutes: 5,
    category: 'Event Recap',
    featured: false,
  },
  {
    id: '3',
    slug: 'new-mentorship-programme-2025',
    title: 'Introducing the 2025 Mentorship Programme — Applications Open',
    excerpt:
      '40+ experienced alumni have signed up as mentors for the 2025 cohort. Applications for mentees are now open. Deadline: March 31, 2025.',
    author: 'Platform Team',
    publishedAt: 'Feb 15, 2025',
    readMinutes: 2,
    category: 'Announcement',
    featured: false,
    tag: 'New',
  },
  {
    id: '4',
    slug: 'research-publication-aiub-2025',
    title: 'Alumni Co-author Research Paper Published in IEEE Transactions',
    excerpt:
      'Farzana Haque (Batch 2016) and her team published a paper on distributed fault-tolerant systems in IEEE Transactions on Parallel and Distributed Systems.',
    author: 'Editorial Team',
    publishedAt: 'Feb 10, 2025',
    readMinutes: 4,
    category: 'Alumni Achievement',
    featured: false,
  },
  {
    id: '5',
    slug: 'membership-card-launch',
    title: 'Digital Membership Cards Are Here — Download Yours Now',
    excerpt:
      'Approved members can now generate and download their official digital membership card including a unique QR code for verification. Log in to your portal to get yours.',
    author: 'Platform Team',
    publishedAt: 'Feb 5, 2025',
    readMinutes: 2,
    category: 'Platform Update',
    featured: false,
    tag: 'New',
  },
  {
    id: '6',
    slug: 'job-board-launch',
    title: 'Alumni Job Board Now Live — Post & Discover Opportunities',
    excerpt:
      'The CSE DIU Alumni job board is officially live. Alumni and companies can now post job openings directly on the platform. All postings are reviewed before publishing.',
    author: 'Platform Team',
    publishedAt: 'Jan 28, 2025',
    readMinutes: 2,
    category: 'Platform Update',
    featured: false,
  },
];

const CATEGORIES = ['All', 'Alumni Achievement', 'Announcement', 'Event Recap', 'Platform Update'];

// ─── Article card ─────────────────────────────────────────────────────────────

function ArticleCard({ article, large }: { article: Article; large?: boolean }) {
  return (
    <article
      className={`flex flex-col rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden ${large ? 'sm:flex-row' : ''}`}
    >
      {/* Colour accent */}
      <div
        className={`shrink-0 ${large ? 'sm:w-2 w-full h-1.5' : 'h-1.5'} bg-blue-600`}
        aria-hidden="true"
      />

      <div className="flex flex-col flex-1 p-6 gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-gray-500 bg-gray-100 rounded-full px-2.5 py-0.5">
            {article.category}
          </span>
          {article.tag && (
            <span className="text-xs font-semibold text-blue-700 bg-blue-100 rounded-full px-2.5 py-0.5">
              {article.tag}
            </span>
          )}
        </div>

        <div className="space-y-2 flex-1">
          <h3
            className={`font-semibold text-gray-900 leading-snug ${large ? 'text-lg' : 'text-base'}`}
          >
            {article.title}
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{article.excerpt}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400 space-x-2">
            <span>{article.publishedAt}</span>
            <span aria-hidden="true">·</span>
            <span>{article.readMinutes} min read</span>
            <span aria-hidden="true">·</span>
            <span>{article.author}</span>
          </div>
          <Link
            href={`/news/${article.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
          >
            Read
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
        </div>
      </div>
    </article>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NewsPage() {
  const featured = ARTICLES.filter((a) => a.featured);
  const rest = ARTICLES.filter((a) => !a.featured);

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
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
            News &amp; Updates
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Stories from our community</h1>
          <p className="mt-4 text-blue-100 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Alumni achievements, department announcements, event recaps, and platform updates — all
            in one place.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 space-y-14">
        {/* Category filter — static, client filter would be done with a client component or query params */}
        <nav aria-label="Filter by category">
          <ul className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat, idx) => (
              <li key={cat}>
                <span
                  className={`inline-flex cursor-default items-center rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                    idx === 0
                      ? 'bg-blue-700 border-blue-700 text-white'
                      : 'border-gray-200 text-gray-600 hover:border-gray-400'
                  }`}
                >
                  {cat}
                </span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Featured */}
        {featured.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Featured</h2>
            <div className="space-y-4">
              {featured.map((a) => (
                <ArticleCard key={a.id} article={a} large />
              ))}
            </div>
          </section>
        )}

        {/* All articles */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Latest
            <span className="ml-2 text-sm font-normal text-gray-400">({rest.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="rounded-2xl bg-blue-50 border border-blue-100 px-8 py-10 text-center">
          <h2 className="text-lg font-bold text-gray-900">Get news in your inbox</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Subscribe to the CSE DIU Alumni newsletter and receive a weekly digest of the most
            important updates.
          </p>
          <Link
            href="/auth/register"
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-700 text-white font-semibold text-sm hover:bg-blue-800 transition-colors"
          >
            Apply for membership to subscribe
          </Link>
        </section>
      </div>
    </>
  );
}
