import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    console.log('AuthGuard - Checking authorization...');
    console.log('Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('No authorization header found');
      throw new UnauthorizedException('Missing authorization header');
    }

    // Extract token from "Bearer <token>" format
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      console.error('Invalid authorization header format:', authHeader.substring(0, 20));
      throw new UnauthorizedException('Invalid authorization header format');
    }

    const token = parts[1];
    console.log('Token extracted (first 20 chars):', token.substring(0, 20));

    try {
      const secret = this.configService.get<string>('JWT_SECRET') || 'mdg-shoe-laundry-super-secret-key-2024';
      const payload = await this.jwtService.verifyAsync(token, { secret });
      request['user'] = payload; // Attach user info to the request
      console.log('✓ Token verified for user:', payload.sub);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
    return true;
  }
}