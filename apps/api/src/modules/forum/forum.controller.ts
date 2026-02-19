import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ForumService } from './forum.service';

@ApiTags('forum')
@Controller('forum')
export class ForumController {
  constructor(private readonly forumService: ForumService) {}

  // TODO: implement GET /forum/categories, GET /forum/threads, POST /forum/threads, POST /forum/threads/:id/posts
}
