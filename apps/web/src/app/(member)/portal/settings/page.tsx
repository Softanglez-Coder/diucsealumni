'use client';

import { useState } from 'react';

// ─── Component helpers ────────────────────────────────────────────────────────

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8">
      <div className="mb-6">
        <h2 className="text-base font-semibold text-gray-900">{title}</h2>
        {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function Toggle({
  id,
  label,
  description,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4">
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 ${
          checked ? 'bg-blue-600' : 'bg-gray-200'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
      <div className="flex-1">
        <label htmlFor={id} className="block text-sm font-medium text-gray-900 cursor-pointer">
          {label}
        </label>
        {description && <p className="mt-0.5 text-xs text-gray-500">{description}</p>}
      </div>
    </div>
  );
}

const inputCls =
  'w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition';

// ─── Notification preferences state ──────────────────────────────────────────

interface NotifPrefs {
  inApp_events: boolean;
  inApp_jobs: boolean;
  inApp_forum_replies: boolean;
  inApp_membership: boolean;
  inApp_announcements: boolean;
  email_events: boolean;
  email_jobs: boolean;
  email_forum_replies: boolean;
  email_membership: boolean;
  email_digest: 'none' | 'daily' | 'weekly';
}

const DEFAULT_NOTIF: NotifPrefs = {
  inApp_events: true,
  inApp_jobs: true,
  inApp_forum_replies: true,
  inApp_membership: true,
  inApp_announcements: true,
  email_events: true,
  email_jobs: false,
  email_forum_replies: true,
  email_membership: true,
  email_digest: 'weekly',
};

// ─── Password change state ────────────────────────────────────────────────────

interface PasswordForm {
  current: string;
  next: string;
  confirm: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const [notif, setNotif] = useState<NotifPrefs>(DEFAULT_NOTIF);
  const [pgSaved, setPgSaved] = useState(false);
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current: '',
    next: '',
    confirm: '',
  });
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput, setDeleteInput] = useState('');

  function setNotifKey<K extends keyof NotifPrefs>(key: K, value: NotifPrefs[K]) {
    setNotif((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveNotif(e: React.FormEvent) {
    e.preventDefault();
    // TODO: POST /api/v1/users/me/notification-preferences
    setPgSaved(true);
    setTimeout(() => setPgSaved(false), 3000);
  }

  function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError('');
    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError('New passwords do not match.');
      return;
    }
    if (passwordForm.next.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }
    // TODO: POST /api/v1/auth/change-password
    setPasswordSaved(true);
    setPasswordForm({ current: '', next: '', confirm: '' });
    setTimeout(() => setPasswordSaved(false), 3000);
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 max-w-3xl mx-auto space-y-8">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your notification preferences, password, and account options.
        </p>
      </div>

      {/* ── Notification preferences ── */}
      <SectionCard
        title="Notification preferences"
        description="Choose which events you want to be notified about, and through which channels."
      >
        <form onSubmit={handleSaveNotif} className="space-y-8">
          {/* In-app */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">In-app notifications</h3>
            <div className="space-y-4">
              <Toggle
                id="inApp_events"
                label="Event announcements"
                description="New events published by the association."
                checked={notif.inApp_events}
                onChange={(v) => setNotifKey('inApp_events', v)}
              />
              <Toggle
                id="inApp_jobs"
                label="Job board"
                description="New approved job postings."
                checked={notif.inApp_jobs}
                onChange={(v) => setNotifKey('inApp_jobs', v)}
              />
              <Toggle
                id="inApp_forum_replies"
                label="Forum replies"
                description="Replies to threads you are subscribed to."
                checked={notif.inApp_forum_replies}
                onChange={(v) => setNotifKey('inApp_forum_replies', v)}
              />
              <Toggle
                id="inApp_membership"
                label="Membership updates"
                description="Status changes to your membership application."
                checked={notif.inApp_membership}
                onChange={(v) => setNotifKey('inApp_membership', v)}
              />
              <Toggle
                id="inApp_announcements"
                label="Admin announcements"
                description="Important platform-wide announcements."
                checked={notif.inApp_announcements}
                onChange={(v) => setNotifKey('inApp_announcements', v)}
              />
            </div>
          </div>

          <div className="border-t border-gray-100" />

          {/* Email */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Email notifications</h3>
            <div className="space-y-4">
              <Toggle
                id="email_events"
                label="Event announcements"
                checked={notif.email_events}
                onChange={(v) => setNotifKey('email_events', v)}
              />
              <Toggle
                id="email_jobs"
                label="New job postings"
                checked={notif.email_jobs}
                onChange={(v) => setNotifKey('email_jobs', v)}
              />
              <Toggle
                id="email_forum_replies"
                label="Forum replies"
                checked={notif.email_forum_replies}
                onChange={(v) => setNotifKey('email_forum_replies', v)}
              />
              <Toggle
                id="email_membership"
                label="Membership updates"
                checked={notif.email_membership}
                onChange={(v) => setNotifKey('email_membership', v)}
              />
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email digest frequency
              </label>
              <div className="flex flex-wrap gap-3">
                {(['none', 'daily', 'weekly'] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setNotifKey('email_digest', opt)}
                    className={`px-4 py-2 rounded-xl border text-sm font-medium transition-colors ${
                      notif.email_digest === opt
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {opt === 'none' ? 'Off' : opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-400">
                A summary email of all activity will be sent at your chosen frequency.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
            >
              Save preferences
            </button>
            {pgSaved && (
              <span className="text-sm text-emerald-600 font-medium">✓ Preferences saved</span>
            )}
          </div>
        </form>
      </SectionCard>

      {/* ── Password change ── */}
      <SectionCard
        title="Change password"
        description="Update your password. Must be at least 8 characters with upper, lower, number, and symbol."
      >
        <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
          <div>
            <label htmlFor="current-pw" className="block text-sm font-medium text-gray-700 mb-1.5">
              Current password
            </label>
            <input
              id="current-pw"
              type="password"
              autoComplete="current-password"
              className={inputCls}
              value={passwordForm.current}
              onChange={(e) => setPasswordForm((p) => ({ ...p, current: e.target.value }))}
              required
            />
          </div>
          <div>
            <label htmlFor="new-pw" className="block text-sm font-medium text-gray-700 mb-1.5">
              New password
            </label>
            <input
              id="new-pw"
              type="password"
              autoComplete="new-password"
              className={inputCls}
              value={passwordForm.next}
              onChange={(e) => setPasswordForm((p) => ({ ...p, next: e.target.value }))}
              required
            />
          </div>
          <div>
            <label htmlFor="confirm-pw" className="block text-sm font-medium text-gray-700 mb-1.5">
              Confirm new password
            </label>
            <input
              id="confirm-pw"
              type="password"
              autoComplete="new-password"
              className={inputCls}
              value={passwordForm.confirm}
              onChange={(e) => setPasswordForm((p) => ({ ...p, confirm: e.target.value }))}
              required
            />
          </div>
          {passwordError && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">{passwordError}</p>
          )}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-700 text-white text-sm font-semibold hover:bg-blue-800 transition-colors shadow-sm"
            >
              Update password
            </button>
            {passwordSaved && (
              <span className="text-sm text-emerald-600 font-medium">✓ Password updated</span>
            )}
          </div>
        </form>
      </SectionCard>

      {/* ── Connected OAuth providers ── */}
      <SectionCard
        title="Connected accounts"
        description="Link or unlink third-party sign-in providers."
      >
        <ul className="divide-y divide-gray-100">
          {[
            {
              provider: 'Google',
              linked: true,
              email: 'you@gmail.com',
              icon: (
                <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              ),
            },
          ].map(({ provider, linked, email, icon }) => (
            <li key={provider} className="flex items-center gap-4 py-4">
              <span className="shrink-0">{icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{provider}</p>
                {linked && email && <p className="text-xs text-gray-500 truncate">{email}</p>}
              </div>
              {linked ? (
                <button
                  type="button"
                  className="shrink-0 text-sm text-red-600 hover:text-red-700 font-medium transition-colors"
                >
                  Unlink
                </button>
              ) : (
                <button
                  type="button"
                  className="shrink-0 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Connect
                </button>
              )}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* ── Danger zone ── */}
      <SectionCard title="Danger zone">
        <div className="rounded-xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-start gap-4">
            <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-red-100 text-red-600">
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
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-700">Delete account</h3>
              <p className="mt-1 text-sm text-red-600">
                Permanently delete your account and all associated data. This action is
                irreversible.
              </p>
              {showDeleteConfirm ? (
                <div className="mt-4 space-y-3">
                  <p className="text-sm text-red-700 font-medium">
                    Type <span className="font-mono bg-red-100 px-1 rounded">DELETE</span> to
                    confirm:
                  </p>
                  <input
                    type="text"
                    className="w-full max-w-xs rounded-xl border border-red-300 bg-white px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="DELETE"
                    value={deleteInput}
                    onChange={(e) => setDeleteInput(e.target.value)}
                  />
                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={deleteInput !== 'DELETE'}
                      className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      Confirm deletion
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setDeleteInput('');
                      }}
                      className="px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="mt-3 px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 transition-colors"
                >
                  Request account deletion
                </button>
              )}
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  );
}
