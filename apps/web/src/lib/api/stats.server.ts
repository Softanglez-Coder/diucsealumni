/**
 * Server-side API helpers for platform statistics.
 * Only import these in React Server Components or Route Handlers.
 */

import { serverFetch } from '../server-api-client';

export interface PlatformStats {
  alumniCount: number;
  eventsPerYear: number;
  jobPlacements: number;
  mentorsCount: number;
}

/**
 * Returns live platform statistics from the API.
 * Revalidates every 5 minutes — stats don't change frequently.
 */
export async function getPlatformStats(): Promise<PlatformStats> {
  return serverFetch<PlatformStats>('/stats', { next: { revalidate: 300 } });
}

/**
 * Formats a raw count into a human-readable display string (e.g. 1247 → "1,247+").
 */
export function formatStat(count: number): string {
  return `${count.toLocaleString('en-US')}+`;
}
