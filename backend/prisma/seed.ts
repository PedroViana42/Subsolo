import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const nicks = [
  { name: 'Fantasma' },
  { name: 'Sombra' },
  { name: 'CodeNinja' },
  { name: 'Infiltrado' },
  { name: 'ZeroOne' },
  { name: 'Cibernético' },
  { name: 'Vigilante' },
  { name: 'Observador' },
  { name: 'Silencioso' },
  { name: 'Anon_99' },
];

async function main() {
  console.log('🌱 [SEED]: Instando nicks iniciais...');

  for (const nick of nicks) {
    await prisma.nickCatalogue.upsert({
      where: { name: nick.name },
      update: {},
      create: {
        name: nick.name,
        isActive: true,
      },
    });
  }

  console.log('✅ [SEED]: 10 nicks inseridos com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ [SEED ERROR]:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
