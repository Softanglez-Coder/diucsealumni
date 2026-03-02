import { Injectable, NotFoundException } from '@nestjs/common';

import type { JobType } from '@csediualumni/prisma';
import { buildPaginationMeta } from '@csediualumni/types';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Handles job posting creation, approval workflow, expiry, and notifications.
 */
@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── List published jobs ─────────────────────────────────────────────────

  /**
   * Returns a paginated list of published, non-expired jobs.
   *
   * @param query.page - Page number (1-based).
   * @param query.limit - Items per page.
   * @param query.jobType - Optional filter by job type.
   * @param query.search - Optional full-text search over title, company, description.
   */
  async listJobs(query: { page?: number; limit?: number; jobType?: string; search?: string }) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const skip = (page - 1) * limit;
    const now = new Date();

    const where = {
      status: 'PUBLISHED' as const,
      OR: [{ expiresAt: null }, { expiresAt: { gte: now } }] as [object, object],
      ...(query.jobType && { jobType: query.jobType as JobType }),
      ...(query.search && {
        OR: [
          { title: { contains: query.search, mode: 'insensitive' as const } },
          { company: { contains: query.search, mode: 'insensitive' as const } },
          { description: { contains: query.search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [jobs, total] = await this.prisma.$transaction([
      this.prisma.jobPosting.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          postedBy: {
            select: { firstName: true, lastName: true, profile: { select: { batchYear: true } } },
          },
        },
      }),
      this.prisma.jobPosting.count({ where }),
    ]);

    return { jobs, meta: buildPaginationMeta(page, limit, total) };
  }

  // ─── Get single job ───────────────────────────────────────────────────────

  /**
   * Returns a single job posting by ID.
   *
   * @throws {NotFoundException} If the job does not exist or is not published.
   */
  async getJob(id: string) {
    const job = await this.prisma.jobPosting.findUnique({
      where: { id },
      include: {
        postedBy: {
          select: { firstName: true, lastName: true, profile: { select: { batchYear: true } } },
        },
      },
    });
    if (!job || job.status !== 'PUBLISHED') throw new NotFoundException('Job not found.');
    return job;
  }
}
