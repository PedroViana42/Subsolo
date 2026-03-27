import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const nicknames = [
  // Fauna
  { name: 'Capivara de Cálculo',     category: 'Fauna' },
  { name: 'Onça do Laboratório',     category: 'Fauna' },
  { name: 'Tatu do Xerox',           category: 'Fauna' },
  { name: 'Jabuti Veterano',         category: 'Fauna' },
  { name: 'Tamanduá de TCC',         category: 'Fauna' },
  { name: 'Arara do Anfiteatro',     category: 'Fauna' },
  { name: 'Tucano Reprovado',        category: 'Fauna' },
  { name: 'Gambá da República',      category: 'Fauna' },
  { name: 'Quati da Biblioteca',     category: 'Fauna' },
  { name: 'Paca do Alojamento',      category: 'Fauna' },

  // Espaço
  { name: 'Buraco Negro do RU',      category: 'Espaço' },
  { name: 'Cometa Calouro',          category: 'Espaço' },
  { name: 'Nebulosa do Estágio',     category: 'Espaço' },
  { name: 'Satélite Sem Bolsa',      category: 'Espaço' },
  { name: 'Pulsar do Segundo Grau',  category: 'Espaço' },
  { name: 'Quasar Reprovado',        category: 'Espaço' },
  { name: 'Estrela Anã do Cursinho', category: 'Espaço' },
  { name: 'Meteoro da Prova Final',  category: 'Espaço' },
  { name: 'Asteroide Periodista',    category: 'Espaço' },
  { name: 'Galáxia em Débito',       category: 'Espaço' },

  // RU
  { name: 'Feijão Misterioso',       category: 'RU' },
  { name: 'Bandeja Filosófica',      category: 'RU' },
  { name: 'Suco de Caju Quente',     category: 'RU' },
  { name: 'Arroz de Quinta-Feira',   category: 'RU' },
  { name: 'Frango de Segunda',       category: 'RU' },
  { name: 'Sobremesa Duvidosa',      category: 'RU' },
  { name: 'Fila das 11h30',          category: 'RU' },
  { name: 'Almoço de R$1,50',        category: 'RU' },
  { name: 'Cardápio Surpresa',       category: 'RU' },
  { name: 'Mesa do Fundão do RU',    category: 'RU' },

  // Acadêmico
  { name: 'Fantasma da Sala 404',    category: 'Acadêmico' },
  { name: 'Monitor Sem Crédito',     category: 'Acadêmico' },
  { name: 'Veterano Fantasma',       category: 'Acadêmico' },
  { name: 'Calouro Perdido',         category: 'Acadêmico' },
  { name: 'Grêmio Invisível',        category: 'Acadêmico' },
  { name: 'Trabalho de Grupo Solo',  category: 'Acadêmico' },
  { name: 'TCC Eterno',              category: 'Acadêmico' },
  { name: 'Faltou na Prova Oral',    category: 'Acadêmico' },
  { name: 'Co-autor Esquecido',      category: 'Acadêmico' },
  { name: 'Lattes Desatualizado',    category: 'Acadêmico' },
];

async function main() {
  console.log('Populando NickCatalogue...');
  for (const nick of nicknames) {
    await prisma.nickCatalogue.upsert({
      where: { name: nick.name },
      update: {},
      create: nick,
    });
  }
  console.log(`${nicknames.length} nicknames inseridos com sucesso.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
