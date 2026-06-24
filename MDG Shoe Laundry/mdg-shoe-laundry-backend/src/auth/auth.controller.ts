import { Controller, Post, Body, UseGuards, Get, Request, HttpCode, Put, Patch } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { RegisterDto, LoginDto, RefreshTokenDto, ForgotPasswordDto, ResetPasswordDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  /**
   * POST /auth/register
   * Register a new user
   */
  @Post('register')
  @HttpCode(201)
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(
      registerDto.email,
      registerDto.password,
      registerDto.firstName,
      registerDto.lastName,
      registerDto.phone,
    );
  }

  /**
   * POST /auth/login
   * Login user with email and password
   */
  @Post('login')
  @HttpCode(200)
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto.email, loginDto.password);
  }

  /**
   * POST /auth/refresh
   * Refresh access token using refresh token
   */
  @Post('refresh')
  @HttpCode(200)
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto.refresh_token);
  }

  /**
   * GET /auth/me
   * Get current user info (requires auth)
   */
  @Get('me')
  @UseGuards(AuthGuard)
  async getCurrentUser(@Request() req: any) {
    return await this.authService.getCurrentUser(req.user.sub);
  }

  /**
   * POST /auth/logout
   * Logout user (client-side token deletion)
   */
  @Post('logout')
  @HttpCode(200)
  async logout() {
    return await this.authService.logout();
  }

  /**
   * POST /auth/forgot-password
   * Request password reset email
   */
  @Post('forgot-password')
  @HttpCode(200)
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return await this.authService.forgotPassword(forgotPasswordDto.email);
  }

  /**
   * POST /auth/reset-password
   * Reset password using token from email
   */
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return await this.authService.resetPassword(resetPasswordDto.token, resetPasswordDto.newPassword);
  }

  /**
   * PUT /auth/profile
   * Update current user profile (requires auth)
   */
  @Put('profile')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async updateProfile(
    @Request() req: any,
    @Body() updateData: { firstName?: string; lastName?: string; phone?: string; address?: string; city?: string; zipCode?: string }
  ) {
    return await this.authService.updateProfile(req.user.sub, updateData);
  }

  /**
   * POST /auth/change-password
   * Change password (requires auth)
   */
  @Post('change-password')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async changePassword(
    @Request() req: any,
    @Body() data: { oldPassword: string; newPassword: string }
  ) {
    return await this.authService.changePassword(req.user.sub, data.oldPassword, data.newPassword);
  }
}
