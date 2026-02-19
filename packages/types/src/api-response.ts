import type { PaginationMeta } from './pagination.js';

// ─── Standard API response envelope ──────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
}

export interface PaginatedApiResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// ─── RFC 7807 Problem Details ─────────────────────────────────────────────────

export interface ProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
}

export function buildErrorResponse(
  status: number,
  title: string,
  detail: string,
  instance: string,
): ProblemDetails {
  return {
    type: `https://csediualumni.com/errors/${title.toLowerCase().replaceAll(/\s+/g, '-')}`,
    title,
    status,
    detail,
    instance,
  };
}
