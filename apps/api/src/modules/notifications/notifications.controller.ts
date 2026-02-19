import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { NotificationsService } from './notifications.service';

@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  // TODO: implement GET /notifications, PATCH /notifications/:id/read, PATCH /notifications/read-all
}
