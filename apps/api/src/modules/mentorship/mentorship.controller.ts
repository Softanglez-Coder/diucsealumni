import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MentorshipService } from './mentorship.service';

@ApiTags('mentorship')
@Controller('mentorship')
export class MentorshipController {
  constructor(private readonly mentorshipService: MentorshipService) {}

  // TODO: implement GET /mentorship/mentors, POST /mentorship/mentors, POST /mentorship/requests
}
