import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import type { JwtPayload } from '@csediualumni/types';

import { PrismaService } from '../../../prisma/prisma.service';

/**
 * Validates Bearer access tokens on protected routes.
 * Attaches the JWT payload (including resolved permissions) to req.user.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub, deletedAt: null },
      select: { id: true, isSuspended: true },
    });

    if (!user || user.isSuspended) {
      throw new UnauthorizedException('Account not found or suspended.');
    }

    return payload;
  }
}
