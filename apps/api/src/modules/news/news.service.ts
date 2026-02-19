import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Handles news article creation, publishing, archiving, and comment moderation.
 */
@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: implement createArticle, listArticles, getArticle, publishArticle, archiveArticle, addComment
}
