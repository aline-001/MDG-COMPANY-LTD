import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';

@Injectable()
export class ServicesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new shoe laundry service
   */
  async create(data: CreateServiceDto) {
    return await this.prisma.service.create({
      data,
    });
  }

  /**
   * Get all active services
   */
  async findAll(includeInactive = false) {
    return await this.prisma.service.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { basePrice: 'asc' },
    });
  }

  /**
   * Get a single service by ID
   */
  async findOne(id: number) {
    return await this.prisma.service.findUnique({
      where: { id },
    });
  }

  /**
   * Update a service
   */
  async update(id: number, data: UpdateServiceDto) {
    return await this.prisma.service.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a service
   */
  async remove(id: number) {
    return await this.prisma.service.delete({
      where: { id },
    });
  }

  /**
   * Toggle service active status
   */
  async toggleActive(id: number) {
    const service = await this.findOne(id);
    
    if (!service) {
      throw new Error('Service not found');
    }
    
    return await this.prisma.service.update({
      where: { id },
      data: { isActive: !service.isActive },
    });
  }
}
