import { PrismaClient } from '@prisma/client';
import { UserRole, ItemType } from '@prisma/client';
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
    console.log(' Default customer user created:', user.email);
  } else {
    console.log('Default customer user already exists:', existingCustomer.email);
  }

  // Seed MDG Shoe Laundry services with RWF pricing
  const services = [
    // ===== SHOES CLEANING SERVICES =====
    {
      name: 'Regular Cleaning',
      description: 'Standard shoe cleaning with brush and water wash. Ranges from 800–1,000 RWF based on shoe condition.',
      category: ItemType.SHOES,
      basePrice: 1000, // RWF per pair
      quantity: 1,
      quantityLabel: 'per pair',
    },
    {
      name: 'Medium Cleaning',
      description: 'Deeper clean for moderately soiled shoes. Ranges from 800–1,000 RWF based on condition.',
      category: ItemType.SHOES,
      basePrice: 1000, // RWF per pair
      quantity: 1,
      quantityLabel: 'per pair',
    },
    {
      name: 'Extreme Cleaning',
      description: 'Advanced cleaning for heavily soiled shoes with stain removal. 1,000 RWF per pair.',
      category: ItemType.SHOES,
      basePrice: 1000, // RWF per pair
      quantity: 1,
      quantityLabel: 'per pair',
    },
    {
      name: 'Unyellowing Treatment',
      description: 'Special treatment to restore color and remove yellowing. 1,000 RWF per pair.',
      category: ItemType.SHOES,
      basePrice: 1000, // RWF per pair
      quantity: 1,
      quantityLabel: 'per pair',
    },
    {
      name: 'Twin Deal Bundle',
      description: 'Special bundle for 2 pairs of shoes! Get both pairs cleaned for just 1,500 RWF.',
      category: ItemType.SHOES,
      basePrice: 1500, // RWF for 2 pairs
      quantity: 2,
      quantityLabel: '2 pairs',
    },
    // ===== BAG CLEANING SERVICES =====
    {
      name: 'Leather Bags',
      description: 'Expert cleaning and conditioning for leather bags. Includes protection treatment. 2,000 RWF',
      category: ItemType.BAG,
      basePrice: 2000, // RWF per bag
      quantity: 1,
      quantityLabel: 'per bag',
    },
    {
      name: 'Canvas Bags',
      description: 'Professional cleaning for canvas bags with stain removal. 1,500 RWF',
      category: ItemType.BAG,
      basePrice: 1500, // RWF per bag
      quantity: 1,
      quantityLabel: 'per bag',
    },
    {
      name: 'Lace Bags',
      description: 'Gentle cleaning for delicate lace bags with special care. 1,500 RWF',
      category: ItemType.BAG,
      basePrice: 1500, // RWF per bag
      quantity: 1,
      quantityLabel: 'per bag',
    },
    {
      name: 'Other Bag Types',
      description: 'Cleaning for any other bag type (nylon, synthetic, etc). Professional treatment. 2,000 RWF',
      category: ItemType.BAG,
      basePrice: 2000, // RWF per bag
      quantity: 1,
      quantityLabel: 'per bag',
    },
  ];

  for (const serviceData of services) {
    const existingService = await prisma.service.findFirst({
      where: { name: serviceData.name },
    });

    if (!existingService) {
      await prisma.service.create({
        data: {
          ...serviceData,
          isActive: true,
        },
      });
      console.log(`✅ Service created: ${serviceData.name} (${serviceData.basePrice} RWF)`);
    } else {
      console.log(`⏭️  Service already exists: ${serviceData.name}`);
    }
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
