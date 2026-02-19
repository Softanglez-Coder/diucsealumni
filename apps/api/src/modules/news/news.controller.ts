import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { NewsService } from './news.service';

@ApiTags('news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  // TODO: implement GET /news, POST /news, GET /news/:slug, POST /news/:id/comments
}
