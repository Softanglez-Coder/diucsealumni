/**
 * Server-side API helpers for events.
 * Only import these in React Server Components or Route Handlers.
 */

import { serverFetch } from '../server-api-client';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string | null;
  isVirtual: boolean;
  virtualLink: string | null;
  bannerUrl: string | null;
  startAt: string;
  endAt: string | null;
  seatLimit: number | null;
  isArchived: boolean;
  createdAt: string;
  _count: { rsvps: number };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface EventsListResult {
  events: EventItem[];
  meta: PaginationMeta;
}

/**
 * Returns a paginated list of events from the API (server-side).
 */
export async function listEvents(params?: {
  page?: number;
  limit?: number;
  upcoming?: boolean;
}): Promise<EventsListResult> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.upcoming !== undefined) query.set('upcoming', String(params.upcoming));
  const qs = query.toString();
  return serverFetch<EventsListResult>(`/events${qs ? `?${qs}` : ''}`);
}

/**
 * Returns a single event by ID (server-side).
 */
export async function getEvent(id: string): Promise<EventItem & { _count: { rsvps: number } }> {
  return serverFetch(`/events/${id}`);
}
