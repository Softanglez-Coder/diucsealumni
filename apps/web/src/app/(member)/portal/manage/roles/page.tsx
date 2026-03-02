'use client';

import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Permission {
  id: string;
  name: string; // e.g. "events:create"
  description: string;
  resource: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  isSystem: boolean;
  permissionIds: string[];
  userCount: number;
}

// ─── Seed data (matches the RBAC design doc) ──────────────────────────────────

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
  { id: 'p5', name: 'events:list', description: 'View all events', resource: 'Events' },
  { id: 'p6', name: 'events:create', description: 'Create new events', resource: 'Events' },
  { id: 'p7', name: 'events:update', description: 'Update events', resource: 'Events' },
  { id: 'p8', name: 'events:delete', description: 'Delete events', resource: 'Events' },
  {
    id: 'p9',
    name: 'events:export-attendees',
    description: 'Export attendee lists',
    resource: 'Events',
  },
  { id: 'p10', name: 'news:create', description: 'Create news articles', resource: 'News' },
  { id: 'p11', name: 'news:publish', description: 'Publish news articles', resource: 'News' },
  { id: 'p12', name: 'news:delete', description: 'Delete news articles', resource: 'News' },
  { id: 'p13', name: 'forum:moderate', description: 'Moderate forum content', resource: 'Forum' },
  { id: 'p14', name: 'forum:delete-post', description: 'Delete forum posts', resource: 'Forum' },
  { id: 'p15', name: 'jobs:approve', description: 'Approve job postings', resource: 'Jobs' },
  { id: 'p16', name: 'jobs:delete', description: 'Delete job postings', resource: 'Jobs' },
  {
    id: 'p17',
    name: 'donations:view-reports',
    description: 'View donation reports',
    resource: 'Donations',
  },
  {
    id: 'p18',
    name: 'roles:manage',
    description: 'Create, edit, and delete roles',
    resource: 'System',
  },
  {
    id: 'p19',
    name: 'permissions:manage',
    description: 'Assign and revoke permissions',
    resource: 'System',
  },
  { id: 'p20', name: 'users:manage', description: 'Manage user accounts', resource: 'System' },
  { id: 'p21', name: 'audit-log:view', description: 'View the audit log', resource: 'System' },
  {
    id: 'p22',
    name: 'committees:manage',
    description: 'Create and manage committees',
    resource: 'Committees',
  },
  {
    id: 'p23',
    name: 'designations:manage',
    description: 'Create and manage designations',
    resource: 'Committees',
  },
];

const INITIAL_ROLES: Role[] = [
  {
    id: 'r1',
    name: 'Super Admin',
    description: 'Holds every permission. Cannot be modified or deleted.',
    isSystem: true,
    permissionIds: ALL_PERMISSIONS.map((p) => p.id),
    userCount: 1,
  },
  {
    id: 'r2',
    name: 'Alumni',
    description: 'Default role assigned on membership approval.',
    isSystem: true,
    permissionIds: ['p1', 'p2', 'p5'],
    userCount: 1102,
  },
  {
    id: 'r3',
    name: 'Guest',
    description: 'Assigned to unverified or pending users. Public access only.',
    isSystem: true,
    permissionIds: [],
    userCount: 14,
  },
  {
    id: 'r4',
    name: 'Moderator',
    description: 'Can moderate content and manage forum threads.',
    isSystem: false,
    permissionIds: ['p1', 'p2', 'p5', 'p13', 'p14', 'p11', 'p9'],
    userCount: 5,
  },
  {
    id: 'r5',
    name: 'Content Editor',
    description: 'Can create and publish news articles and manage events.',
    isSystem: false,
    permissionIds: ['p10', 'p11', 'p12', 'p6', 'p7', 'p8'],
    userCount: 3,
  },
];

const RESOURCES = [...new Set(ALL_PERMISSIONS.map((p) => p.resource))];

// ─── Sub-components ───────────────────────────────────────────────────────────

function PermissionCheckbox({
  perm,
  checked,
  disabled,
  onChange,
}: {
  perm: Permission;
  checked: boolean;
  disabled: boolean;
  onChange: (id: string, val: boolean) => void;
}) {
  return (
    <label
      className={`flex items-start gap-2 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(perm.id, e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
      />
      <div>
        <span className="block text-sm font-mono text-gray-800">{perm.name}</span>
        <span className="block text-xs text-gray-400">{perm.description}</span>
      </div>
    </label>
  );
}

// ─── Role edit panel ──────────────────────────────────────────────────────────

function RolePanel({
  role,
  onClose,
  onSave,
}: {
  role: Role | null;
  onClose: () => void;
  onSave: (updated: Role) => void;
}) {
  const isNew = role === null;
  const [name, setName] = useState(role?.name ?? '');
  const [description, setDescription] = useState(role?.description ?? '');
  const [selectedPerms, setSelectedPerms] = useState<Set<string>>(
    new Set(role?.permissionIds ?? []),
  );

  function togglePerm(id: string, val: boolean) {
    setSelectedPerms((prev) => {
      const next = new Set(prev);
      if (val) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave({
      id: role?.id ?? `r${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      isSystem: role?.isSystem ?? false,
      permissionIds: [...selectedPerms],
      userCount: role?.userCount ?? 0,
    });
    onClose();
  }

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
            {isNew ? 'Create role' : `Edit role: ${role.name}`}
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

        <div className="px-6 py-6 space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="role-name" className="block text-sm font-medium text-gray-700 mb-1.5">
              Role name
            </label>
            <input
              id="role-name"
              type="text"
              disabled={role?.isSystem ?? false}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Event Manager"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="role-description"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Description
            </label>
            <textarea
              id="role-description"
              rows={2}
              disabled={role?.isSystem ?? false}
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition resize-none disabled:opacity-50 disabled:cursor-not-allowed"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description of what this role can do…"
            />
          </div>

          {/* Permissions */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-4">Permissions</p>
            <div className="space-y-6">
              {RESOURCES.map((resource) => (
                <div key={resource}>
                  <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                    {resource}
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    {ALL_PERMISSIONS.filter((p) => p.resource === resource).map((p) => (
                      <PermissionCheckbox
                        key={p.id}
                        perm={p}
                        checked={role?.isSystem ? true : selectedPerms.has(p.id)}
                        disabled={role?.isSystem ?? false}
                        onChange={togglePerm}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-6 py-4 flex gap-3">
          {!role?.isSystem && (
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
            >
              {isNew ? 'Create role' : 'Save changes'}
            </button>
          )}
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ManageRolesPage() {
  const [roles, setRoles] = useState<Role[]>(INITIAL_ROLES);
  const [panelRole, setPanelRole] = useState<Role | null | 'new'>('new' as never);
  const [panelOpen, setPanelOpen] = useState(false);

  function openNew() {
    setPanelRole(null);
    setPanelOpen(true);
  }

  function openEdit(role: Role) {
    setPanelRole(role);
    setPanelOpen(true);
  }

  function handleSave(updated: Role) {
    setRoles((prev) => {
      const exists = prev.find((r) => r.id === updated.id);
      if (exists) return prev.map((r) => (r.id === updated.id ? updated : r));
      return [...prev, updated];
    });
  }

  function handleDelete(id: string) {
    setRoles((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-5xl mx-auto space-y-6">
      {/* Heading */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-gray-500">
            Define roles, assign permission sets, and control who can do what.
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
          New role
        </button>
      </div>

      {/* Info banner */}
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
          Permissions are additive — a user&apos;s effective permissions are the union of all
          assigned roles. System roles (Super Admin, Alumni, Guest) cannot be deleted.{' '}
          <span className="font-semibold">Permission changes take effect immediately.</span>
        </p>
      </div>

      {/* Roles grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {roles.map((role) => {
          const permCount = role.isSystem ? ALL_PERMISSIONS.length : role.permissionIds.length;
          return (
            <div
              key={role.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold text-gray-900">{role.name}</h3>
                    {role.isSystem && (
                      <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 text-xs font-semibold">
                        System
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2">{role.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>
                  <strong className="text-gray-900">{permCount}</strong> permission
                  {permCount === 1 ? '' : 's'}
                </span>
                <span>
                  <strong className="text-gray-900">{role.userCount}</strong> user
                  {role.userCount === 1 ? '' : 's'}
                </span>
              </div>

              {/* Permission preview chips */}
              <div className="flex flex-wrap gap-1.5">
                {(role.isSystem
                  ? ALL_PERMISSIONS
                  : ALL_PERMISSIONS.filter((p) => role.permissionIds.includes(p.id))
                )
                  .slice(0, 6)
                  .map((p) => (
                    <span
                      key={p.id}
                      className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-600 text-xs font-mono"
                    >
                      {p.name}
                    </span>
                  ))}
                {permCount > 6 && (
                  <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-400 text-xs">
                    +{permCount - 6} more
                  </span>
                )}
              </div>

              <div className="flex gap-2 pt-1 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => openEdit(role)}
                  className="px-3.5 py-1.5 rounded-xl border border-gray-200 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  {role.isSystem ? 'View permissions' : 'Edit'}
                </button>
                {!role.isSystem && (
                  <button
                    type="button"
                    onClick={() => handleDelete(role.id)}
                    className="px-3.5 py-1.5 rounded-xl border border-red-100 bg-red-50 text-xs font-medium text-red-600 hover:bg-red-100 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role panel */}
      {panelOpen && (
        <RolePanel
          role={panelRole as Role | null}
          onClose={() => setPanelOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
