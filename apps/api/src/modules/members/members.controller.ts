import { Controller, Get, Patch, Param, Query, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import type { JwtPayload } from '@csediualumni/types';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

import { MembersService } from './members.service';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // ─── Authenticated current user ─────────────────────────────────────────────────

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get the current user\u2019s full profile and membership info' })
  getMe(@CurrentUser() user: JwtPayload) {
    return this.membersService.getMe(user.sub);
  }

  @Patch('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update the current user\u2019s profile' })
  updateMe(
    @CurrentUser() user: JwtPayload,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    @Body() dto: any,
  ) {
    return this.membersService.updateMe(user.sub, dto);
  }

  @Get('me/activity')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get the current user\u2019s activity (RSVPs, donations, posts, mentorship)',
  })
  getMyActivity(@CurrentUser() user: JwtPayload) {
    return this.membersService.getMyActivity(user.sub);
  }

  // ─── Directory listing (requires auth) ─────────────────────────────────────────

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List alumni directory (auth required)' })
  listMembers(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('batch') batch?: string,
  ) {
    return this.membersService.listMembers({
      ...(page !== undefined && { page: Number(page) }),
      ...(limit !== undefined && { limit: Number(limit) }),
      ...(search !== undefined && { search }),
      ...(batch !== undefined && { batch: Number(batch) }),
    });
  }

  // ─── Public profile by username ──────────────────────────────────────────────────

  @Public()
  @Get(':username')
  @ApiOperation({ summary: 'Get a member\u2019s public profile by username' })
  getMemberProfile(@Param('username') username: string) {
    return this.membersService.getMemberProfile(username);
  }
}
