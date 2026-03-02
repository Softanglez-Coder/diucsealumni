'use client';

/**
 * Client-side API helpers for member/alumni directory and own profile.
 * Import only in Client Components or hooks.
 */

import { apiClient } from '../api-client';

export interface MemberListItem {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  batchYear: number | null;
  jobTitle: string | null;
  employer: string | null;
  location: string | null;
  skills: string[];
  email: string;
  linkedinUrl: string | null;
}

export interface MembersListResult {
  members: MemberListItem[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface MyProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  mfaEnabled: boolean;
  profile: {
    id: string;
    username: string;
    batchYear: number | null;
    jobTitle: string | null;
    employer: string | null;
    location: string | null;
    bio: string | null;
    skills: string[];
    linkedinUrl: string | null;
    githubUrl: string | null;
    websiteUrl: string | null;
    visibility: 'PUBLIC' | 'MEMBERS_ONLY' | 'PRIVATE';
  } | null;
  membership: {
    membershipNumber: string;
    tier: string;
    status: string;
    validFrom: string;
    expiresAt: string | null;
  } | null;
}

export interface ActivityData {
  rsvps: {
    id: string;
    eventTitle: string;
    startAt: string;
    location: string;
    status: 'upcoming' | 'attended';
    rsvpedAt: string;
  }[];
  donations: {
    id: string;
    campaign: string;
    amount: string;
    currency: string;
    date: string;
    anonymous: boolean;
    receiptSent: boolean;
  }[];
  forumPosts: {
    id: string;
    threadTitle: string;
    excerpt: string;
    date: string;
    category: string;
    categorySlug: string;
    threadId: string;
    votes: number;
  }[];
  mentorships: {
    id: string;
    role: 'mentor' | 'mentee';
    partnerName: string;
    topic: string;
    status: 'pending' | 'active' | 'completed';
    since: string;
  }[];
}

/**
 * Fetches the paginated alumni directory (auth required).
 */
export async function listMembers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  batch?: number;
}): Promise<MembersListResult> {
  const query = new URLSearchParams();
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));
  if (params?.search) query.set('search', params.search);
  if (params?.batch) query.set('batch', String(params.batch));
  const qs = query.toString();
  return apiClient<MembersListResult>(`/members${qs ? `?${qs}` : ''}`);
}

/**
 * Fetches the current user's full profile (auth required).
 */
export async function getMyProfile(): Promise<MyProfile> {
  return apiClient<MyProfile>('/members/me');
}

/**
 * Updates the current user's profile (auth required).
 */
export async function updateMyProfile(
  data: Partial<{
    firstName: string;
    lastName: string;
    username: string;
    batchYear: number;
    jobTitle: string;
    employer: string;
    location: string;
    bio: string;
    skills: string[];
    linkedinUrl: string;
    githubUrl: string;
    websiteUrl: string;
    visibility: 'PUBLIC' | 'MEMBERS_ONLY' | 'PRIVATE';
  }>,
) {
  return apiClient('/members/me', { method: 'PATCH', body: data });
}

/**
 * Fetches the current user's activity summary (auth required).
 */
export async function getMyActivity(): Promise<ActivityData> {
  return apiClient<ActivityData>('/members/me/activity');
}

/**
 * Returns counts for portal dashboard quick stats.
 */
export async function getMyActivityCounts(): Promise<{
  rsvpCount: number;
  forumPostCount: number;
  donationCount: number;
}> {
  const activity = await getMyActivity();
  return {
    rsvpCount: activity.rsvps.length,
    forumPostCount: activity.forumPosts.length,
    donationCount: activity.donations.length,
  };
}
