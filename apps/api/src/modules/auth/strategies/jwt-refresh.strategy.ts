import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { JwtPayload } from '@csediualumni/types';

/**
 * Validates the refresh token from the HttpOnly cookie.
 * Used exclusively by POST /auth/refresh.
 */
@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) =>
          (req.cookies as Record<string, string | undefined>)['refresh_token'] ?? null,
      ]),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(_req: Request, payload: JwtPayload): JwtPayload {
    return payload;
  }
}
