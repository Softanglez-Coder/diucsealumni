'use client';

import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type MemberStatus = 'active' | 'pending' | 'suspended' | 'rejected';

interface Member {
  id: string;
  name: string;
  email: string;
  batch: string;
  membershipNumber?: string;
  tier?: string;
  status: MemberStatus;
  joinedAt: string;
  location: string;
}

// ─── Placeholder data ─────────────────────────────────────────────────────────

const MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Arif Hossain',
    email: 'arif@example.com',
    batch: '2018',
    membershipNumber: 'CSEDIA-REG-2026-00141',
    tier: 'Regular',
    status: 'active',
    joinedAt: 'Jan 10, 2026',
    location: 'Dhaka',
  },
  {
    id: '2',
    name: 'Sabiha Akter',
    email: 'sabiha@example.com',
    batch: '2019',
    membershipNumber: 'CSEDIA-REG-2026-00140',
    tier: 'Regular',
    status: 'active',
    joinedAt: 'Jan 8, 2026',
    location: 'Chattogram',
  },
  {
    id: '3',
    name: 'Rakibul Islam',
    email: 'rakib@example.com',
    batch: '2020',
    status: 'pending',
    joinedAt: 'Mar 1, 2026',
    location: 'Dhaka',
  },
  {
    id: '4',
    name: 'Nadia Parvin',
    email: 'nadia@example.com',
    batch: '2020',
    status: 'pending',
    joinedAt: 'Mar 1, 2026',
    location: 'Sylhet',
  },
  {
    id: '5',
    name: 'Fahad Rahman',
    email: 'fahad@example.com',
    batch: '2017',
    membershipNumber: 'CSEDIA-LIF-2025-00088',
    tier: 'Life',
    status: 'active',
    joinedAt: 'Dec 5, 2025',
    location: 'Dhaka',
  },
  {
    id: '6',
    name: 'Tamanna Begum',
    email: 'tamanna@example.com',
    batch: '2016',
    status: 'suspended',
    joinedAt: 'Nov 20, 2025',
    location: 'Khulna',
    membershipNumber: 'CSEDIA-REG-2025-00075',
    tier: 'Regular',
  },
  {
    id: '7',
    name: 'Imran Hasan',
    email: 'imran@example.com',
    batch: '2021',
    status: 'pending',
    joinedAt: 'Mar 2, 2026',
    location: 'Dhaka',
  },
  {
    id: '8',
    name: 'Lina Chowdhury',
    email: 'lina@example.com',
    batch: '2015',
    membershipNumber: 'CSEDIA-HON-2024-00010',
    tier: 'Honorary',
    status: 'active',
    joinedAt: 'Jun 14, 2024',
    location: 'Abroad',
  },
];

const STATUS_COLORS: Record<MemberStatus, string> = {
  active: 'bg-emerald-50 text-emerald-700',
  pending: 'bg-amber-50 text-amber-700',
  suspended: 'bg-red-50 text-red-600',
  rejected: 'bg-gray-100 text-gray-500',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: MemberStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function ActionBtn({
  label,
  onClick,
  variant = 'default',
}: {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'danger' | 'success';
}) {
  const cls = {
    default: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
    danger: 'text-red-600 hover:bg-red-50',
    success: 'text-emerald-600 hover:bg-emerald-50',
  }[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${cls}`}
    >
      {label}
    </button>
  );
}

// ─── Member detail modal ──────────────────────────────────────────────────────

function MemberModal({
  member,
  onClose,
  onStatusChange,
}: {
  member: Member;
  onClose: () => void;
  onStatusChange: (id: string, status: MemberStatus) => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">{member.name}</h2>
            <p className="text-sm text-gray-500">{member.email}</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
          {[
            ['Batch', member.batch],
            ['Location', member.location],
            ['Joined', member.joinedAt],
            ['Status', null],
            ['Membership #', member.membershipNumber ?? '—'],
            ['Tier', member.tier ?? '—'],
          ].map(([k, v]) => (
            <div key={String(k)}>
              <dt className="text-xs font-medium text-gray-400 uppercase tracking-wider">{k}</dt>
              <dd className="mt-0.5 font-medium text-gray-900">
                {k === 'Status' ? <StatusBadge status={member.status} /> : v}
              </dd>
            </div>
          ))}
        </dl>

        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
          {member.status === 'pending' && (
            <>
              <button
                type="button"
                onClick={() => {
                  onStatusChange(member.id, 'active');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => {
                  onStatusChange(member.id, 'rejected');
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
              >
                Reject
              </button>
            </>
          )}
          {member.status === 'active' && (
            <button
              type="button"
              onClick={() => {
                onStatusChange(member.id, 'suspended');
                onClose();
              }}
              className="px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
            >
              Suspend
            </button>
          )}
          {member.status === 'suspended' && (
            <button
              type="button"
              onClick={() => {
                onStatusChange(member.id, 'active');
                onClose();
              }}
              className="px-4 py-2 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 text-sm font-semibold hover:bg-emerald-100 transition-colors"
            >
              Reinstate
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManageMembersPage() {
  const [members, setMembers] = useState<Member[]>(MEMBERS);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<MemberStatus | 'all'>('all');
  const [selected, setSelected] = useState<Member | null>(null);

  const filtered = members.filter((m) => {
    const matchSearch =
      search === '' ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      (m.membershipNumber ?? '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function handleStatusChange(id: string, status: MemberStatus) {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
  }

  const pendingCount = members.filter((m) => m.status === 'pending').length;

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-6">
      {/* Heading */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage membership applications and member statuses.
          </p>
        </div>
        <a
          href="#export"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 shadow-sm transition-colors"
        >
          <ExportIcon />
          Export CSV
        </a>
      </div>

      {/* Quick filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pending', 'active', 'suspended', 'rejected'] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-1.5 rounded-xl border text-sm font-medium transition-colors ${
              filterStatus === s
                ? 'border-blue-600 bg-blue-50 text-blue-700'
                : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            {s === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
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
          placeholder="Search name, email, membership #…"
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
                Name
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">
                Membership #
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                Batch
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden lg:table-cell">
                Joined
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
                  No members match your filter.
                </td>
              </tr>
            )}
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                      {m.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-gray-500 hidden sm:table-cell font-mono text-xs">
                  {m.membershipNumber ?? <span className="text-gray-300 italic">Not issued</span>}
                </td>
                <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{m.batch}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={m.status} />
                </td>
                <td className="px-5 py-3 text-gray-500 hidden lg:table-cell">{m.joinedAt}</td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <ActionBtn label="View" onClick={() => setSelected(m)} />
                    {m.status === 'pending' && (
                      <>
                        <ActionBtn
                          label="Approve"
                          variant="success"
                          onClick={() => handleStatusChange(m.id, 'active')}
                        />
                        <ActionBtn
                          label="Reject"
                          variant="danger"
                          onClick={() => handleStatusChange(m.id, 'rejected')}
                        />
                      </>
                    )}
                    {m.status === 'active' && (
                      <ActionBtn
                        label="Suspend"
                        variant="danger"
                        onClick={() => handleStatusChange(m.id, 'suspended')}
                      />
                    )}
                    {m.status === 'suspended' && (
                      <ActionBtn
                        label="Reinstate"
                        variant="success"
                        onClick={() => handleStatusChange(m.id, 'active')}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected !== null && (
        <MemberModal
          member={selected}
          onClose={() => setSelected(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function ExportIcon() {
  return (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
      />
    </svg>
  );
}
