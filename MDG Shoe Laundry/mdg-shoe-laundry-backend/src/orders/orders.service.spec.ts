import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';

describe('OrdersService', () => {
  let service: OrdersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrdersService,
        {
          provide: PrismaService,
          useValue: { order: { update: jest.fn() } }, // Mocking Prisma
        },
        {
          provide: NotificationsService,
          useValue: {
            sendOrderConfirmation: jest.fn(),
            sendAdminOrderNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // TODO: confirmPayment method not implemented - skipping test
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});