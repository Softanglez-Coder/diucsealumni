/**
 * Server-side API helpers for committee data.
 * Only import these in React Server Components or Route Handlers.
 */

import { serverFetch } from '../server-api-client';

export interface CommitteeMember {
  id: string;
  slug: string | null;
  name: string;
  designation: string;
  designationShort: string | null;
  batchYear: string | null;
  jobTitle: string | null;
  employer: string | null;
  avatarColor: string | null;
  isKeyMember: boolean;
  rank: number;
}

export interface ActiveCommittee {
  id: string;
  name: string;
  termLabel: string;
  members: CommitteeMember[];
}

/**
 * Returns the active executive committee with all members from the API.
 * Returns null on any error so the page can degrade gracefully.
 * Revalidates every 10 minutes — committee data changes infrequently.
 */
export async function getActiveCommittee(): Promise<ActiveCommittee | null> {
  try {
    return await serverFetch<ActiveCommittee>('/committees/active', {
      next: { revalidate: 600 },
    });
  } catch {
    return null;
  }
}
