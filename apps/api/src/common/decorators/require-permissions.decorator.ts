import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'permissions';

/**
 * Declares the permissions required to access a route.
 * The RbacGuard evaluates this against the user's effective permission set.
 *
 * @example
 * @RequirePermissions('events:create')
 * @Post()
 * async createEvent() { ... }
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
