import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePaymentDto } from './dto/payment.dto';
import { PaymentStatus, PaymentMethod } from '../generated/prisma';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a payment
   */
  async create(userId: number, orderId: number, data: CreatePaymentDto) {
    // Verify order exists and belongs to user
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    if (order.isPaid) {
      throw new BadRequestException('Order is already paid');
    }

    // Generate transaction ID
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

    // Create payment (in real app, integrate with payment gateway)
    const payment = await this.prisma.payment.create({
      data: {
        transactionId,
        amount: order.finalAmount,
        status: PaymentStatus.PENDING,
        method: data.method,
        reference: data.reference,
        user: { connect: { id: userId } },
        order: { connect: { id: orderId } },
      },
    });

    return payment;
  }

  /**
   * Confirm payment
   */
  async confirmPayment(transactionId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { transactionId },
      include: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== PaymentStatus.PENDING) {
      throw new BadRequestException('Payment already processed');
    }

    // Update payment status
    const updatedPayment = await this.prisma.payment.update({
      where: { transactionId },
      data: { status: PaymentStatus.COMPLETED },
    });

    // Mark order as paid
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { isPaid: true },
    });

    return updatedPayment;
  }

  /**
   * Get payment by transaction ID
   */
  async findByTransactionId(transactionId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { transactionId },
      include: {
        order: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    return payment;
  }

  /**
   * Get user's payments
   */
  async findByUser(userId: number, skip = 0, take = 10) {
    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        where: { userId },
        include: {
          order: {
            select: {
              id: true,
              orderNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.payment.count({ where: { userId } }),
    ]);

    return {
      payments,
      total,
      page: Math.floor(skip / take) + 1,
    };
  }

  /**
   * Get all payments (Admin only)
   */
  async findAll(skip = 0, take = 10) {
    const [payments, total] = await Promise.all([
      this.prisma.payment.findMany({
        include: {
          order: true,
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.payment.count(),
    ]);

    return {
      payments,
      total,
      page: Math.floor(skip / take) + 1,
    };
  }

  /**
   * Refund payment
   */
  async refund(transactionId: string) {
    const payment = await this.findByTransactionId(transactionId);

    if (payment.status !== PaymentStatus.COMPLETED) {
      throw new BadRequestException('Only completed payments can be refunded');
    }

    // Update payment status
    const refundedPayment = await this.prisma.payment.update({
      where: { transactionId },
      data: { status: PaymentStatus.REFUNDED },
    });

    // Mark order as unpaid
    await this.prisma.order.update({
      where: { id: payment.orderId },
      data: { isPaid: false },
    });

    return refundedPayment;
  }

  /**
   * Get revenue statistics
   */
  async getRevenue() {
    const [totalRevenue, completedPayments, failedPayments, refundedAmount] = await Promise.all([
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.COMPLETED },
        _sum: { amount: true },
      }),
      this.prisma.payment.count({ where: { status: PaymentStatus.COMPLETED } }),
      this.prisma.payment.count({ where: { status: PaymentStatus.FAILED } }),
      this.prisma.payment.aggregate({
        where: { status: PaymentStatus.REFUNDED },
        _sum: { amount: true },
      }),
    ]);

    return {
      totalRevenue: totalRevenue._sum.amount || 0,
      completedPayments,
      failedPayments,
      refundedAmount: refundedAmount._sum.amount || 0,
    };
  }
}
