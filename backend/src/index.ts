import dotenv from 'dotenv';
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido. Configure a variável de ambiente.');
}

import app from './app.js';

const port = process.env.PORT || 3001;

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`\n🚀 [SUBSOLO-v1.8.1] Servidor Nexora Root Online!`);
  console.log(`   - Porta: ${port}`);
  console.log(`   - E-mail: noreply@usenexora.online (via Resend)`);
  console.log(`   - Whitelist Ativa: ${(process.env.FRONTEND_URL ?? '') + ', localhost:3000, localhost:5173'}`);
  console.log(`   - Swagger UI: http://0.0.0.0:${port}/docs\n`);
});
