import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: UserRole;
    profileImage?: string;
  };
}

@Injectable()
export class AuthService {
  private readonly BCRYPT_ROUNDS = 10;
  private readonly REFRESH_TOKEN_EXPIRY = '7d';
  private readonly ACCESS_TOKEN_EXPIRY = '1h';
  private readonly PASSWORD_RESET_TOKEN_EXPIRY = '1h'; // 1 hour expiry for reset token

  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Register a new user
   */
  async register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phone: string,
  ): Promise<TokenResponse> {
    // Validate input
    if (!email || !password || !firstName || !lastName || !phone) {
      throw new BadRequestException('Missing required fields');
    }

    if (password.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, this.BCRYPT_ROUNDS);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        role: UserRole.CUSTOMER, // Default role for new registrations
      },
    });

    return this.generateTokens(user);
  }

  /**
   * Login user
   */
  async login(email: string, password: string): Promise<TokenResponse> {
    if (!email || !password) {
      throw new BadRequestException('Email and password are required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return this.generateTokens(user);
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<{ access_token: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      }) as JwtPayload;

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const accessToken = this.jwtService.sign(
        {
          sub: user.id,
          email: user.email,
          role: user.role,
        },
        { expiresIn: this.ACCESS_TOKEN_EXPIRY },
      );

      return { access_token: accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  /**
   * Verify JWT token
   */
  async verifyToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(token) as JwtPayload;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  /**
   * Generate access and refresh tokens
   */
  private async generateTokens(user: any): Promise<TokenResponse> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.ACCESS_TOKEN_EXPIRY,
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: this.REFRESH_TOKEN_EXPIRY,
      }),
    ]);

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImage: user.profileImage,
      },
    };
  }

  /**
   * Logout user (client-side token deletion)
   */
  async logout(): Promise<{ message: string }> {
    return { message: 'Logout successful' };
  }

  /**
   * Forgot password - Generate reset token and send email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    if (!email) {
      throw new BadRequestException('Email is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security, return success even if user doesn't exist
      return { message: 'If an account exists with this email, a reset link will be sent' };
    }

    // Generate reset token (JWT with short expiry)
    const resetToken = this.jwtService.sign(
      { sub: user.id, email: user.email, type: 'password_reset' },
      { expiresIn: this.PASSWORD_RESET_TOKEN_EXPIRY, secret: process.env.JWT_RESET_SECRET || 'reset-secret' }
    );

    // Store the reset token and expiry in database
    const tokenExpiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpiry: tokenExpiry,
      },
    });

    // Send reset email
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
        <div style="background: linear-gradient(135deg, #0E8FDD 0%, #0A5FA0 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset Request</h1>
        </div>

        <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="color: #374151; font-size: 16px;">Hi ${user.firstName},</p>
          
          <p style="color: #374151; line-height: 1.6;">
            We received a request to reset your password. Click the button below to create a new password. This link expires in 1 hour.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" style="background: #0E8FDD; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>

          <p style="color: #6b7280; font-size: 14px;">
            If the button doesn't work, copy this link into your browser:<br>
            <span style="word-break: break-all; color: #0E8FDD;">${resetLink}</span>
          </p>

          <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; margin-top: 20px;">
            <p style="margin: 0; color: #b45309;"><strong>⚠️ Security Notice</strong></p>
            <p style="margin: 10px 0 0 0; color: #b45309; font-size: 14px;">
              If you didn't request this password reset, please ignore this email or contact our support team.
            </p>
          </div>

          <p style="color: #6b7280; margin-top: 30px; text-align: center; font-size: 14px;">
            Questions? Contact us at support@mdgshoelaundry.com
          </p>
        </div>

        <div style="text-align: center; padding: 20px 0; color: #6b7280; font-size: 12px;">
          <p style="margin: 0;">© 2026 MDG Shoe Laundry. All rights reserved.</p>
        </div>
      </div>
    `;

    await this.notificationsService.sendEmail(user.email, 'Password Reset Request - MDG Shoe Laundry', htmlContent);

    return { message: 'Password reset link has been sent to your email' };
  }

  /**
   * Reset password using token
   */
  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    if (!token || !newPassword) {
      throw new BadRequestException('Token and new password are required');
    }

    if (newPassword.length < 8) {
      throw new BadRequestException('Password must be at least 8 characters');
    }

    try {
      // Verify the reset token
      const payload = this.jwtService.verify(token, {
        secret: process.env.JWT_RESET_SECRET || 'reset-secret',
      }) as any;

      // Check if user exists and token is still valid
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid reset token');
      }

      if (!user.passwordResetToken || user.passwordResetToken !== token) {
        throw new UnauthorizedException('Invalid reset token');
      }

      if (!user.passwordResetExpiry || user.passwordResetExpiry < new Date()) {
        throw new UnauthorizedException('Reset token has expired');
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, this.BCRYPT_ROUNDS);

      // Update password and clear reset token
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          passwordResetToken: null,
          passwordResetExpiry: null,
        },
      });

      // Send confirmation email
      const confirmationEmail = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">✓ Password Changed Successfully</h1>
          </div>

          <div style="background: white; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p style="color: #374151; font-size: 16px;">Hi ${user.firstName},</p>
            
            <p style="color: #374151; line-height: 1.6;">
              Your password has been successfully changed. You can now log in with your new password.
            </p>

            <p style="color: #6b7280; margin-top: 30px; text-align: center; font-size: 14px;">
              Questions? Contact us at support@mdgshoelaundry.com
            </p>
          </div>

          <div style="text-align: center; padding: 20px 0; color: #6b7280; font-size: 12px;">
            <p style="margin: 0;">© 2026 MDG Shoe Laundry. All rights reserved.</p>
          </div>
        </div>
      `;

      await this.notificationsService.sendEmail(user.email, 'Password Changed Successfully - MDG Shoe Laundry', confirmationEmail);

      return { message: 'Password has been reset successfully' };
    } catch (error) {
      if (error instanceof UnauthorizedException || error instanceof BadRequestException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid or expired reset token');
    }
  }
}