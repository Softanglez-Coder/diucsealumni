import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Handles member profile management: listing, searching, profile updates,
 * and membership application workflows.
 */
@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: implement listMembers, getMemberProfile, updateProfile, etc.
}
