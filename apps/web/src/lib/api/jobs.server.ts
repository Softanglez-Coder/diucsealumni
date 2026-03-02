/**
 * Server-side API helpers for job postings.
 * Only import these in React Server Components or Route Handlers.
 */

import { serverFetch } from '../server-api-client';

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE';
export type JobStatus = 'PENDING' | 'PUBLISHED' | 'FILLED' | 'EXPIRED' | 'REJECTED';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string | null;
  isRemote: boolean;
  jobType: JobType;
  description: string;
  requirements: string | null;
  applicationLink: string | null;
  applicationEmail: string | null;
  status: JobStatus;
  expiresAt: string | null;
  createdAt: string;
  postedBy: {
    firstName: string;
    lastName: string;
    profile: { batchYear: number | null } | null;
  };
}

export interface JobsListResult {
  jobs: JobPosting[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Returns a paginated list of published jobs (server-side).
 */
export async function listJobs(params?: {
  page?: number;
  limit?: number;
  jobType?: string;
  search?: string;
}): Promise<JobsListResult> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.jobType) query.set('jobType', params.jobType);
  if (params?.search) query.set('search', params.search);
  const qs = query.toString();
  return serverFetch<JobsListResult>(`/jobs${qs ? `?${qs}` : ''}`);
}
