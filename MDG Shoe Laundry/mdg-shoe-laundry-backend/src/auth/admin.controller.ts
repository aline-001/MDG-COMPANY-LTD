import { Controller, Post, Body, UseGuards, ForbiddenException, Get, Req } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

/**
 * Admin Controller
 * Handles admin-specific operations like user promotion and management
 * All endpoints require ADMIN role
 */
@Controller('admin')
@UseGuards(AuthGuard)
export class AdminController {
  constructor(private prisma: PrismaService) {}

  /**
   * Get current user info from JWT token
   */
  private async getCurrentUser(req: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: req.user.sub },
    });
    return user;
  }

  /**
   * Verify user has ADMIN role
   */
  private verifyAdminRole(user: any) {
    if (user.role !== UserRole.ADMIN) {
      throw new ForbiddenException('Only admins can access this resource');
    }
  }

  /**
   * POST /api/admin/promote
   * Promote a user to ADMIN role
   * Request body: { userId: number }
   */
  @Post('promote')
  async promoteToAdmin(@Req() req: any, @Body() body: { userId: number }) {
    const currentUser = await this.getCurrentUser(req);
    
    if (!currentUser) {
      throw new ForbiddenException('User not found');
    }
    
    this.verifyAdminRole(currentUser);

    if (!body.userId) {
      throw new ForbiddenException('User ID is required');
    }

    // Check if user exists
    const user = await this.prisma.user.findUnique({
      where: { id: body.userId },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Cannot promote to admin if already admin
    if (user.role === UserRole.ADMIN) {
      throw new ForbiddenException('User is already an admin');
    }

    // Update user role to ADMIN
    const updated = await this.prisma.user.update({
      where: { id: body.userId },
      data: { role: UserRole.ADMIN },
    });

    return {
      success: true,
      message: `User ${updated.email} promoted to ADMIN`,
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        role: updated.role,
      },
    };
  }

  /**
   * POST /api/admin/demote
   * Demote an admin or change staff role
   * Request body: { userId: number, newRole: 'STAFF' | 'CUSTOMER' }
   */
  @Post('demote')
  async changeUserRole(
    @Req() req: any,
    @Body() body: { userId: number; newRole: UserRole },
  ) {
    const currentUser = await this.getCurrentUser(req);
    
    if (!currentUser) {
      throw new ForbiddenException('User not found');
    }
    
    this.verifyAdminRole(currentUser);

    if (!body.userId || !body.newRole) {
      throw new ForbiddenException('User ID and new role are required');
    }

    // Validate new role (Using type assertion array here to keep TypeScript quiet)
    if (!([UserRole.STAFF, UserRole.CUSTOMER] as string[]).includes(body.newRole)) {
      throw new ForbiddenException('Invalid role. Must be STAFF or CUSTOMER');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: body.userId },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Prevent demoting yourself
    if (currentUser.id === body.userId) {
      throw new ForbiddenException('Cannot change your own role');
    }

    const updated = await this.prisma.user.update({
      where: { id: body.userId },
      data: { role: body.newRole },
    });

    return {
      success: true,
      message: `User ${updated.email} role changed to ${body.newRole}`,
      user: {
        id: updated.id,
        email: updated.email,
        firstName: updated.firstName,
        lastName: updated.lastName,
        role: updated.role,
      },
    };
  }

  /**
   * GET /api/admin/users
   * List all admin and staff users
   */
  @Get('users')
  async listAdminUsers(@Req() req: any) {
    const currentUser = await this.getCurrentUser(req);
    
    if (!currentUser) {
      throw new ForbiddenException('User not found');
    }
    
    this.verifyAdminRole(currentUser);

    const users = await this.prisma.user.findMany({
      where: {
        role: {
          in: [UserRole.ADMIN, UserRole.STAFF],
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        phone: true,
        createdAt: true,
        lastLogin: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      total: users.length,
      users,
    };
  }

  /**
   * GET /api/admin/customers
   * List all customer users
   */
  @Get('customers')
  async listCustomers(@Req() req: any) {
    const currentUser = await this.getCurrentUser(req);
    
    if (!currentUser) {
      throw new ForbiddenException('User not found');
    }
    
    this.verifyAdminRole(currentUser);

    const customers = await this.prisma.user.findMany({
      where: { role: UserRole.CUSTOMER },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isActive: true,
        profileImage: true,
        createdAt: true,
        lastLogin: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      success: true,
      total: customers.length,
      customers,
    };
  }

  /**
   * POST /api/admin/deactivate-user
   * Deactivate a user account (soft delete)
   */
  @Post('deactivate-user')
  async deactivateUser(@Req() req: any, @Body() body: { userId: number }) {
    const currentUser = await this.getCurrentUser(req);
    
    if (!currentUser) {
      throw new ForbiddenException('User not found');
    }
    
    this.verifyAdminRole(currentUser);

    if (!body.userId) {
      throw new ForbiddenException('User ID is required');
    }

    // Prevent deactivating yourself
    if (currentUser.id === body.userId) {
      throw new ForbiddenException('Cannot deactivate your own account');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: body.userId },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id: body.userId },
      data: { isActive: false },
    });

    return {
      success: true,
      message: `User ${updated.email} has been deactivated`,
      user: {
        id: updated.id,
        email: updated.email,
        isActive: updated.isActive,
      },
    };
  }

  /**
   * POST /api/admin/activate-user
   * Reactivate a deactivated user account
   */
  @Post('activate-user')
  async activateUser(@Req() req: any, @Body() body: { userId: number }) {
    const currentUser = await this.getCurrentUser(req);
    
    if (!currentUser) {
      throw new ForbiddenException('User not found');
    }
    
    this.verifyAdminRole(currentUser);

    if (!body.userId) {
      throw new ForbiddenException('User ID is required');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: body.userId },
    });

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    const updated = await this.prisma.user.update({
      where: { id: body.userId },
      data: { isActive: true },
    });

    return {
      success: true,
      message: `User ${updated.email} has been activated`,
      user: {
        id: updated.id,
        email: updated.email,
        isActive: updated.isActive,
      },
    };
  }

  /**
   * GET /api/admin/dashboard-stats
   * Get dashboard statistics
   */
  @Get('dashboard-stats')
  async getDashboardStats(@Req() req: any) {
    const currentUser = await this.getCurrentUser(req);
    
    if (!currentUser) {
      throw new ForbiddenException('User not found');
    }
    
    this.verifyAdminRole(currentUser);

    const [totalUsers, totalAdmins, totalCustomers, activeUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: UserRole.ADMIN } }),
      this.prisma.user.count({ where: { role: UserRole.CUSTOMER } }),
      this.prisma.user.count({ where: { isActive: true } }),
    ]);

    return {
      success: true,
      stats: {
        totalUsers,
        totalAdmins,
        totalCustomers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
      },
    };
  }

  /**
   * POST /api/admin/verify-admin
   * Verify current user is admin (for frontend checks)
   */
  @Post('verify-admin')
  async verifyAdmin(@Req() req: any) {
    const currentUser = await this.getCurrentUser(req);
    
    if (!currentUser) {
      throw new ForbiddenException('User not found');
    }

    return {
      success: true,
      isAdmin: currentUser.role === UserRole.ADMIN,
      user: {
        id: currentUser.id,
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        role: currentUser.role,
      },
    };
  }
}