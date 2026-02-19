import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './modules/auth/auth.module';
import { DonationsModule } from './modules/donations/donations.module';
import { EventsModule } from './modules/events/events.module';
import { ForumModule } from './modules/forum/forum.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { MembersModule } from './modules/members/members.module';
import { MembershipCardsModule } from './modules/membership-cards/membership-cards.module';
import { MentorshipModule } from './modules/mentorship/mentorship.module';
import { NewsModule } from './modules/news/news.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { SearchModule } from './modules/search/search.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Configuration — available app-wide via ConfigService
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // Structured JSON logging via Pino
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const isDev = config.get('NODE_ENV') !== 'production';
        return {
          pinoHttp: {
            level: isDev ? 'debug' : 'info',
            ...(isDev ? { transport: { target: 'pino-pretty', options: { colorize: true } } } : {}),
          },
        };
      },
    }),

    // Rate limiting — 100 requests / 60 s per IP by default
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),

    // BullMQ queues backed by Redis
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        redis: config.getOrThrow<string>('REDIS_URL'),
      }),
    }),

    // Database
    PrismaModule,

    // Feature modules
    AuthModule,
    MembersModule,
    EventsModule,
    NewsModule,
    ForumModule,
    DonationsModule,
    JobsModule,
    MentorshipModule,
    NotificationsModule,
    SearchModule,
    MembershipCardsModule,
  ],
})
export class AppModule {}
