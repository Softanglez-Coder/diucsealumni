import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { JwtPayload } from '@csediualumni/types';

/**
 * Extracts the authenticated user's JWT payload from the request.
 *
 * @example
 * @Get('me')
 * getMe(@CurrentUser() user: JwtPayload) { ... }
 */
export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext): JwtPayload => {
    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    return request.user;
  },
);
