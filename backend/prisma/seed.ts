import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin
  const admin = await prisma.admin.upsert({
    where: { email: 'admin@restaurant.com' },
    update: {},
    create: {
      name: 'Restaurant Admin',
      email: 'admin@restaurant.com',
      passwordHash: await bcrypt.hash('Admin@1234', 12),
    },
  });

  // Create restaurant
  const restaurant = await prisma.restaurant.upsert({
    where: { adminId: admin.id },
    update: {},
    create: {
      adminId: admin.id,
      name: 'La Bella Vista',
      address: '123 Main Street, Downtown, NY 10001',
      gridRows: 4,
      gridCols: 5,
    },
  });

  // Create tables in grid
  const tableData = [
    { label: 'T1', capacity: 2, gridRow: 0, gridCol: 0 },
    { label: 'T2', capacity: 2, gridRow: 0, gridCol: 2 },
    { label: 'T3', capacity: 4, gridRow: 0, gridCol: 4 },
    { label: 'T4', capacity: 4, gridRow: 1, gridCol: 1 },
    { label: 'T5', capacity: 4, gridRow: 1, gridCol: 3 },
    { label: 'T6', capacity: 6, gridRow: 2, gridCol: 0 },
    { label: 'T7', capacity: 6, gridRow: 2, gridCol: 2 },
    { label: 'T8', capacity: 6, gridRow: 2, gridCol: 4 },
    { label: 'T9', capacity: 4, gridRow: 3, gridCol: 1 },
    { label: 'T10', capacity: 2, gridRow: 3, gridCol: 3 },
  ];

  for (const td of tableData) {
    await prisma.table.upsert({
      where: { restaurantId_gridRow_gridCol: { restaurantId: restaurant.id, gridRow: td.gridRow, gridCol: td.gridCol } },
      update: {},
      create: { restaurantId: restaurant.id, ...td },
    });
  }

  // Create customer
  const customer = await prisma.customer.upsert({
    where: { email: 'customer@test.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'customer@test.com',
      passwordHash: await bcrypt.hash('Customer@1234', 12),
      phone: '+1234567890',
    },
  });

  console.log('✅ Seeding complete');
  console.log(`   Admin: admin@restaurant.com / Admin@1234`);
  console.log(`   Customer: customer@test.com / Customer@1234`);
  console.log(`   Restaurant: ${restaurant.name}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
