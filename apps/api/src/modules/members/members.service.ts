import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';

import type { ProfileVisibility } from '@csediualumni/prisma';
import { buildPaginationMeta } from '@csediualumni/types';

import { PrismaService } from '../../prisma/prisma.service';

interface UpdateProfileDto {
  firstName?: string;
  lastName?: string;
  batchYear?: number;
  jobTitle?: string;
  employer?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  websiteUrl?: string;
  visibility?: ProfileVisibility;
}

/**
 * Handles member profile management: listing, searching, profile updates,
 * and membership application workflows.
 */
@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── Directory listing ─────────────────────────────────────────────────────────

  /**
   * Returns a paginated list of member profiles (PUBLIC or MEMBERS_ONLY based on caller auth).
   *
   * @param query.page - Page number (1-based).
   * @param query.limit - Items per page.
   * @param query.search - Search by name, company, or skill keyword.
   * @param query.batch - Filter by batch year.
   */
  async listMembers(query: { page?: number; limit?: number; search?: string; batch?: number }) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const skip = (page - 1) * limit;

    const where = {
      visibility: { in: ['PUBLIC', 'MEMBERS_ONLY'] as ProfileVisibility[] },
      user: { deletedAt: null, isSuspended: false },
      ...(query.batch && { batchYear: query.batch }),
      ...(query.search && {
        OR: [
          { user: { firstName: { contains: query.search, mode: 'insensitive' as const } } },
          { user: { lastName: { contains: query.search, mode: 'insensitive' as const } } },
          { employer: { contains: query.search, mode: 'insensitive' as const } },
          { skills: { has: query.search } },
        ],
      }),
    };

    const [profiles, total] = await this.prisma.$transaction([
      this.prisma.memberProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { firstName: true, lastName: true, email: true, avatarUrl: true } },
        },
      }),
      this.prisma.memberProfile.count({ where }),
    ]);

    return {
      members: profiles.map((p) => ({
        id: p.id,
        username: p.username,
        firstName: p.user.firstName,
        lastName: p.user.lastName,
        avatarUrl: p.user.avatarUrl,
        batchYear: p.batchYear,
        jobTitle: p.jobTitle,
        employer: p.employer,
        location: p.location,
        skills: p.skills,
        // Contact info exposed only for logged-in members (caller controls visibility)
        email: p.user.email,
        linkedinUrl: p.linkedinUrl,
      })),
      meta: buildPaginationMeta(page, limit, total),
    };
  }

  // ─── Public profile ───────────────────────────────────────────────────────────────

  /**
   * Returns a single member's public profile by username.
   *
   * @throws {NotFoundException} If no profile is found for the given username.
   */
  async getMemberProfile(username: string) {
    const profile = await this.prisma.memberProfile.findUnique({
      where: { username },
      include: {
        user: { select: { firstName: true, lastName: true, avatarUrl: true } },
        timelineEntries: { orderBy: { date: 'desc' } },
      },
    });
    if (!profile) throw new NotFoundException('Member profile not found.');
    return profile;
  }

  // ─── My profile ────────────────────────────────────────────────────────────────────

  /**
   * Returns the authenticated user's full profile, membership, and user record.
   *
   * @throws {NotFoundException} If the user does not exist.
   */
  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId, deletedAt: null },
      include: {
        profile: true,
        membership: true,
        roles: {
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        },
      },
    });
    if (!user) throw new NotFoundException('User not found.');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- intentionally destructured to strip sensitive fields before returning
    const { passwordHash: _passwordHash, mfaSecret: _mfaSecret, ...safeUser } = user;
    return safeUser;
  }

  // ─── Update my profile ────────────────────────────────────────────────────────────

  /**
   * Creates or updates the authenticated user's member profile.
   *
   * @throws {ConflictException} If the requested username is already taken by another user.
   */
  async updateMe(userId: string, dto: UpdateProfileDto & { username?: string }) {
    // Validate username uniqueness if changing it
    if (dto.username) {
      const conflict = await this.prisma.memberProfile.findUnique({
        where: { username: dto.username },
      });
      if (conflict && conflict.userId !== userId) {
        throw new ConflictException('Username is already taken.');
      }
    }

    const { firstName, lastName, username, ...profileFields } = dto;

    // Update user name fields on the User model
    if (firstName !== undefined || lastName !== undefined) {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
        },
      });
    }

    // Upsert the MemberProfile
    const profile = await this.prisma.memberProfile.upsert({
      where: { userId },
      update: { ...(username !== undefined && { username }), ...profileFields },
      create: {
        userId,
        username: username ?? userId, // fallback; front-end should always send a username
        ...profileFields,
      },
    });

    return profile;
  }

  // ─── My activity ────────────────────────────────────────────────────────────────────

  /**
   * Returns the authenticated user's recent activity:
   * RSVPs, donations, forum posts, and mentorship relationships.
   */
  async getMyActivity(userId: string) {
    const now = new Date();

    const [rsvps, donations, forumPosts, mentorships] = await this.prisma.$transaction([
      // Event RSVPs
      this.prisma.eventRsvp.findMany({
        where: { userId },
        orderBy: { event: { startAt: 'desc' } },
        take: 10,
        include: {
          event: {
            select: {
              id: true,
              title: true,
              startAt: true,
              location: true,
              isVirtual: true,
              virtualLink: true,
            },
          },
        },
      }),
      // Donations
      this.prisma.donation.findMany({
        where: { donorId: userId, status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { campaign: { select: { id: true, title: true } } },
      }),
      // Forum posts (via threads created by the user)
      this.prisma.forumPost.findMany({
        where: { authorId: userId, deletedAt: null },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          thread: {
            select: { id: true, title: true, category: { select: { name: true, slug: true } } },
          },
          _count: { select: { votes: true } },
        },
      }),
      // Mentorship (as mentor or mentee)
      this.prisma.mentorshipRequest.findMany({
        where: {
          OR: [{ menteeId: userId }, { mentor: { userId } }],
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: {
          mentor: {
            include: {
              user: { select: { firstName: true, lastName: true } },
            },
          },
        },
      }),
    ]);

    // Get mentee user info for mentorship display
    const menteeIds = mentorships.filter((m) => m.menteeId !== userId).map((m) => m.menteeId);
    const menteeUsers =
      menteeIds.length > 0
        ? await this.prisma.user.findMany({
            where: { id: { in: menteeIds } },
            select: { id: true, firstName: true, lastName: true },
          })
        : [];
    const menteeMap = new Map(menteeUsers.map((u) => [u.id, u]));

    return {
      rsvps: rsvps.map((r) => ({
        id: r.eventId,
        eventTitle: r.event.title,
        startAt: r.event.startAt,
        location: r.event.isVirtual ? (r.event.virtualLink ?? 'Online') : (r.event.location ?? ''),
        status: r.event.startAt > now ? ('upcoming' as const) : ('attended' as const),
        rsvpedAt: r.createdAt,
      })),
      donations: donations.map((d) => ({
        id: d.id,
        campaign: d.campaign.title,
        amount: d.amount.toString(),
        currency: d.currency,
        date: d.createdAt,
        anonymous: d.isAnonymous,
        receiptSent: !!d.receiptSentAt,
      })),
      forumPosts: forumPosts.map((p) => ({
        id: p.id,
        threadTitle: p.thread.title,
        excerpt: p.content.length > 120 ? p.content.slice(0, 120) + '\u2026' : p.content,
        date: p.createdAt,
        category: p.thread.category.name,
        categorySlug: p.thread.category.slug,
        threadId: p.thread.id,
        votes: p._count.votes,
      })),
      mentorships: mentorships.map((m) => {
        const isMentor = m.mentor.userId === userId;
        const partnerUser = isMentor
          ? (menteeMap.get(m.menteeId) ?? { firstName: 'Unknown', lastName: '\u2014' })
          : m.mentor.user;
        return {
          id: m.id,
          role: isMentor ? ('mentor' as const) : ('mentee' as const),
          partnerName: `${partnerUser.firstName} ${partnerUser.lastName}`,
          topic: m.message ?? '\u2014',
          status: m.status.toLowerCase() as 'pending' | 'active' | 'completed',
          since: m.createdAt,
        };
      }),
    };
  }
}
