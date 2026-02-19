'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

import { useAuthStore } from '@/lib/auth';

// ─── Portal Topbar ────────────────────────────────────────────────────────────

interface PortalTopbarProps {
  /** Called when the mobile hamburger button is clicked */
  onMobileMenuOpen?: () => void;
}

export function PortalTopbar({ onMobileMenuOpen }: PortalTopbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const clearAccessToken = useAuthStore((s) => s.clearAccessToken);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  function handleLogout() {
    clearAccessToken();
    fetch('/api/v1/auth/logout', { method: 'POST', credentials: 'include' }).catch(() => null);
    globalThis.location.href = '/';
  }

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 z-30 h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 gap-3">
      {/* Mobile: hamburger + wordmark */}
      <button
        onClick={onMobileMenuOpen}
        className="lg:hidden flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        aria-label="Open navigation"
      >
        <HamburgerIcon />
      </button>
      <Link
        href="/portal"
        className="lg:hidden flex items-center gap-2 font-semibold text-gray-900 text-sm"
        aria-label="Portal home"
      >
        <span className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-700 text-white font-bold text-xs select-none">
          CSE
        </span>
        <span className="text-gray-900">My Portal</span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Notification bell */}
      <button
        className="relative flex items-center justify-center w-9 h-9 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-700 transition-colors"
        aria-label="Notifications"
      >
        <BellIcon />
        {/* Unread badge (placeholder) */}
        <span
          className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-blue-600"
          aria-hidden="true"
        />
      </button>

      {/* User avatar dropdown */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label="Open user menu"
          aria-haspopup="true"
          aria-expanded={menuOpen}
        >
          <span className="flex items-center justify-center w-9 h-9 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm select-none">
            U
          </span>
          <svg
            className={`w-4 h-4 text-gray-400 transition-transform ${menuOpen ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {menuOpen && (
          <div
            className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white shadow-lg z-50 py-1"
            role="menu"
          >
            <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
              <p className="text-xs font-medium text-gray-900 truncate">CSE Alumni Member</p>
              <p className="text-xs text-gray-500 truncate">member@csediualumni.com</p>
            </div>
            <Link
              href="/portal/profile"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              <ProfileIcon />
              Edit Profile
            </Link>
            <Link
              href="/portal/settings"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              <SettingsIcon />
              Settings
            </Link>
            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              role="menuitem"
              onClick={() => setMenuOpen(false)}
            >
              <PublicSiteIcon />
              Public site
            </Link>
            <div className="my-1 border-t border-gray-100" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              role="menuitem"
            >
              <LogoutIcon />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function BellIcon() {
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
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg
      className="w-[18px] h-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg
      className="w-[18px] h-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PublicSiteIcon() {
  return (
    <svg
      className="w-[18px] h-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg
      className="w-[18px] h-[18px]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
      />
    </svg>
  );
}

function HamburgerIcon() {
  return (
    <svg
      className="w-5 h-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}
