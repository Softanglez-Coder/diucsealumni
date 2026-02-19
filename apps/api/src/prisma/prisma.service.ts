import { Injectable, OnModuleInit } from '@nestjs/common';

import { PrismaClient } from '@csediualumni/prisma';

/**
 * Wraps the PrismaClient and connects on module initialisation.
 * Inject this service wherever database access is needed.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }
}
