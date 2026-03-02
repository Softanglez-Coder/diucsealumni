'use client';

/**
 * Client-side API helpers for notifications.
 * Import only in Client Components or hooks.
 */

import { apiClient } from '../api-client';

export interface Notification {
  id: string;
  type: string;
  title: string;
  body: string;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsListResult {
  notifications: Notification[];
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
 * Returns the count of unread notifications for the authenticated user.
 */
export async function getUnreadCount(): Promise<{ unread: number }> {
  return apiClient<{ unread: number }>('/notifications/unread-count');
}

/**
 * Returns a paginated list of notifications for the authenticated user.
 */
export async function listNotifications(params?: {
  page?: number;
  limit?: number;
}): Promise<NotificationsListResult> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  const qs = query.toString();
  return apiClient<NotificationsListResult>(`/notifications${qs ? `?${qs}` : ''}`);
}

/**
 * Marks a single notification as read.
 */
export async function markRead(id: string): Promise<{ message: string }> {
  return apiClient<{ message: string }>(`/notifications/${id}/read`, { method: 'PATCH' });
}

/**
 * Marks all notifications as read.
 */
export async function markAllRead(): Promise<{ message: string }> {
  return apiClient<{ message: string }>('/notifications/read-all', { method: 'PATCH' });
}
