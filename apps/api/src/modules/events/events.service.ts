import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Handles event creation, listing, RSVP management, and gallery operations.
 */
@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: implement createEvent, listEvents, getEvent, rsvp, cancelRsvp, listAttendees
}
