import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Generates membership card PDF/PNG, stores them in S3, and handles
 * the public verification page data.
 */
@Injectable()
export class MembershipCardsService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: implement generateCard, getCardByMembershipNumber, verifyMembership
}
