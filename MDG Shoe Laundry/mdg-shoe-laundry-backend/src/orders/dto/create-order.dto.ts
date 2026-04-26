import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  ValidateNested,
  Min,
  IsDefined,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '../../generated/prisma';

export class CreateShoeDto {
  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsString()
  material?: string;
}

export class CreateOrderDto {
  @IsString()
  pickupLocation: string;

  @IsOptional()
  @IsString()
  deliveryLocation?: string;

  @IsDateString()
  pickupDate: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  totalAmount?: number;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  aiDiagnosis?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateShoeDto)
  shoes?: CreateShoeDto[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  serviceIds?: number[];
}

export class UpdateOrderDto {
  @IsOptional()
  @IsString()
  pickupLocation?: string;

  @IsOptional()
  @IsString()
  deliveryLocation?: string;

  @IsOptional()
  @IsDateString()
  pickupDate?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  aiDiagnosis?: string;
}

export class UpdateOrderStatusDto {
  @IsDefined()
  status: OrderStatus;
}