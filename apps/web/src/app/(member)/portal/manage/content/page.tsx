'use client';

import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type ContentType = 'news' | 'event' | 'job';
type ContentStatus = 'draft' | 'published' | 'archived' | 'pending';

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  author: string;
  status: ContentStatus;
  updatedAt: string;
  slug?: string;
}

// ─── Placeholder data ─────────────────────────────────────────────────────────

const CONTENT: ContentItem[] = [
  {
    id: '1',
    type: 'news',
    title: 'Annual Reunion 2026 Recap',
    author: 'Admin',
    status: 'published',
    updatedAt: 'Mar 1, 2026',
    slug: 'annual-reunion-2026-recap',
  },
  {
    id: '2',
    type: 'news',
    title: 'New Lab Inaugurated at DIU Campus',
    author: 'Admin',
    status: 'draft',
    updatedAt: 'Feb 28, 2026',
  },
  {
    id: '3',
    type: 'event',
    title: 'Tech Career Fair — Spring 2026',
    author: 'Admin',
    status: 'published',
    updatedAt: 'Feb 15, 2026',
  },
  {
    id: '4',
    type: 'event',
    title: 'CSE DIU Alumni Networking Night',
    author: 'Moderator',
    status: 'draft',
    updatedAt: 'Mar 2, 2026',
  },
  {
    id: '5',
    type: 'job',
    title: 'Senior Backend Engineer at REVE Systems',
    author: 'Farhan Ahmed',
    status: 'pending',
    updatedAt: 'Mar 2, 2026',
  },
  {
    id: '6',
    type: 'job',
    title: 'Frontend Developer at a2i',
    author: 'Sabiha Akter',
    status: 'published',
    updatedAt: 'Mar 1, 2026',
  },
  {
    id: '7',
    type: 'news',
    title: 'Scholarship Applications Open',
    author: 'Admin',
    status: 'archived',
    updatedAt: 'Jan 20, 2026',
  },
  {
    id: '8',
    type: 'job',
    title: 'DevOps Engineer at Shajgoj',
    author: 'Imran Hasan',
    status: 'pending',
    updatedAt: 'Mar 2, 2026',
  },
];

const TYPE_COLORS: Record<ContentType, string> = {
  news: 'bg-blue-50 text-blue-700',
  event: 'bg-violet-50 text-violet-700',
  job: 'bg-emerald-50 text-emerald-700',
};

const STATUS_COLORS: Record<ContentStatus, string> = {
  published: 'bg-emerald-50 text-emerald-700',
  draft: 'bg-gray-100 text-gray-500',
  pending: 'bg-amber-50 text-amber-700',
  archived: 'bg-gray-100 text-gray-400',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function TypeBadge({ type }: { type: ContentType }) {
  return (
    <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${TYPE_COLORS[type]}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
}

function StatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManageContentPage() {
  const [items, setItems] = useState<ContentItem[]>(CONTENT);
  const [filterType, setFilterType] = useState<ContentType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ContentStatus | 'all'>('all');
  const [search, setSearch] = useState('');

  const filtered = items.filter((c) => {
    const matchType = filterType === 'all' || c.type === filterType;
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    const matchSearch = search === '' || c.title.toLowerCase().includes(search.toLowerCase());
    return matchType && matchStatus && matchSearch;
  });

  function handlePublish(id: string) {
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'published' as ContentStatus } : c)),
    );
  }

  function handleArchive(id: string) {
    setItems((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: 'archived' as ContentStatus } : c)),
    );
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  const pendingCount = items.filter((c) => c.status === 'pending').length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-6">
      {/* Heading */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage news articles, events, and job postings.
          </p>
        </div>
        <div className="flex gap-2">
          {(['News article', 'Event', 'Job posting'] as const)
            .map((label) => (
              <button
                key={label}
                type="button"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                {label}
              </button>
            ))
            .slice(0, 1)}
          <div className="relative group">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              New content ▾
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex gap-2">
          {(['all', 'news', 'event', 'job'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilterType(t)}
              className={`px-3.5 py-1.5 rounded-xl border text-sm font-medium transition-colors ${
                filterType === t
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t === 'all' ? 'All types' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-2 flex-wrap">
          {(['all', 'published', 'draft', 'pending', 'archived'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-1.5 rounded-xl border text-sm font-medium transition-colors ${
                filterStatus === s
                  ? 'border-blue-600 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {s === 'all' ? 'All statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
              {s === 'pending' && pendingCount > 0 && (
                <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="search"
          placeholder="Search by title…"
          className="w-full rounded-xl border border-gray-200 bg-white pl-9 pr-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Title
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">
                Type
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                Author
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                Updated
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">
                  No content matches your filter.
                </td>
              </tr>
            )}
            {filtered.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-medium text-gray-900 line-clamp-1">{item.title}</p>
                </td>
                <td className="px-5 py-3 hidden sm:table-cell">
                  <TypeBadge type={item.type} />
                </td>
                <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{item.author}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{item.updatedAt}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      Edit
                    </button>
                    {(item.status === 'draft' || item.status === 'pending') && (
                      <button
                        type="button"
                        onClick={() => handlePublish(item.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50 transition-colors"
                      >
                        Publish
                      </button>
                    )}
                    {item.status === 'published' && (
                      <button
                        type="button"
                        onClick={() => handleArchive(item.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-amber-600 hover:bg-amber-50 transition-colors"
                      >
                        Archive
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
