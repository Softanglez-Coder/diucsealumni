import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import type { JwtPayload } from '@csediualumni/types';

import { PERMISSIONS_KEY } from '../decorators/require-permissions.decorator';

/**
 * Dynamic RBAC guard.
 * Checks the authenticated user's effective permissions (resolved from the JWT payload)
 * against the permissions declared on the route via @RequirePermissions().
 * Never checks role names — only permission names (e.g., 'events:create').
 */
@Injectable()
export class RbacGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // No permission requirements on this route
    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest<{ user?: JwtPayload }>();
    const user = request.user;

    if (!user) throw new ForbiddenException('Authentication required.');

    const hasAll = required.every((perm) => user.permissions.includes(perm));

    if (!hasAll) {
      throw new ForbiddenException(`Insufficient permissions. Required: ${required.join(', ')}`);
    }

    return true;
  }
}
