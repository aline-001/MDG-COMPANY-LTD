// Mock the generated Prisma client to prevent ES module issues in Jest
jest.mock('../src/generated/prisma', () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({})),
}));
