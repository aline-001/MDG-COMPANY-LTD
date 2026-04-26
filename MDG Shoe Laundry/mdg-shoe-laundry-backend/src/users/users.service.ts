import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(email: string, pass: string, phone: string) {
    
    const salt = await bcrypt.genSalt(10); // makes the hash unique even if two users have the same password
    const hashedPassword = await bcrypt.hash(pass, salt);

    return this.prisma.user.create({
      data: {
        email: email,
        password: hashedPassword, // Saving the gibberish(encrypted, unknown), not the password
        phone: phone,
      },
    });
  }
}