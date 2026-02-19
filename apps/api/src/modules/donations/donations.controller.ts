import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { DonationsService } from './donations.service';

@ApiTags('donations')
@Controller('donations')
export class DonationsController {
  constructor(private readonly donationsService: DonationsService) {}

  // TODO: implement GET /donations/campaigns, POST /donations, POST /donations/sslcommerz/callback
}
