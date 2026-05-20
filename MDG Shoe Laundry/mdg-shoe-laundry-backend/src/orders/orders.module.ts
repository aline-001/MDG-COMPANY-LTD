import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaModule } from '../prisma/prisma.module';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthModule } from '../auth/auth.module'; 
@Module({
  imports: [PrismaModule, NotificationsModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService]
})
export class OrdersModule {}
