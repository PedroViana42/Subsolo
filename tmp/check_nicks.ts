import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.nickCatalogue.count();
  const activeCount = await prisma.nickCatalogue.count({ where: { isActive: true } });

  console.log(`Total nicks: ${count}`);
  console.log(`Active nicks: ${activeCount}`);

  if (activeCount === 0 && count > 0) {
    console.log('Resetting isActive to true for all nicks...');
    await prisma.nickCatalogue.updateMany({ data: { isActive: true } });
    console.log('Done.');
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
