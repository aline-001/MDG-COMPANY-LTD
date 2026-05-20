import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

export const ROLES_KEY = 'roles';

/**
 * Decorator to specify required roles for a route
 */
export function RequireRoles(...roles: UserRole[]) {
  return SetMetadata(ROLES_KEY, roles);
}

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<UserRole[]>(ROLES_KEY, context.getHandler());

    // If no roles are specified, allow access
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No user found in request');
    }

    // Check if user has one of the required roles
    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(`You must have one of these roles: ${requiredRoles.join(', ')}`);
    }

    return true;
  }
}
