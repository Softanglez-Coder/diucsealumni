import {
  Controller,
  Post,
  Get,
  Body,
  Res,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import type { Response, Request } from 'express';

import type { User } from '@csediualumni/prisma';
import type { JwtPayload } from '@csediualumni/types';

import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { GoogleOAuthGuard } from './guards/google-oauth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';

const REFRESH_TOKEN_COOKIE = 'refresh_token';
const REFRESH_COOKIE_PATH = '/api/v1/auth/refresh';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ─── Email / Password ─────────────────────────────────────────────────────

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'Account created. Verification email sent.' })
  @ApiResponse({ status: 409, description: 'Email already registered.' })
  register(@Body() dto: RegisterDto): Promise<{ message: string }> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Log in with email and password' })
  @ApiResponse({ status: 200, description: 'Access token returned; refresh cookie set.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  async login(
    @Body() dto: LoginDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.login(dto, req.headers['user-agent'], req.ip);
    this.setRefreshCookie(res, result.accessToken);
    return result;
  }

  // ─── Google OAuth ─────────────────────────────────────────────────────────

  @Public()
  @Get('google')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Initiate Google OAuth 2.0 flow' })
  googleAuth(): void {
    // Handled entirely by Passport — redirects to Google consent screen
  }

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleOAuthGuard)
  @ApiOperation({ summary: 'Google OAuth callback' })
  async googleAuthCallback(
    @Req() req: Request & { user: User },
    @Res() res: Response,
  ): Promise<void> {
    const result = await this.authService.loginWithGoogle(
      req.user,
      req.headers['user-agent'],
      req.ip,
    );

    this.setRefreshCookie(res, result.accessToken);

    // Redirect to frontend with access token; frontend removes it from URL immediately
    const frontendCallbackUrl = `${process.env['FRONTEND_URL'] ?? 'http://localhost:3000'}/auth/callback`;
    res.redirect(`${frontendCallbackUrl}?access_token=${result.accessToken}`);
  }

  // ─── Token refresh ────────────────────────────────────────────────────────

  @Public()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using HttpOnly cookie' })
  @ApiResponse({ status: 200, description: 'New token pair issued.' })
  @ApiResponse({ status: 401, description: 'Invalid or expired refresh token.' })
  async refresh(
    @Req() req: Request & { user: JwtPayload },
    @Res({ passthrough: true }) res: Response,
  ) {
    const rawRefreshToken = (req.cookies as Record<string, string>)[REFRESH_TOKEN_COOKIE] ?? '';
    const result = await this.authService.refreshTokens(
      req.user.sub,
      rawRefreshToken,
      req.headers['user-agent'],
      req.ip,
    );
    this.setRefreshCookie(res, result.accessToken);
    return result;
  }

  // ─── Logout ───────────────────────────────────────────────────────────────

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out of the current session' })
  async logout(
    @CurrentUser() user: JwtPayload,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    const rawRefreshToken = (req.cookies as Record<string, string>)[REFRESH_TOKEN_COOKIE] ?? '';
    await this.authService.logout(user.sub, rawRefreshToken);
    this.clearRefreshCookie(res);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Log out of all sessions on all devices' })
  async logoutAll(
    @CurrentUser() user: JwtPayload,
    @Res({ passthrough: true }) res: Response,
  ): Promise<void> {
    await this.authService.logoutAll(user.sub);
    this.clearRefreshCookie(res);
  }

  // ─── Current user ─────────────────────────────────────────────────────────

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current authenticated user info from token' })
  me(@CurrentUser() user: JwtPayload): JwtPayload {
    return user;
  }

  // ─── Cookie helpers ──────────────────────────────────────────────────────

  private setRefreshCookie(res: Response, token: string): void {
    res.cookie(REFRESH_TOKEN_COOKIE, token, {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      path: REFRESH_COOKIE_PATH,
      maxAge: SEVEN_DAYS_MS,
    });
  }

  private clearRefreshCookie(res: Response): void {
    res.cookie(REFRESH_TOKEN_COOKIE, '', {
      httpOnly: true,
      secure: process.env['NODE_ENV'] === 'production',
      sameSite: 'strict',
      path: REFRESH_COOKIE_PATH,
      maxAge: 0,
    });
  }
}
