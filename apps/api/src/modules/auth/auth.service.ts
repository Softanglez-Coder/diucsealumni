import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import type { User } from '@csediualumni/prisma';
import type { JwtPayload, AuthResponse } from '@csediualumni/types';

import { PrismaService } from '../../prisma/prisma.service';

import type { LoginDto } from './dto/login.dto';
import type { RegisterDto } from './dto/register.dto';

const BCRYPT_ROUNDS = 12;

interface GoogleProfile {
  googleId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

/**
 * Handles all authentication flows: email/password registration & login,
 * Google OAuth, JWT issuance, token rotation, and logout.
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  // ─── Registration ───────────────────────────────────────────────────────────

  /**
   * Registers a new user with email and password.
   * Sends an email verification link (via the NotificationsModule queue).
   *
   * @throws {ConflictException} If the email is already registered.
   */
  async register(dto: RegisterDto): Promise<{ message: string }> {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('An account with this email already exists.');

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_ROUNDS);

    // Assign the Guest role by default; promoted to Alumni on membership approval
    const guestRole = await this.prisma.role.findUnique({ where: { name: 'Guest' } });

    await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        ...(guestRole ? { roles: { create: { roleId: guestRole.id } } } : {}),
      },
    });

    // TODO: enqueue email verification via BullMQ NotificationsQueue

    return { message: 'Registration successful. Please verify your email address.' };
  }

  // ─── Login ──────────────────────────────────────────────────────────────────

  /**
   * Validates credentials and issues an access + refresh token pair.
   *
   * @throws {UnauthorizedException} If credentials are invalid.
   * @throws {ForbiddenException} If the account is suspended.
   */
  async login(dto: LoginDto, userAgent?: string, ipAddress?: string): Promise<AuthResponse> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email, deletedAt: null },
      include: {
        roles: {
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        },
      },
    });

    if (!user?.passwordHash) throw new UnauthorizedException('Invalid credentials.');
    if (user.isSuspended) throw new ForbiddenException('Account suspended.');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials.');

    return this.issueTokenPair(user, userAgent, ipAddress);
  }

  // ─── Google OAuth ──────────────────────────────────────────────────────────

  /**
   * Finds or creates a user account linked to the provided Google identity.
   * If a password-based account exists for the email, the Google ID is linked.
   *
   * @throws {ForbiddenException} If the existing account is suspended.
   */
  async findOrCreateFromGoogle(profile: GoogleProfile): Promise<User> {
    // Check if already linked to this Google ID
    let user = await this.prisma.user.findUnique({
      where: { googleId: profile.googleId, deletedAt: null },
    });

    if (!user) {
      // Check if an existing password account shares the email
      const existing = await this.prisma.user.findUnique({
        where: { email: profile.email, deletedAt: null },
      });

      if (existing) {
        // Link Google ID to the existing account
        user = await this.prisma.user.update({
          where: { id: existing.id },
          data: { googleId: profile.googleId },
        });
      } else {
        // Create a new account
        const guestRole = await this.prisma.role.findUnique({ where: { name: 'Guest' } });
        user = await this.prisma.user.create({
          data: {
            email: profile.email,
            googleId: profile.googleId,
            firstName: profile.firstName,
            lastName: profile.lastName,
            avatarUrl: profile.avatarUrl,
            isEmailVerified: true, // Google has verified the email
            ...(guestRole ? { roles: { create: { roleId: guestRole.id } } } : {}),
          },
        });
      }
    }

    if (user.isSuspended) throw new ForbiddenException('Account suspended.');

    return user;
  }

  /**
   * Issues an access + refresh token pair after successful Google OAuth.
   */
  async loginWithGoogle(user: User, userAgent?: string, ipAddress?: string): Promise<AuthResponse> {
    const userWithRoles = await this.prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      include: {
        roles: {
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        },
      },
    });
    return this.issueTokenPair(userWithRoles, userAgent, ipAddress);
  }

  // ─── Token rotation ─────────────────────────────────────────────────────────

  /**
   * Validates the refresh token and issues a new access + refresh token pair (rotation).
   *
   * @throws {UnauthorizedException} If the refresh token is invalid or expired.
   */
  async refreshTokens(
    userId: string,
    rawRefreshToken: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthResponse> {
    const storedTokens = await this.prisma.refreshToken.findMany({
      where: { userId, expiresAt: { gt: new Date() } },
    });

    let matchedTokenId: string | null = null;
    for (const token of storedTokens) {
      const valid = await bcrypt.compare(rawRefreshToken, token.tokenHash);
      if (valid) {
        matchedTokenId = token.id;
        break;
      }
    }

    if (!matchedTokenId) throw new UnauthorizedException('Invalid or expired refresh token.');

    // Revoke the used token (rotation)
    await this.prisma.refreshToken.delete({ where: { id: matchedTokenId } });

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: {
        roles: {
          include: { role: { include: { permissions: { include: { permission: true } } } } },
        },
      },
    });

    if (user.isSuspended) throw new ForbiddenException('Account suspended.');

    return this.issueTokenPair(user, userAgent, ipAddress);
  }

  // ─── Logout ──────────────────────────────────────────────────────────────────

  /**
   * Revokes the current session's refresh token.
   */
  async logout(userId: string, rawRefreshToken: string): Promise<void> {
    const tokens = await this.prisma.refreshToken.findMany({ where: { userId } });
    for (const token of tokens) {
      const valid = await bcrypt.compare(rawRefreshToken, token.tokenHash);
      if (valid) {
        await this.prisma.refreshToken.delete({ where: { id: token.id } });
        return;
      }
    }
  }

  /**
   * Revokes all refresh tokens for the user (logs out all devices).
   */
  async logoutAll(userId: string): Promise<void> {
    await this.prisma.refreshToken.deleteMany({ where: { userId } });
  }

  // ─── Email verification ───────────────────────────────────────────────────

  /**
   * Marks the user's email as verified.
   *
   * @throws {NotFoundException} If the user is not found.
   */
  async verifyEmail(userId: string): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found.');
    await this.prisma.user.update({ where: { id: userId }, data: { isEmailVerified: true } });
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────────

  private resolvePermissions(
    roles: Array<{
      role: { permissions: Array<{ permission: { name: string } }> };
    }>,
  ): string[] {
    const set = new Set<string>();
    for (const userRole of roles) {
      for (const rp of userRole.role.permissions) {
        set.add(rp.permission.name);
      }
    }
    return [...set];
  }

  private async issueTokenPair(
    user: User & {
      roles: Array<{ role: { permissions: Array<{ permission: { name: string } }> } }>;
    },
    userAgent?: string,
    ipAddress?: string,
  ): Promise<AuthResponse> {
    const permissions = this.resolvePermissions(user.roles);

    const payload: Omit<JwtPayload, 'iat' | 'exp'> = {
      sub: user.id,
      email: user.email,
      permissions,
    };

    const accessToken = this.jwtService.sign(payload);

    const rawRefreshToken = this.jwtService.sign(payload, {
      secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.config.get('JWT_REFRESH_EXPIRES_IN', '7d'),
    });

    const tokenHash = await bcrypt.hash(rawRefreshToken, BCRYPT_ROUNDS);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash,
        userAgent: userAgent ?? null,
        ipAddress: ipAddress ?? null,
        expiresAt,
      },
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl ?? null,
        permissions,
      },
    };
  }
}
