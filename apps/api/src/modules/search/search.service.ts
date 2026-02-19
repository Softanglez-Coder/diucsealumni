import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Provides full-text search across alumni profiles, events, news, forum, and jobs
 * using PostgreSQL full-text search vectors.
 */
@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: implement globalSearch, lookupByMembershipNumber
}
