import { Injectable, ForbiddenException } from '@nestjs/common';

import { buildPaginationMeta } from '@csediualumni/types';

import { PrismaService } from '../../prisma/prisma.service';

/**
 * Manages in-app notifications: creation, delivery, read status, and user preferences.
 */
@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  // ─── List ────────────────────────────────────────────────────────────────────────────────

  /**
   * Returns a paginated list of notifications for the given user.
   */
  async listNotifications(userId: string, query: { page?: number; limit?: number } = {}) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const skip = (page - 1) * limit;

    const [notifications, total] = await this.prisma.$transaction([
      this.prisma.notification.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.notification.count({ where: { userId } }),
    ]);

    return { notifications, meta: buildPaginationMeta(page, limit, total) };
  }

  // ─── Unread count ──────────────────────────────────────────────────────────────────────

  /**
   * Returns the count of unread notifications for the given user.
   */
  async getUnreadCount(userId: string): Promise<{ unread: number }> {
    const unread = await this.prisma.notification.count({
      where: { userId, isRead: false },
    });
    return { unread };
  }

  // ─── Mark read ────────────────────────────────────────────────────────────────────────

  /**
   * Marks a single notification as read (only if it belongs to the user).
   *
   * @throws {ForbiddenException} If the notification belongs to a different user.
   */
  async markRead(userId: string, notificationId: string) {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });
    if (!notification || notification.userId !== userId) {
      throw new ForbiddenException('Notification not found.');
    }
    await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });
    return { message: 'Marked as read.' };
  }

  /**
   * Marks all of the user's notifications as read.
   */
  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
    return { message: 'All notifications marked as read.' };
  }
}
