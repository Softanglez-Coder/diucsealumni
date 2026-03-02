import { Controller, Get, Post, Delete, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import type { JwtPayload } from '@csediualumni/types';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // ─── Public endpoints ─────────────────────────────────────────────────────

  @Public()
  @Get()
  @ApiOperation({ summary: 'List events (public, paginated)' })
  listEvents(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('upcoming') upcoming?: string,
  ) {
    return this.eventsService.listEvents({
      ...(page !== undefined && { page: Number(page) }),
      ...(limit !== undefined && { limit: Number(limit) }),
      ...(upcoming === 'true' && { upcoming: true }),
      ...(upcoming === 'false' && { upcoming: false }),
    });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single event by ID (public)' })
  getEvent(@Param('id') id: string) {
    return this.eventsService.getEvent(id);
  }

  // ─── Authenticated endpoints ──────────────────────────────────────────────

  @Get('my/rsvps')
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get the current user's event RSVPs" })
  getMyRsvps(@CurrentUser() user: JwtPayload) {
    return this.eventsService.getMyRsvps(user.sub);
  }

  @Post(':id/rsvp')
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'RSVP to an event' })
  rsvpEvent(@Param('id') eventId: string, @CurrentUser() user: JwtPayload) {
    return this.eventsService.rsvpEvent(user.sub, eventId);
  }

  @Delete(':id/rsvp')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an event RSVP' })
  async cancelRsvp(@Param('id') eventId: string, @CurrentUser() user: JwtPayload) {
    await this.eventsService.cancelRsvp(user.sub, eventId);
  }
}
