import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

export interface PlatformStats {
  alumniCount: number;
  eventsPerYear: number;
  jobPlacements: number;
  mentorsCount: number;
}

/**
 * Provides aggregate platform statistics used on the public homepage.
 * All counts are derived directly from the database.
 */
@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns live platform statistics:
   * - alumniCount: active memberships
   * - eventsPerYear: non-archived events created in the current calendar year
   * - jobPlacements: job postings that have been marked as FILLED
   * - mentorsCount: active mentor profiles
   */
  async getPlatformStats(): Promise<PlatformStats> {
    const yearStart = new Date(new Date().getFullYear(), 0, 1);
    const yearEnd = new Date(new Date().getFullYear() + 1, 0, 1);

    const [alumniCount, eventsPerYear, jobPlacements, mentorsCount] =
      await this.prisma.$transaction([
        this.prisma.membership.count({
          where: { status: 'ACTIVE' },
        }),
        this.prisma.event.count({
          where: {
            isArchived: false,
            deletedAt: null,
            startAt: { gte: yearStart, lt: yearEnd },
          },
        }),
        this.prisma.jobPosting.count({
          where: { status: 'FILLED' },
        }),
        this.prisma.mentorProfile.count({
          where: { isActive: true },
        }),
      ]);

    return { alumniCount, eventsPerYear, jobPlacements, mentorsCount };
  }
}
