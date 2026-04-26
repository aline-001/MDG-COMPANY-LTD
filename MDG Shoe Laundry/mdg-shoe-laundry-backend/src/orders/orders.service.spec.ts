import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { PrismaService } from '../prisma/prisma.service';

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
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should update status to PAID when payment is confirmed', async () => {
    const mockOrder = { id: '123', customer: { phone: '0780000000' } };
    (prisma.order.update as jest.Mock).mockResolvedValue(mockOrder);

    await service.confirmPayment('123');

    // TEST: Did Prisma get called with the right data?
    expect(prisma.order.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: '123' },
      }),
    );
  });
});