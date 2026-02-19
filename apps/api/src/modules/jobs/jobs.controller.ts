import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JobsService } from './jobs.service';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  // TODO: implement GET /jobs, POST /jobs, PATCH /jobs/:id/approve, PATCH /jobs/:id/filled
}
