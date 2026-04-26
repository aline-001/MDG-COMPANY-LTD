import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  /**
   * Create a review for an order
   */
  @Post('order/:orderId')
  @UseGuards(AuthGuard)
  async create(
    @Request() req: any,
    @Param('orderId') orderId: string,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return await this.reviewsService.create(req.user.id, parseInt(orderId), createReviewDto);
  }

  /**
   * Get all approved reviews (paginated)
   */
  @Get()
  async findAll(@Query('skip') skip = 0, @Query('take') take = 10) {
    return await this.reviewsService.findAll(parseInt(skip), parseInt(take));
  }

  /**
   * Get average rating
   */
  @Get('stats/average')
  async getAverageRating() {
    return await this.reviewsService.getAverageRating();
  }

  /**
   * Get reviews for current user
   */
  @Get('my-reviews')
  @UseGuards(AuthGuard)
  async getMyReviews(@Request() req: any) {
    return await this.reviewsService.findByUser(req.user.id);
  }

  /**
   * Get single review
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reviewsService.findOne(parseInt(id));
  }

  /**
   * Update review
   */
  @Put(':id')
  @UseGuards(AuthGuard)
  async update(
    @Request() req: any,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    return await this.reviewsService.update(req.user.id, parseInt(id), updateReviewDto);
  }

  /**
   * Delete review
   */
  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Request() req: any, @Param('id') id: string) {
    return await this.reviewsService.remove(req.user.id, parseInt(id));
  }

  /**
   * Approve review (Admin only)
   */
  @Put(':id/approve')
  @UseGuards(AuthGuard, RolesGuard)
  async approve(@Param('id') id: string) {
    return await this.reviewsService.approve(parseInt(id));
  }
}
