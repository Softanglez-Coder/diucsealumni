import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Handles forum categories, threads, posts, voting, and moderation.
 */
@Injectable()
export class ForumService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: implement listCategories, createThread, getThread, addPost, votePost, flagPost
}
