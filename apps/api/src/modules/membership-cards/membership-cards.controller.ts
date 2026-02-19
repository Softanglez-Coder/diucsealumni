import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MembershipCardsService } from './membership-cards.service';

@ApiTags('membership-cards')
@Controller('membership-cards')
export class MembershipCardsController {
  constructor(private readonly membershipCardsService: MembershipCardsService) {}

  // TODO: implement POST /membership-cards/generate, GET /membership-cards/verify/:membershipNumber
}
