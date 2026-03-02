import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';

import { StatsService } from './stats.service';

@ApiTags('stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  /**
   * Returns aggregate platform statistics for the public homepage.
   * No authentication required.
   */
  @Public()
  @Get()
  @ApiOperation({ summary: 'Get live platform statistics (alumni count, events, jobs, mentors)' })
  getPlatformStats() {
    return this.statsService.getPlatformStats();
  }
}
