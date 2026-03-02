'use client';

/**
 * Client-side API helpers for events (RSVP operations).
 * Import only in Client Components or hooks.
 */

import { apiClient } from '../api-client';

export interface MyRsvpItem {
  id: string;
  eventTitle: string;
  startAt: string;
  endAt: string | null;
  location: string;
  status: 'upcoming' | 'attended';
  rsvpedAt: string;
}

/**
 * Returns the authenticated user's event RSVPs.
 */
export async function getMyRsvps(): Promise<MyRsvpItem[]> {
  return apiClient<MyRsvpItem[]>('/events/my/rsvps');
}

/**
 * Creates an RSVP for the given event.
 */
export async function rsvpEvent(eventId: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/events/${eventId}/rsvp`, { method: 'POST' });
}

/**
 * Cancels an RSVP for the given event.
 */
export async function cancelRsvp(eventId: string): Promise<void> {
  await apiClient<void>(`/events/${eventId}/rsvp`, { method: 'DELETE' });
}
