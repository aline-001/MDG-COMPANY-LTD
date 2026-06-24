import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module'; // 1. Add this import

@Module({
  imports: [
    PrismaModule,
    AuthModule, 
  ],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}