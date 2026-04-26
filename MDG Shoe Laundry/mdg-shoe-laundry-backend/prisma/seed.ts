import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if a default user exists
  const existingUser = await prisma.user.findFirst({
    where: { email: 'default@mdg.com' },
  });

  if (!existingUser) {
    // Create default user
    const user = await prisma.user.create({
      data: {
        email: 'default@mdg.com',
        password: 'hashed_password', // In production, use bcrypt
        phone: '0000000000',
        role: 'USER',
      },
    });
    console.log('✅ Default user created:', user);
  } else {
    console.log('✅ Default user already exists:', existingUser);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
