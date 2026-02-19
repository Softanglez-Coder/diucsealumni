import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Handles donation campaigns, payment initiation (SSLCommerz / Stripe),
 * and donation history.
 */
@Injectable()
export class DonationsService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: implement listCampaigns, getCampaign, initiateDonation, handlePaymentCallback, getDonationHistory
}
