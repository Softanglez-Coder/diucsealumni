import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Handles mentor registration, mentorship requests, acceptance, and feedback.
 */
@Injectable()
export class MentorshipService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: implement registerMentor, listMentors, requestMentor, acceptRequest, declineRequest, submitFeedback
}
