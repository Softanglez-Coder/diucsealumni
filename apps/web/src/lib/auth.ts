'use client';

import { create } from 'zustand';

// ─── In-memory access token store (client-side only) ─────────────────────────

interface AuthStore {
  accessToken: string | null;
  setAccessToken: (token: string) => void;
  clearAccessToken: () => void;
}

/**
 * Zustand store that holds the short-lived JWT access token in memory.
 * Never stored in localStorage or sessionStorage.
 */
export const useAuthStore = create<AuthStore>((set) => ({
  accessToken: null,
  setAccessToken: (token) => set({ accessToken: token }),
  clearAccessToken: () => set({ accessToken: null }),
}));
