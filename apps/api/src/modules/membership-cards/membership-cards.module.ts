import { Module } from '@nestjs/common';

import { MembershipCardsController } from './membership-cards.controller';
import { MembershipCardsService } from './membership-cards.service';

@Module({
  controllers: [MembershipCardsController],
  providers: [MembershipCardsService],
  exports: [MembershipCardsService],
})
export class MembershipCardsModule {}
