import { Controller, Get, Post, Body, Param, Put, UseGuards, Request, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto, ConfirmPaymentDto } from './dto/payment.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /**
   * Create a payment for an order
   */
  @Post()
  @UseGuards(AuthGuard)
  async create(
    @Request() req: any,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return await this.paymentsService.create(
      req.user.id,
      createPaymentDto.orderId,
      createPaymentDto,
    );
  }

  /**
   * Confirm payment
   */
  @Post('confirm')
  async confirmPayment(@Body() confirmPaymentDto: ConfirmPaymentDto) {
    return await this.paymentsService.confirmPayment(confirmPaymentDto.transactionId);
  }

  /**
   * Get payment by transaction ID
   */
  @Get('transaction/:transactionId')
  async findByTransaction(@Param('transactionId') transactionId: string) {
    return await this.paymentsService.findByTransactionId(transactionId);
  }

  /**
   * Get user's payments
   */
  @Get('my-payments')
  @UseGuards(AuthGuard)
  async getMyPayments(
    @Request() req: any,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    return await this.paymentsService.findByUser(req.user.id, parseInt(skip, 10), parseInt(take, 10));
  }

  /**
   * Get all payments (Admin only)
   */
  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  async findAll(
    @Query('skip') skip: string = '0', 
    @Query('take') take: string = '10'
  ) {
    return await this.paymentsService.findAll(parseInt(skip, 10), parseInt(take, 10));
  }

  /**
   * Get payment statistics (Admin only)
   */
  @Get('stats/revenue')
  @UseGuards(AuthGuard, RolesGuard)
  async getRevenue() {
    return await this.paymentsService.getRevenue();
  }

  /**
   * Refund payment (Admin only)
   */
  @Put(':transactionId/refund')
  @UseGuards(AuthGuard, RolesGuard)
  async refund(@Param('transactionId') transactionId: string) {
    return await this.paymentsService.refund(transactionId);
  }
}