import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MembersService } from './members.service';

@ApiTags('members')
@Controller('members')
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  // TODO: implement GET /members, GET /members/:username, PATCH /members/me
}
