import pg from 'pg';
const { Client } = pg;

const connectionString = "postgresql://postgres.redxdpqfxukqxyhguxlq:vKwWc%233hxT!Jc%262@aws-1-us-east-1.pooler.supabase.com:5432/postgres?directConnection=true";

const nicks = [
  'Fantasma', 'Sombra', 'CodeNinja', 'Infiltrado', 'ZeroOne', 
  'Cibernético', 'Vigilante', 'Observador', 'Silencioso', 'Anon_99'
];

async function seed() {
  const client = new Client({ connectionString });
  
  try {
    console.log('🌱 [PG-SEED]: Conectando ao Supabase...');
    await client.connect();
    
    console.log('🌱 [PG-SEED]: Inserindo nicks iniciais...');
    
    for (const name of nicks) {
      await client.query(
        'INSERT INTO nick_catalogue (id, name, "isActive") VALUES (gen_random_uuid(), $1, true) ON CONFLICT (name) DO NOTHING',
        [name]
      );
    }
    
    const res = await client.query('SELECT COUNT(*) FROM nick_catalogue');
    console.log(`✅ [PG-SEED]: Sucesso! Total de nicks no banco: ${res.rows[0].count}`);
    
  } catch (err) {
    console.error('❌ [PG-SEED ERROR]:', err);
  } finally {
    await client.end();
  }
}

seed();
