import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marks a route as public — bypasses the JwtAuthGuard.
 *
 * @example
 * @Public()
 * @Post('login')
 * login(@Body() dto: LoginDto) { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
