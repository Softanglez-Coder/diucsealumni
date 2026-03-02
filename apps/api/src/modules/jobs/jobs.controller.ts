import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';

import { JobsService } from './jobs.service';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'List published jobs (public, paginated)' })
  listJobs(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('jobType') jobType?: string,
    @Query('search') search?: string,
  ) {
    return this.jobsService.listJobs({
      ...(page !== undefined && { page: Number(page) }),
      ...(limit !== undefined && { limit: Number(limit) }),
      ...(jobType !== undefined && { jobType }),
      ...(search !== undefined && { search }),
    });
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single job posting (public)' })
  getJob(@Param('id') id: string) {
    return this.jobsService.getJob(id);
  }
}
