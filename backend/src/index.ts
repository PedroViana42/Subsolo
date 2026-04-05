import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// 0. Configurar confiança no Proxy do Render (Essencial para o Render)
app.set('trust proxy', 1);

// 1. CORS Blindado e Auditado
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'subsolo-frontend.vercel.app',
  'localhost:3000',
  'localhost:5173'
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (como apps Mobile ou comandos curl locais)
    if (!origin) return callback(null, true);
    
    // Verifica se a origem contém algum dos nossos domínios permitidos
    // Ou se termina com .vercel.app (para aceitar deploys de preview da Vercel)
    const isAllowed = allowedOrigins.some(allowed => origin.includes(allowed)) || origin.endsWith('.vercel.app');

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`⚠️ [CORS BLOQUEADO]: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log de Auditoria para Debug de Login
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - Origin: ${req.headers.origin || 'N/A'}`);
  next();
});

app.use(express.json());

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido. Configure a variável de ambiente.');
}

// Redirecionamento de docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: 'v1.3', message: 'Subsolo Backend is stable' });
});

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

// Handler global de erros
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 [ERRO CRÍTICO NO BACKEND]:', err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`\n🚀 [SUBSOLO-v1.3] Servidor Auditado e Blindado!`);
  console.log(`   - Porta: ${port}`);
  console.log(`   - Ambiente: ${process.env.NODE_ENV || 'production'}`);
  console.log(`   - Whitelist Ativa: ${allowedOrigins.join(', ')} (e *.vercel.app)`);
  console.log(`   - Swagger UI: http://0.0.0.0:${port}/docs\n`);
});
