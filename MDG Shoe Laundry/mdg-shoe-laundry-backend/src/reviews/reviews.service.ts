import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a review for a completed order
   */
  async create(userId: number, orderId: number, data: CreateReviewDto) {
    // Check if order exists and belongs to user
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    // Check if order is completed
    if (order.status !== 'COMPLETED') {
      throw new BadRequestException('Can only review completed orders');
    }

    // Check if user already reviewed this order
    const existingReview = await this.prisma.review.findUnique({
      where: { orderId },
    });

    if (existingReview) {
      throw new BadRequestException('You have already reviewed this order');
    }

    return await this.prisma.review.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
        order: { connect: { id: orderId } },
      },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profileImage: true,
          },
        },
      },
    });
  }

  /**
   * Get all approved reviews (paginated)
   */
  async findAll(skip = 0, take = 10) {
    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { isApproved: true },
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              profileImage: true,
            },
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              createdAt: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      this.prisma.review.count({ where: { isApproved: true } }),
    ]);

    return {
      reviews,
      total,
      page: Math.floor(skip / take) + 1,
      pages: Math.ceil(total / take),
    };
  }

  /**
   * Get reviews for a specific user
   */
  async findByUser(userId: number) {
    return await this.prisma.review.findMany({
      where: { userId },
      include: {
        order: {
          select: {
            id: true,
            orderNumber: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get review by ID
   */
  async findOne(id: number) {
    return await this.prisma.review.findUnique({
      where: { id },
      include: {
        user: true,
        order: true,
      },
    });
  }

  /**
   * Update review
   */
  async update(userId: number, id: number, data: UpdateReviewDto) {
    const review = await this.findOne(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('You can only update your own reviews');
    }

    return await this.prisma.review.update({
      where: { id },
      data,
      include: {
        user: true,
        order: true,
      },
    });
  }

  /**
   * Delete review
   */
  async remove(userId: number, id: number) {
    const review = await this.findOne(id);

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId) {
      throw new BadRequestException('You can only delete your own reviews');
    }

    return await this.prisma.review.delete({
      where: { id },
    });
  }

  /**
   * Approve review (Admin only)
   */
  async approve(id: number) {
    return await this.prisma.review.update({
      where: { id },
      data: { isApproved: true },
    });
  }

  /**
   * Get average rating
   */
  async getAverageRating() {
    const result = await this.prisma.review.aggregate({
      where: { isApproved: true },
      _avg: { rating: true },
      _count: true,
    });

    return {
      averageRating: result._avg.rating || 0,
      totalReviews: result._count,
    };
  }
}
