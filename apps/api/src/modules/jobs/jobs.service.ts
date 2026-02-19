import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Handles job posting creation, approval workflow, expiry, and notifications.
 */
@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: implement listJobs, createJob, approveJob, markFilled, expireJobs
}
