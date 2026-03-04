import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { Public } from '../../common/decorators/public.decorator';

import { CommitteesService } from './committees.service';

@ApiTags('committees')
@Controller('committees')
export class CommitteesController {
  constructor(private readonly committeesService: CommitteesService) {}

  /**
   * Returns the currently active executive committee with all its members.
   * No authentication required — used by the public homepage and committee page.
   */
  @Public()
  @Get('active')
  @ApiOperation({ summary: 'Get the active executive committee and its members' })
  async getActiveCommittee() {
    const committee = await this.committeesService.getActiveCommittee();
    if (!committee) {
      throw new NotFoundException('No active committee found.');
    }
    return committee;
  }
}
