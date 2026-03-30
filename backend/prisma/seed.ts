import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
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

const badges = [
  { 
    name: 'Pioneiro', 
    description: 'Usuário registrado durante o primeiro mês de lançamento.', 
    icon: '🏛️' 
  },
  { 
    name: 'Voz da Comunidade', 
    description: 'Teve um post que atingiu mais de 50 votos Fact (Real Oficial).', 
    icon: '📢' 
  },
  { 
    name: 'Detetive', 
    description: 'Realizou 10 ou mais denúncias que foram validadas pela moderação.', 
    icon: '🔍' 
  },
  { 
    name: 'Sentinela do RU', 
    description: 'Votou na qualidade da comida no widget "Fiscal do RU" mais de 30 vezes.', 
    icon: '🍛' 
  },
  { 
    name: 'Mestre da Verdade', 
    description: 'Mantém um Score de Honestidade acima de 90% após receber mais de 100 votos.', 
    icon: '😇' 
  },
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

  console.log('Populando Badges...');
  for (const badge of badges) {
    await prisma.badge.upsert({
      where: { name: badge.name },
      update: {},
      create: badge,
    });
  }
  console.log(`${badges.length} badges inseridas com sucesso.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
