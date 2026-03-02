'use client';

import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type Permission = {
  id: string;
  name: string;
  description: string;
  resource: string;
};

interface Designation {
  id: string;
  title: string;
  shortTitle: string;
  rank: number;
  permissions: string[]; // permission names
  description: string;
  isSystem: boolean;
}

// ─── All platform permissions (subset for committee context) ─────────────────

const ALL_PERMISSIONS: Permission[] = [
  { id: 'p1', name: 'members:list', description: 'List all members', resource: 'Members' },
  { id: 'p2', name: 'members:view', description: 'View member profiles', resource: 'Members' },
  {
    id: 'p3',
    name: 'members:approve',
    description: 'Approve membership applications',
    resource: 'Members',
  },
  {
    id: 'p4',
    name: 'members:suspend',
    description: 'Suspend member accounts',
    resource: 'Members',
  },
  { id: 'p5', name: 'events:create', description: 'Create new events', resource: 'Events' },
  { id: 'p6', name: 'events:update', description: 'Update events', resource: 'Events' },
  { id: 'p7', name: 'events:delete', description: 'Delete events', resource: 'Events' },
  {
    id: 'p8',
    name: 'events:export-attendees',
    description: 'Export attendee lists',
    resource: 'Events',
  },
  { id: 'p9', name: 'news:create', description: 'Create news articles', resource: 'News' },
  { id: 'p10', name: 'news:publish', description: 'Publish news articles', resource: 'News' },
  { id: 'p11', name: 'news:delete', description: 'Delete news articles', resource: 'News' },
  { id: 'p12', name: 'forum:moderate', description: 'Moderate forum content', resource: 'Forum' },
  { id: 'p13', name: 'forum:delete-post', description: 'Delete forum posts', resource: 'Forum' },
  { id: 'p14', name: 'jobs:approve', description: 'Approve job postings', resource: 'Jobs' },
  {
    id: 'p15',
    name: 'donations:view-reports',
    description: 'View donation reports',
    resource: 'Donations',
  },
  {
    id: 'p16',
    name: 'committees:manage',
    description: 'Create and manage committees',
    resource: 'System',
  },
  {
    id: 'p17',
    name: 'designations:manage',
    description: 'Create and manage designations',
    resource: 'System',
  },
  {
    id: 'p18',
    name: 'roles:manage',
    description: 'Create, edit, and delete roles',
    resource: 'System',
  },
  { id: 'p19', name: 'audit-log:view', description: 'View the audit log', resource: 'System' },
];

const RESOURCES = [...new Set(ALL_PERMISSIONS.map((p) => p.resource))];

const SEED_DESIGNATIONS: Designation[] = [
  {
    id: 'd1',
    title: 'President',
    shortTitle: 'President',
    rank: 1,
    permissions: [
      'committees:manage',
      'events:create',
      'events:update',
      'news:publish',
      'members:list',
    ],
    description: 'Leads the committee with full decision-making authority.',
    isSystem: false,
  },
  {
    id: 'd2',
    title: 'Vice President',
    shortTitle: 'VP',
    rank: 2,
    permissions: ['events:create', 'events:update', 'news:create', 'members:list'],
    description: 'Assists the President and acts in their absence.',
    isSystem: false,
  },
  {
    id: 'd3',
    title: 'General Secretary',
    shortTitle: 'Gen. Secretary',
    rank: 3,
    permissions: ['events:create', 'news:create', 'members:list'],
    description: 'Manages records, minutes, and day-to-day operations.',
    isSystem: false,
  },
  {
    id: 'd4',
    title: 'Joint Secretary',
    shortTitle: 'Joint Secy.',
    rank: 4,
    permissions: ['events:create', 'news:create'],
    description: 'Assists the General Secretary.',
    isSystem: false,
  },
  {
    id: 'd5',
    title: 'Treasurer',
    shortTitle: 'Treasurer',
    rank: 5,
    permissions: ['donations:view-reports'],
    description: 'Manages financial records and reporting.',
    isSystem: false,
  },
  {
    id: 'd6',
    title: 'Organizing Secretary',
    shortTitle: 'Org. Secretary',
    rank: 6,
    permissions: ['events:create', 'events:update', 'events:export-attendees'],
    description: 'Plans and executes events and programmes.',
    isSystem: false,
  },
  {
    id: 'd7',
    title: 'Member',
    shortTitle: 'Member',
    rank: 99,
    permissions: [],
    description: 'General committee member with no additional system permissions.',
    isSystem: true,
  },
];

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition';

// ─── Designation form panel ───────────────────────────────────────────────────

function DesignationPanel({
  designation,
  onClose,
  onSave,
}: {
  designation: Designation | null;
  onClose: () => void;
  onSave: (d: Designation) => void;
}) {
  const isNew = designation === null;
  const [title, setTitle] = useState(designation?.title ?? '');
  const [shortTitle, setShortTitle] = useState(designation?.shortTitle ?? '');
  const [rank, setRank] = useState<number>(designation?.rank ?? 10);
  const [description, setDescription] = useState(designation?.description ?? '');
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(
    new Set(designation?.permissions ?? []),
  );

  function togglePerm(name: string, checked: boolean) {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (checked) next.add(name);
      else next.delete(name);
      return next;
    });
  }

  function handleSave() {
    if (!title.trim()) return;
    onSave({
      id: designation?.id ?? `d${Date.now()}`,
      title: title.trim(),
      shortTitle: shortTitle.trim() || title.trim(),
      rank,
      description: description.trim(),
      permissions: [...selectedPerms],
      isSystem: designation?.isSystem ?? false,
    });
    onClose();
  }

  const disabled = designation?.isSystem ?? false;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-gray-900/40"
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-lg bg-white shadow-2xl overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between gap-4">
          <h2 className="text-base font-bold text-gray-900">
            {isNew ? 'Create designation' : `Edit: ${designation.title}`}
          </h2>
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

        <div className="px-6 py-6 space-y-5">
          {disabled && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-xs text-amber-700">
              This is a system designation and cannot be modified.
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label
                htmlFor="desig-title"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Full title <span className="text-red-500">*</span>
              </label>
              <input
                id="desig-title"
                type="text"
                disabled={disabled}
                className={inputCls + (disabled ? ' opacity-50 cursor-not-allowed' : '')}
                placeholder="e.g. General Secretary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="desig-short"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Short title
              </label>
              <input
                id="desig-short"
                type="text"
                disabled={disabled}
                className={inputCls + (disabled ? ' opacity-50 cursor-not-allowed' : '')}
                placeholder="e.g. Gen. Sec."
                value={shortTitle}
                onChange={(e) => setShortTitle(e.target.value)}
              />
            </div>

            <div>
              <label
                htmlFor="desig-rank"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Display rank
              </label>
              <input
                id="desig-rank"
                type="number"
                min={1}
                disabled={disabled}
                className={inputCls + (disabled ? ' opacity-50 cursor-not-allowed' : '')}
                placeholder="1 = highest"
                value={rank}
                onChange={(e) => setRank(Number(e.target.value))}
              />
              <p className="mt-1 text-xs text-gray-400">Lower = displayed first (1 = top).</p>
            </div>

            <div className="col-span-2">
              <label
                htmlFor="desig-description"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Description
              </label>
              <textarea
                id="desig-description"
                rows={2}
                disabled={disabled}
                className={
                  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition resize-none' +
                  (disabled ? ' opacity-50 cursor-not-allowed' : '')
                }
                placeholder="What does this designation do?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>

          {/* Permissions */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-1">
              Permissions granted to this designation
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Any member with this designation will inherit these permissions in addition to their
              base role permissions.
            </p>

            <div className="space-y-6">
              {RESOURCES.map((resource) => (
                <div key={resource}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                    {resource}
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {ALL_PERMISSIONS.filter((p) => p.resource === resource).map((p) => (
                      <label
                        key={p.id}
                        className={`flex items-start gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <input
                          type="checkbox"
                          disabled={disabled}
                          checked={selectedPerms.has(p.name)}
                          onChange={(e) => togglePerm(p.name, e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                        />
                        <div>
                          <span className="block text-sm font-mono text-gray-800">{p.name}</span>
                          <span className="block text-xs text-gray-400">{p.description}</span>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
          {!disabled && (
            <button
              type="button"
              disabled={!title.trim()}
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isNew ? 'Create designation' : 'Save changes'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {disabled ? 'Close' : 'Cancel'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManageDesignationsPage() {
  const [designations, setDesignations] = useState<Designation[]>(SEED_DESIGNATIONS);
  const [panelOpen, setPanelOpen] = useState(false);
  const [editingDesignation, setEditingDesignation] = useState<Designation | null>(null);

  function openNew() {
    setEditingDesignation(null);
    setPanelOpen(true);
  }

  function openEdit(d: Designation) {
    setEditingDesignation(d);
    setPanelOpen(true);
  }

  function handleSave(updated: Designation) {
    setDesignations((prev) => {
      const exists = prev.find((d) => d.id === updated.id);
      if (exists) return prev.map((d) => (d.id === updated.id ? updated : d));
      return [...prev, updated];
    });
  }

  function handleDelete(id: string) {
    setDesignations((prev) => prev.filter((d) => d.id !== id));
  }

  const sorted = [...designations].sort((a, b) => a.rank - b.rank);

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-6">
      {/* Heading */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Designations</h1>
          <p className="mt-1 text-sm text-gray-500">
            Define committee roles, their display order, and the platform permissions they inherit.
          </p>
        </div>
        <button
          type="button"
          onClick={openNew}
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
          New designation
        </button>
      </div>

      {/* Info */}
      <div className="rounded-2xl border border-blue-100 bg-blue-50 px-5 py-4 flex items-start gap-3">
        <svg
          className="w-5 h-5 text-blue-500 mt-0.5 shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.75}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-sm text-blue-700">
          Designations are positions within a committee (e.g. President, Treasurer). Permissions
          assigned here are granted <strong>in addition</strong> to a member&apos;s base role
          permissions when they hold this designation. Display rank controls the order members
          appear on the public committee page.
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 w-12">
                Rank
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Designation
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden sm:table-cell">
                Short title
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 hidden md:table-cell">
                Permissions
              </th>
              <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sorted.map((d) => (
              <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3 text-center">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
                    {d.rank === 99 ? '—' : d.rank}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900">{d.title}</p>
                    {d.isSystem && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-400">
                        System
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{d.description}</p>
                </td>
                <td className="px-5 py-3 text-gray-500 hidden sm:table-cell font-medium">
                  {d.shortTitle}
                </td>
                <td className="px-5 py-3 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {d.permissions.length === 0 ? (
                      <span className="text-xs text-gray-300 italic">None</span>
                    ) : (
                      <>
                        {d.permissions.slice(0, 3).map((p) => (
                          <span
                            key={p}
                            className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 text-xs font-mono"
                          >
                            {p}
                          </span>
                        ))}
                        {d.permissions.length > 3 && (
                          <span className="px-1.5 py-0.5 rounded bg-gray-100 text-gray-400 text-xs">
                            +{d.permissions.length - 3}
                          </span>
                        )}
                      </>
                    )}
                  </div>
                </td>
                <td className="px-5 py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => openEdit(d)}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      {d.isSystem ? 'View' : 'Edit'}
                    </button>
                    {!d.isSystem && (
                      <button
                        type="button"
                        onClick={() => handleDelete(d.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {panelOpen && (
        <DesignationPanel
          designation={editingDesignation}
          onClose={() => setPanelOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
