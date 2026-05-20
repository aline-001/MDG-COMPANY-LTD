import { Controller, Get, Post, Body, Param, Put, Delete, UseGuards } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/service.dto';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '@prisma/client';
import { Reflector } from '@nestjs/core';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /**
   * Get all active services (Public)
   */
  @Get()
  async findAll() {
    return await this.servicesService.findAll();
  }

  /**
   * Get service by ID (Public)
   */
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.servicesService.findOne(parseInt(id));
  }

  /**
   * Create new service (Admin only)
   */
  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body() createServiceDto: CreateServiceDto) {
    return await this.servicesService.create(createServiceDto);
  }

  /**
   * Update service (Admin only)
   */
  @Put(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return await this.servicesService.update(parseInt(id), updateServiceDto);
  }

  /**
   * Delete service (Admin only)
   */
  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  async remove(@Param('id') id: string) {
    return await this.servicesService.remove(parseInt(id));
  }

  /**
   * Toggle service active status (Admin only)
   */
  @Put(':id/toggle-active')
  @UseGuards(AuthGuard, RolesGuard)
  async toggleActive(@Param('id') id: string) {
    return await this.servicesService.toggleActive(parseInt(id));
  }
}
