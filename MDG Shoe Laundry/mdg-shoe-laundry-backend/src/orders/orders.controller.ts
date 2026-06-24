import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Request,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrdersService } from './orders.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { CreateOrderDto, UpdateOrderDto, UpdateOrderStatusDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  /**
   * Create a new order
   */
  @Post()
  @UseGuards(AuthGuard)
  async create(@Request() req: any, @Body() createOrderDto: CreateOrderDto) {
    console.log('Order Creation Request');
    console.log('  User ID:', req.user?.sub);
    console.log('  User email:', req.user?.email);
    console.log('  Order data:', createOrderDto);
    
    if (!req.user) {
      console.error('No user found in request after AuthGuard');
      throw new Error('User not authenticated');
    }
    
    try {
      // Use req.user.sub instead of req.user.id (JWT payload uses 'sub' for subject/user ID)
      const result = await this.ordersService.create(req.user.sub, createOrderDto);
      console.log('✓ Order created successfully:', result.orderNumber);
      return result;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  /**
   * Get all orders (customers see only theirs, admins see all)
   */
  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Request() req: any,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    // If customer, only return their orders
    const userId = req.user.role === 'CUSTOMER' ? req.user.sub : undefined;
    return await this.ordersService.findAll(userId, parseInt(skip, 10), parseInt(take, 10));
  }

  /**
   * Get order statistics (Admin only)
   */
  @Get('stats/overview')
  @UseGuards(AuthGuard, RolesGuard)
  async getStats() {
    return await this.ordersService.getStats();
  }

  /**
   * Track order by order number (Public)
   */
  @Get('track/:orderNumber')
  async trackOrder(@Param('orderNumber') orderNumber: string) {
    const order = await this.ordersService.findByOrderNumber(orderNumber);
    return {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status,
      pickupDate: order.pickupDate,
      deliveryDate: order.deliveryDate,
      completionDate: order.completionDate,
      isPaid: order.isPaid,
      pickupLocation: order.pickupLocation,
      customerName: order.user ? `${order.user.firstName} ${order.user.lastName}` : 'Customer',
      totalAmount: order.totalAmount,
    };
  }

  /**
   * Get single order
   */
  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Request() req: any, @Param('id') id: string) {
    // Customers can only see their orders
    const userId = req.user.role === 'CUSTOMER' ? req.user.sub : undefined;
    return await this.ordersService.findOne(parseInt(id, 10), userId);
  }

  /**
   * Update order details
   */
  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    // Customers can only update their orders
    const userId = req.user.role === 'CUSTOMER' ? req.user.sub : undefined;
    return await this.ordersService.update(parseInt(id, 10), updateOrderDto, userId);
  }

  /**
   * Update order status (Admin/Staff only)
   */
  @Put(':id/status')
  @UseGuards(AuthGuard, RolesGuard)
  async updateStatus(
    @Param('id') id: string,
    @Body() updateStatusDto: UpdateOrderStatusDto,
  ) {
    return await this.ordersService.updateStatus(parseInt(id, 10), updateStatusDto);
  }

  /**
   * Cancel order
   */
  @Put(':id/cancel')
  @UseGuards(AuthGuard)
  async cancelOrder(@Request() req: any, @Param('id') id: string) {
    const userId = req.user.role === 'CUSTOMER' ? req.user.sub : undefined;
    return await this.ordersService.cancel(parseInt(id, 10), userId);
  }

  /**
   * Mark order as paid
   */
  @Put(':id/mark-paid')
  @UseGuards(AuthGuard, RolesGuard)
  async markAsPaid(@Param('id') id: string) {
    return await this.ordersService.markAsPaid(parseInt(id, 10));
  }

  /**
   * Delete order (only for pending orders)
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Request() req: any, @Param('id') id: string) {
    // Only admins can delete orders
    if (req.user.role !== 'ADMIN') {
      throw new Error('Only admins can delete orders');
    }
    return await this.ordersService.remove(parseInt(id, 10));
  }

  /**
   * Upload shoe photos for AI analysis
   */
  @Post(':id/upload-photos')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @Request() req: any,
    @Param('id') id: string,
    @UploadedFile() file: any,
  ) {
    // For now, just acknowledge the upload
    return {
      success: true,
      message: 'Photo uploaded successfully',
      fileSize: file?.size || 0,
    };
  }
}