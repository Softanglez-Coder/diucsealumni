import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Manages in-app notifications: creation, delivery, read status, and user preferences.
 */
@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // TODO: implement listNotifications, markRead, markAllRead, updatePreferences
}
