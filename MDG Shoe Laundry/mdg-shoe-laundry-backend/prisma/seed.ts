import { PrismaClient } from '@prisma/client';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const BCRYPT_ROUNDS = 10;
  const defaultPassword = 'Admin@123'; // Default admin password

  // Admin users to seed
  const adminUsers = [
    {
      email: 'asimwealine2004@gmail.com',
      firstName: 'Aline',
      lastName: 'Asimwe',
      phone: '+250788000001',
    },
    {
      email: 'albertmendolza295@gmail.com',
      firstName: 'Albert',
      lastName: 'Mendolza',
      phone: '+250788000002',
    },
  ];

  for (const adminData of adminUsers) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: adminData.email },
    });

    if (!existingUser) {
      // Hash the default password
      const hashedPassword = await bcrypt.hash(defaultPassword, BCRYPT_ROUNDS);

      // Create admin user
      const user = await prisma.user.create({
        data: {
          email: adminData.email,
          password: hashedPassword,
          firstName: adminData.firstName,
          lastName: adminData.lastName,
          phone: adminData.phone,
          role: UserRole.ADMIN,
          isActive: true,
          emailVerified: true,
        },
      });
      console.log(`✅ Admin user created: ${user.email} (Password: ${defaultPassword})`);
    } else {
      console.log(`⏭️  Admin user already exists: ${existingUser.email}`);
    }
  }

  // Check if a default customer user exists
  const existingCustomer = await prisma.user.findFirst({
    where: { email: 'default@mdg.com' },
  });

  if (!existingCustomer) {
    // Create default customer user
    const hashedPassword = await bcrypt.hash('customer123', BCRYPT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email: 'default@mdg.com',
        password: hashedPassword,
        firstName: 'Default',
        lastName: 'User',
        phone: '0000000000',
        role: UserRole.CUSTOMER,
      },
    });
    console.log('✅ Default customer user created:', user.email);
  } else {
    console.log('⏭️  Default customer user already exists:', existingCustomer.email);
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
