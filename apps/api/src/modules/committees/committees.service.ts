import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

export interface CommitteeMemberDto {
  id: string;
  slug: string | null;
  name: string;
  designation: string;
  designationShort: string | null;
  batchYear: string | null;
  jobTitle: string | null;
  employer: string | null;
  avatarColor: string | null;
  isKeyMember: boolean;
  rank: number;
}

export interface ActiveCommitteeDto {
  id: string;
  name: string;
  termLabel: string;
  members: CommitteeMemberDto[];
}

/**
 * Provides data about committees for public consumption on the platform.
 */
@Injectable()
export class CommitteesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Returns the currently active committee with all its members, ordered by rank.
   * If no active committee exists, returns null.
   */
  async getActiveCommittee(): Promise<ActiveCommitteeDto | null> {
    const committee = await this.prisma.committee.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      include: {
        members: {
          orderBy: { rank: 'asc' },
          select: {
            id: true,
            slug: true,
            name: true,
            designation: true,
            designationShort: true,
            batchYear: true,
            jobTitle: true,
            employer: true,
            avatarColor: true,
            isKeyMember: true,
            rank: true,
          },
        },
      },
    });

    if (!committee) return null;

    return {
      id: committee.id,
      name: committee.name,
      termLabel: committee.termLabel,
      members: committee.members,
    };
  }
}
