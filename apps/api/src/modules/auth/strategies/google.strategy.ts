import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type Profile, type VerifyCallback } from 'passport-google-oauth20';

import { AuthService } from '../auth.service';

/**
 * Passport Google OAuth 2.0 strategy.
 * Finds or creates a user account linked to the Google identity.
 */
@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: config.getOrThrow<string>('GOOGLE_CLIENT_ID'),
      clientSecret: config.getOrThrow<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: config.getOrThrow<string>('GOOGLE_CALLBACK_URL'),
      scope: ['openid', 'email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<void> {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        done(new Error('No email returned from Google profile'));
        return;
      }

      const user = await this.authService.findOrCreateFromGoogle({
        googleId: profile.id,
        email,
        firstName: profile.name?.givenName ?? '',
        lastName: profile.name?.familyName ?? '',
        avatarUrl: profile.photos?.[0]?.value ?? null,
      });

      done(null, user);
    } catch (error) {
      done(error as Error);
    }
  }
}
