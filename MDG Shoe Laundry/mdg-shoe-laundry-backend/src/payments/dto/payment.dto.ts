import { IsNumber, IsEnum, IsString, IsOptional } from 'class-validator';
import { PaymentMethod } from '@prisma/client';

export class CreatePaymentDto {
  @IsNumber()
  orderId: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsString()
  reference?: string;
}

export class ConfirmPaymentDto {
  @IsString()
  transactionId: string;
}
