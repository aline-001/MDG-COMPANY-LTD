import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateOrderDto,
  UpdateOrderDto,
  UpdateOrderStatusDto,
} from './dto/create-order.dto';
import { NotificationsService } from '../notifications/notifications.service';

// Use string enum values directly since Prisma may not resolve types correctly
const OrderStatusValues = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  READY_FOR_PICKUP: 'READY_FOR_PICKUP',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    private notificationsService: NotificationsService,
  ) {}

  /**
   * Create a new order
   */
  async create(userId: number, data: CreateOrderDto) {
    try {
      // Get the latest order sequence to generate MDG format (MDG-001, MDG-002, etc.)
      // The database will auto-increment the orderSequence, but we need to format it
      // We'll let Prisma handle the sequence generation and format it in the response
      
      const order = await this.prisma.order.create({
        data: {
          orderNumber: '', // Placeholder, will be set after insert to use orderSequence
          itemType: data.itemType, // Track if this is for shoes or bag
          user: { connect: { id: userId } },
          pickupLocation: data.pickupLocation,
          deliveryLocation: data.deliveryLocation || data.pickupLocation,
          pickupDate: new Date(data.pickupDate),
          notes: data.notes,
          totalAmount: data.totalAmount || 0,
          finalAmount: data.totalAmount || 0,
          status: OrderStatusValues.PENDING,
          ...(data.shoes &&
            data.shoes.length > 0 && {
              shoes: {
                createMany: {
                  data: data.shoes,
                },
              },
            }),
          ...(data.serviceIds &&
            data.serviceIds.length > 0 && {
              services: {
                createMany: {
                  data: data.serviceIds.map((serviceId) => ({
                    serviceId,
                    price: 0, // Will be fetched from service
                  })),
                },
              },
            }),
        },
        include: {
          shoes: true,
          services: {
            include: {
              service: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      });

      // Format order number as MDG-XXX (padded with zeros)
      const paddedSequence = String(order.orderSequence || order.id).padStart(3, '0');
      const formattedOrderNumber = `MDG-${paddedSequence}`;

      // Update the order with the formatted order number
      const updatedOrder = await this.prisma.order.update({
        where: { id: order.id },
        data: { orderNumber: formattedOrderNumber },
        include: {
          shoes: true,
          services: {
            include: {
              service: true,
            },
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              phone: true,
            },
          },
        },
      });

      // Get service names for the confirmation
      const serviceNames = updatedOrder.services
        .map((os) => os.service?.name || 'Service')
        .filter(Boolean);

      // Send comprehensive order confirmation (email + SMS) to customer
      await this.notificationsService.sendOrderConfirmation(userId, {
        orderNumber: updatedOrder.orderNumber,
        totalAmount: updatedOrder.totalAmount,
        pickupDate: updatedOrder.pickupDate,
        services: serviceNames,
        customerName: `${updatedOrder.user?.firstName} ${updatedOrder.user?.lastName}`,
        id: updatedOrder.id,
      });

      // Send admin notification email
      await this.notificationsService.sendAdminOrderNotification({
        orderNumber: updatedOrder.orderNumber,
        customerName: `${updatedOrder.user?.firstName} ${updatedOrder.user?.lastName}`,
        customerEmail: updatedOrder.user?.email || '',
        totalAmount: updatedOrder.totalAmount,
        services: serviceNames,
        pickupLocation: updatedOrder.pickupLocation,
        pickupDate: updatedOrder.pickupDate,
        orderDate: updatedOrder.createdAt,
      });

      return updatedOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw new BadRequestException('Failed to create order');
    }
  }

  /**
   * Get all orders (with filtering for users)
   */
  async findAll(userId?: number, skip = 0, take = 10) {
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: userId ? { userId } : {},
        include: {
          shoes: true,
          services: { include: { service: true } },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          payments: true,
          review: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.order.count({ where: userId ? { userId } : {} }),
    ]);

    return {
      orders,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  /**
   * Get single order
   */
  async findOne(id: number, userId?: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        shoes: true,
        services: { include: { service: true } },
        user: true,
        payments: true,
        review: true,
        files: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    // Check ownership if userId provided
    if (userId && order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  /**
   * Find order by order number
   */
  async findByOrderNumber(orderNumber: string) {
    const order = await this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        shoes: true,
        services: { include: { service: true } },
        user: true,
        payments: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  /**
   * Update order
   */
  async update(id: number, data: UpdateOrderDto, userId?: number) {
    await this.findOne(id, userId);

    return await this.prisma.order.update({
      where: { id },
      data: {
        pickupLocation: data.pickupLocation,
        deliveryLocation: data.deliveryLocation,
        pickupDate: data.pickupDate ? new Date(data.pickupDate) : undefined,
        notes: data.notes,
        aiDiagnosis: data.aiDiagnosis,
      },
      include: {
        shoes: true,
        services: { include: { service: true } },
        user: true,
      },
    });
  }

  /**
   * Update order status
   */
  async updateStatus(id: number, data: UpdateOrderStatusDto) {
    const order = await this.findOne(id);

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: {
        status: data.status,
        completionDate:
          data.status === OrderStatusValues.COMPLETED ? new Date() : null,
      },
      include: {
        shoes: true,
        services: { include: { service: true } },
        user: true,
      },
    });

    // Send status update notification
    if (data.status === OrderStatusValues.READY_FOR_PICKUP) {
      // Send special ready notification with email + SMS
      await this.notificationsService.sendOrderReadyNotification(order.userId);
    } else {
      const statusMessages = {
        [OrderStatusValues.CONFIRMED]: 'Your order has been confirmed!',
        [OrderStatusValues.IN_PROGRESS]: 'Your order is being processed.',
        [OrderStatusValues.COMPLETED]: 'Your order has been completed!',
        [OrderStatusValues.CANCELLED]: 'Your order has been cancelled.',
      };

      await this.notificationsService.sendNotification(
        order.userId,
        statusMessages[data.status] || `Order status updated to ${data.status}`,
        'email',
      );
    }

    return updatedOrder;
  }

  /**
   * Cancel order
   */
  async cancel(id: number, userId?: number) {
    const order = await this.findOne(id, userId);

    if (
      [OrderStatusValues.COMPLETED, OrderStatusValues.CANCELLED].includes(
        order.status as any,
      )
    ) {
      throw new BadRequestException(
        'Cannot cancel completed or already cancelled orders',
      );
    }

    return await this.updateStatus(id, { status: OrderStatusValues.CANCELLED });
  }

  /**
   * Mark order as paid
   */
  async markAsPaid(id: number) {
    await this.findOne(id);

    return await this.prisma.order.update({
      where: { id },
      data: {
        isPaid: true,
        status: OrderStatusValues.CONFIRMED,
      },
      include: {
        shoes: true,
        services: { include: { service: true } },
      },
    });
  }

  /**
   * Get order statistics
   */
  async getStats() {
    const [totalOrders, completedOrders, pendingOrders, totalRevenue] =
      await Promise.all([
        this.prisma.order.count(),
        this.prisma.order.count({
          where: { status: OrderStatusValues.COMPLETED },
        }),
        this.prisma.order.count({
          where: { status: OrderStatusValues.PENDING },
        }),
        this.prisma.order.aggregate({
          where: { status: OrderStatusValues.COMPLETED },
          _sum: { finalAmount: true },
        }),
      ]);

    return {
      totalOrders,
      completedOrders,
      pendingOrders,
      totalRevenue: totalRevenue._sum.finalAmount || 0,
      completionRate:
        totalOrders > 0
          ? String((((completedOrders / totalOrders) * 100) as any).toFixed(2))
          : '0',
    };
  }

  /**
   * Delete order (soft delete via status)
   */
  async remove(id: number) {
    const order = await this.findOne(id);

    if (order.status !== OrderStatusValues.PENDING) {
      throw new BadRequestException('Can only delete pending orders');
    }

    return await this.prisma.order.delete({
      where: { id },
    });
  }
}
