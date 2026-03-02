import {
  Injectable,
  NotFoundException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';

import { buildPaginationMeta } from '@csediualumni/types';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Handles event creation, listing, RSVP management, and gallery operations.
 */
@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── List events ──────────────────────────────────────────────────────────

  /**
   * Returns a paginated list of events.
   *
   * @param query.upcoming - `true` for upcoming events, `false` for past, omit for all.
   * @param query.page - Page number (1-based).
   * @param query.limit - Items per page.
   */
  async listEvents(query: { page?: number; limit?: number; upcoming?: boolean }) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const skip = (page - 1) * limit;
    const now = new Date();

    const where = {
      deletedAt: null as null,
      ...(query.upcoming === true && { startAt: { gte: now } }),
      ...(query.upcoming === false && { startAt: { lt: now } }),
    };

    const [events, total] = await this.prisma.$transaction([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { startAt: query.upcoming === false ? 'desc' : 'asc' },
        include: { _count: { select: { rsvps: true } } },
      }),
      this.prisma.event.count({ where }),
    ]);

    return { events, meta: buildPaginationMeta(page, limit, total) };
  }

  // ─── Get single event ─────────────────────────────────────────────────────

  /**
   * Returns a single event by ID, including RSVP count.
   *
   * @throws {NotFoundException} If the event does not exist or is soft-deleted.
   */
  async getEvent(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id, deletedAt: null },
      include: { _count: { select: { rsvps: true } } },
    });
    if (!event) throw new NotFoundException('Event not found.');
    return event;
  }

  // ─── RSVP ─────────────────────────────────────────────────────────────────

  /**
   * Creates an RSVP for the given user on the given event.
   *
   * @throws {NotFoundException} If the event does not exist.
   * @throws {ForbiddenException} If the event is in the past.
   * @throws {ConflictException} If the user already has an RSVP or the event is full.
   */
  async rsvpEvent(userId: string, eventId: string) {
    const event = await this.prisma.event.findUnique({
      where: { id: eventId, deletedAt: null },
      include: { _count: { select: { rsvps: true } } },
    });
    if (!event) throw new NotFoundException('Event not found.');
    if (event.startAt < new Date()) throw new ForbiddenException('Cannot RSVP to a past event.');

    const existing = await this.prisma.eventRsvp.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (existing) throw new ConflictException("You have already RSVP'd to this event.");

    if (event.seatLimit !== null && event._count.rsvps >= event.seatLimit) {
      throw new ConflictException('This event has no remaining seats.');
    }

    await this.prisma.eventRsvp.create({ data: { userId, eventId } });
    return { message: 'RSVP confirmed.' };
  }

  /**
   * Cancels an existing RSVP.
   *
   * @throws {NotFoundException} If the RSVP does not exist.
   */
  async cancelRsvp(userId: string, eventId: string) {
    const existing = await this.prisma.eventRsvp.findUnique({
      where: { userId_eventId: { userId, eventId } },
    });
    if (!existing) throw new NotFoundException('RSVP not found.');
    await this.prisma.eventRsvp.delete({ where: { userId_eventId: { userId, eventId } } });
    return { message: 'RSVP cancelled.' };
  }

  // ─── My RSVPs ─────────────────────────────────────────────────────────────

  /**
   * Returns the events the authenticated user has RSVP'd to, with attendance status.
   */
  async getMyRsvps(userId: string) {
    const now = new Date();
    const rsvps = await this.prisma.eventRsvp.findMany({
      where: { userId },
      orderBy: { event: { startAt: 'desc' } },
      include: {
        event: {
          select: {
            id: true,
            title: true,
            startAt: true,
            endAt: true,
            location: true,
            isVirtual: true,
            virtualLink: true,
          },
        },
      },
    });

    return rsvps.map((r) => ({
      id: r.eventId,
      eventTitle: r.event.title,
      startAt: r.event.startAt,
      endAt: r.event.endAt,
      location: r.event.isVirtual ? (r.event.virtualLink ?? 'Online') : (r.event.location ?? ''),
      status: r.event.startAt > now ? ('upcoming' as const) : ('attended' as const),
      rsvpedAt: r.createdAt,
    }));
  }
}
