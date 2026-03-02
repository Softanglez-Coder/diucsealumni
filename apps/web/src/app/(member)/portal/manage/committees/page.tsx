'use client';

import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Designation {
  id: string;
  title: string;
  shortTitle: string;
  rank: number; // lower = higher precedence in display
  permissions: string[]; // permission names granted to this designation
  description: string;
}

interface CommitteeMemberEntry {
  memberId: string;
  memberName: string;
  memberEmail: string;
  batch: string;
  designationId: string;
  since: string;
}

interface Committee {
  id: string;
  name: string;
  description: string;
  term: string;
  isActive: boolean;
  createdAt: string;
  members: CommitteeMemberEntry[];
}

// ─── Default designations catalog (shared with designations page) ─────────────

const DESIGNATIONS: Designation[] = [
  {
    id: 'd1',
    title: 'President',
    shortTitle: 'President',
    rank: 1,
    permissions: ['committees:manage', 'events:create', 'events:update', 'news:publish'],
    description: 'Leads the committee with full decision-making authority.',
  },
  {
    id: 'd2',
    title: 'Vice President',
    shortTitle: 'VP',
    rank: 2,
    permissions: ['events:create', 'events:update', 'news:create'],
    description: 'Assists the President and acts in their absence.',
  },
  {
    id: 'd3',
    title: 'General Secretary',
    shortTitle: 'Gen. Secretary',
    rank: 3,
    permissions: ['events:create', 'news:create', 'members:list'],
    description: 'Manages records, minutes, and day-to-day operations.',
  },
  {
    id: 'd4',
    title: 'Joint Secretary',
    shortTitle: 'Joint Secy.',
    rank: 4,
    permissions: ['events:create', 'news:create'],
    description: 'Assists the General Secretary.',
  },
  {
    id: 'd5',
    title: 'Treasurer',
    shortTitle: 'Treasurer',
    rank: 5,
    permissions: ['donations:view-reports'],
    description: 'Manages financial records and reporting.',
  },
  {
    id: 'd6',
    title: 'Organizing Secretary',
    shortTitle: 'Org. Secretary',
    rank: 6,
    permissions: ['events:create', 'events:update', 'events:export-attendees'],
    description: 'Plans and executes events.',
  },
  {
    id: 'd7',
    title: 'Member',
    shortTitle: 'Member',
    rank: 99,
    permissions: [],
    description: 'General committee member.',
  },
];

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_COMMITTEES: Committee[] = [
  {
    id: 'c1',
    name: 'Executive Committee',
    description:
      'The governing body of the CSE DIU Alumni Association, responsible for overall strategic direction and operations.',
    term: '2024 – 2026',
    isActive: true,
    createdAt: 'Jan 1, 2024',
    members: [
      {
        memberId: 'm1',
        memberName: 'Dr. Mohammed Rafiqul Islam',
        memberEmail: 'president@csediualumni.com',
        batch: '2008',
        designationId: 'd1',
        since: 'Jan 1, 2024',
      },
      {
        memberId: 'm2',
        memberName: 'Nusrat Jahan',
        memberEmail: 'vp@csediualumni.com',
        batch: '2012',
        designationId: 'd2',
        since: 'Jan 1, 2024',
      },
      {
        memberId: 'm3',
        memberName: 'Farhan Ahmed',
        memberEmail: 'secretary@csediualumni.com',
        batch: '2015',
        designationId: 'd3',
        since: 'Jan 1, 2024',
      },
    ],
  },
  {
    id: 'c2',
    name: 'Technical Affairs Sub-Committee',
    description: 'Oversees the platform, technical workshops, and the job board.',
    term: '2025 – 2026',
    isActive: true,
    createdAt: 'Mar 1, 2025',
    members: [
      {
        memberId: 'm4',
        memberName: 'Fahad Rahman',
        memberEmail: 'fahad@example.com',
        batch: '2017',
        designationId: 'd1',
        since: 'Mar 1, 2025',
      },
      {
        memberId: 'm5',
        memberName: 'Lina Chowdhury',
        memberEmail: 'lina@example.com',
        batch: '2015',
        designationId: 'd7',
        since: 'Mar 1, 2025',
      },
    ],
  },
];

// ─── Available members (would come from API) ──────────────────────────────────

const AVAILABLE_MEMBERS = [
  { id: 'm6', name: 'Arif Hossain', email: 'arif@example.com', batch: '2018' },
  { id: 'm7', name: 'Sabiha Akter', email: 'sabiha@example.com', batch: '2019' },
  { id: 'm8', name: 'Rakibul Islam', email: 'rakib@example.com', batch: '2020' },
  { id: 'm9', name: 'Nadia Parvin', email: 'nadia@example.com', batch: '2020' },
  { id: 'm4', name: 'Fahad Rahman', email: 'fahad@example.com', batch: '2017' },
  { id: 'm5', name: 'Lina Chowdhury', email: 'lina@example.com', batch: '2015' },
];

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition';

// ─── Add Member Modal ─────────────────────────────────────────────────────────

function AddMemberModal({
  committeeId,
  existingMemberIds,
  onAdd,
  onClose,
}: {
  committeeId: string;
  existingMemberIds: string[];
  onAdd: (committeeId: string, entry: CommitteeMemberEntry) => void;
  onClose: () => void;
}) {
  const [memberId, setMemberId] = useState('');
  const [designationId, setDesignationId] = useState('d7');
  const [since, setSince] = useState(new Date().toISOString().split('T')[0] ?? '');

  const available = AVAILABLE_MEMBERS.filter((m) => !existingMemberIds.includes(m.id));
  const selectedMember = available.find((m) => m.id === memberId);

  function handleAdd() {
    if (!memberId || !designationId || !selectedMember) return;
    const entry: CommitteeMemberEntry = {
      memberId,
      memberName: selectedMember.name,
      memberEmail: selectedMember.email,
      batch: selectedMember.batch,
      designationId,
      since,
    };
    onAdd(committeeId, entry);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-gray-900">Add member to committee</h2>
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

        <div className="space-y-4">
          <div>
            <label
              htmlFor="select-member"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Select member
            </label>
            <select
              id="select-member"
              className={inputCls}
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
            >
              <option value="">— Choose a member —</option>
              {available.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} (Batch {m.batch})
                </option>
              ))}
            </select>
            {available.length === 0 && (
              <p className="mt-1 text-xs text-amber-600">
                All available members are already in this committee.
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="select-designation"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Designation
            </label>
            <select
              id="select-designation"
              className={inputCls}
              value={designationId}
              onChange={(e) => setDesignationId(e.target.value)}
            >
              {DESIGNATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
            {designationId && (
              <p className="mt-1.5 text-xs text-gray-400">
                {DESIGNATIONS.find((d) => d.id === designationId)?.description}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="since-date" className="block text-sm font-medium text-gray-700 mb-1.5">
              Member since
            </label>
            <input
              id="since-date"
              type="date"
              className={inputCls}
              value={since}
              onChange={(e) => setSince(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            disabled={!memberId || !designationId}
            onClick={handleAdd}
            className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Add to committee
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Committee Modal ───────────────────────────────────────────────────

function CreateCommitteeModal({
  onCreate,
  onClose,
}: {
  onCreate: (c: Committee) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [term, setTerm] = useState('2025 – 2026');

  function handleCreate() {
    if (!name.trim()) return;
    const newCommittee: Committee = {
      id: `c${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      term: term.trim(),
      isActive: true,
      createdAt: new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      members: [],
    };
    onCreate(newCommittee);
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-gray-900">Create committee</h2>
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

        <div className="space-y-4">
          <div>
            <label
              htmlFor="committee-name"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Committee name <span className="text-red-500">*</span>
            </label>
            <input
              id="committee-name"
              type="text"
              className={inputCls}
              placeholder="e.g. Academic Affairs Sub-Committee"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="committee-description"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="committee-description"
              rows={3}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition resize-none"
              placeholder="Brief description of this committee's purpose…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="committee-term"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Term
            </label>
            <input
              id="committee-term"
              type="text"
              className={inputCls}
              placeholder="e.g. 2025 – 2026"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            disabled={!name.trim()}
            onClick={handleCreate}
            className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Create committee
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Committee detail panel ───────────────────────────────────────────────────

function CommitteeDetail({
  committee,
  onBack,
  onAddMember,
  onRemoveMember,
  onChangeDesignation,
}: {
  committee: Committee;
  onBack: () => void;
  onAddMember: (committeeId: string, entry: CommitteeMemberEntry) => void;
  onRemoveMember: (committeeId: string, memberId: string) => void;
  onChangeDesignation: (committeeId: string, memberId: string, designationId: string) => void;
}) {
  const [showAddModal, setShowAddModal] = useState(false);

  const sortedMembers = [...committee.members].sort((a, b) => {
    const rankA = DESIGNATIONS.find((d) => d.id === a.designationId)?.rank ?? 99;
    const rankB = DESIGNATIONS.find((d) => d.id === b.designationId)?.rank ?? 99;
    return rankA - rankB;
  });

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        All committees
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl font-bold text-gray-900">{committee.name}</h1>
              {committee.isActive ? (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                  Active
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                  Inactive
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">{committee.description}</p>
            <p className="mt-2 text-xs text-gray-400">
              Term: {committee.term} · Created {committee.createdAt}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
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
            Add member
          </button>
        </div>
      </div>

      {/* Members table */}
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Members ({committee.members.length})
        </h2>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Member
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">
                  Batch
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Designation
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                  Since
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {sortedMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-10 text-center text-sm text-gray-400">
                    No members yet. Add the first member.
                  </td>
                </tr>
              )}
              {sortedMembers.map((m) => {
                return (
                  <tr key={m.memberId} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                          {m.memberName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{m.memberName}</p>
                          <p className="text-xs text-gray-400">{m.memberEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{m.batch}</td>
                    <td className="px-5 py-3">
                      <select
                        value={m.designationId}
                        onChange={(e) =>
                          onChangeDesignation(committee.id, m.memberId, e.target.value)
                        }
                        className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                        aria-label="Change designation"
                      >
                        {DESIGNATIONS.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.title}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-gray-500 hidden md:table-cell">{m.since}</td>
                    <td className="px-5 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onRemoveMember(committee.id, m.memberId)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <AddMemberModal
          committeeId={committee.id}
          existingMemberIds={committee.members.map((m) => m.memberId)}
          onAdd={onAddMember}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManageCommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>(SEED_COMMITTEES);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCommittee = committees.find((c) => c.id === selectedId) ?? null;

  function handleCreate(c: Committee) {
    setCommittees((prev) => [...prev, c]);
  }

  function handleAddMember(committeeId: string, entry: CommitteeMemberEntry) {
    setCommittees((prev) =>
      prev.map((c) => (c.id === committeeId ? { ...c, members: [...c.members, entry] } : c)),
    );
  }

  function handleRemoveMember(committeeId: string, memberId: string) {
    setCommittees((prev) =>
      prev.map((c) =>
        c.id === committeeId
          ? { ...c, members: c.members.filter((m) => m.memberId !== memberId) }
          : c,
      ),
    );
  }

  function handleChangeDesignation(committeeId: string, memberId: string, designationId: string) {
    setCommittees((prev) =>
      prev.map((c) =>
        c.id === committeeId
          ? {
              ...c,
              members: c.members.map((m) =>
                m.memberId === memberId ? { ...m, designationId } : m,
              ),
            }
          : c,
      ),
    );
  }

  function handleToggleActive(committeeId: string) {
    setCommittees((prev) =>
      prev.map((c) => (c.id === committeeId ? { ...c, isActive: !c.isActive } : c)),
    );
  }

  function handleDelete(committeeId: string) {
    setCommittees((prev) => prev.filter((c) => c.id !== committeeId));
    if (selectedId === committeeId) setSelectedId(null);
  }

  if (selectedCommittee !== null) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto">
        <CommitteeDetail
          committee={selectedCommittee}
          onBack={() => setSelectedId(null)}
          onAddMember={handleAddMember}
          onRemoveMember={handleRemoveMember}
          onChangeDesignation={handleChangeDesignation}
        />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-6xl mx-auto space-y-6">
      {/* Heading */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Committees</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create committees, add members with designations, and manage terms.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
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
          New committee
        </button>
      </div>

      {/* Committee cards */}
      {committees.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-16 text-center">
          <p className="text-gray-400 text-sm">No committees yet. Create the first one.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {committees.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-sm font-bold text-gray-900 truncate">{c.name}</h3>
                  {c.isActive ? (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                      Active
                    </span>
                  ) : (
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-500">
                      Inactive
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2">{c.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{c.term}</span>
              <span>·</span>
              <span>
                {c.members.length} member{c.members.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Top member chips */}
            <div className="flex flex-wrap gap-1.5">
              {[...c.members]
                .sort((a, b) => {
                  const ra = DESIGNATIONS.find((d) => d.id === a.designationId)?.rank ?? 99;
                  const rb = DESIGNATIONS.find((d) => d.id === b.designationId)?.rank ?? 99;
                  return ra - rb;
                })
                .slice(0, 3)
                .map((m) => (
                  <span
                    key={m.memberId}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium"
                  >
                    <span className="w-4 h-4 rounded-full bg-blue-200 flex items-center justify-center text-[9px] font-bold shrink-0">
                      {m.memberName.slice(0, 1)}
                    </span>
                    {DESIGNATIONS.find((d) => d.id === m.designationId)?.shortTitle ?? 'Member'}
                  </span>
                ))}
              {c.members.length > 3 && (
                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-400 text-xs">
                  +{c.members.length - 3}
                </span>
              )}
            </div>

            <div className="flex gap-2 pt-1 border-t border-gray-100">
              <button
                type="button"
                onClick={() => setSelectedId(c.id)}
                className="flex-1 px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-colors text-center"
              >
                Manage members
              </button>
              <button
                type="button"
                onClick={() => handleToggleActive(c.id)}
                className="px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {c.isActive ? 'Deactivate' : 'Activate'}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                className="px-3.5 py-1.5 rounded-xl border border-red-100 bg-red-50 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreateModal && (
        <CreateCommitteeModal onCreate={handleCreate} onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
}
