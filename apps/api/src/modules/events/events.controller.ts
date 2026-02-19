import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // TODO: implement GET /events, POST /events, GET /events/:id, POST /events/:id/rsvp, DELETE /events/:id/rsvp
}
