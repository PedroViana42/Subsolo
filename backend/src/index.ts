import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// 0. Configurar confiança no Proxy do Render
app.set('trust proxy', 1);

// 1. CORS Seguro (v1.5)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'subsolo-frontend.vercel.app',
  'usenexora.online',
  'localhost:3000',
  'localhost:5173'
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (como mobile apps ou curl)
    if (!origin) return callback(null, true);
    
    const isAllowed = 
      allowedOrigins.some(allowed => origin.includes(allowed)) || 
      origin.endsWith('.vercel.app') ||
      origin.endsWith('usenexora.online'); // Mais abrangente que .usenexora.online

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked]: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Log de Auditoria Simples
app.use((req, _res, next) => {
  console.log(`[SUBSOLO v1.5] ${req.method} ${req.url} | Origin: ${req.headers.origin || 'N/A'}`);
  next();
});

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido. Configure a variável de ambiente.');
}

// Redirecionamento de docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: 'v1.5', message: 'Subsolo Backend is secured and seeded' });
});

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

// Handler global de erros - CRITICAL: IMPEDE O CRASH DO NODE
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 [INTERNAL ERROR]:', err);
  const status = err.status || 500;
  res.status(status).json({ 
    error: 'Ocorreu um erro interno no servidor.',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Tente novamente em instantes.'
  });
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`\n🚀 [SUBSOLO-v1.5] Servidor Seguro e Online!`);
  console.log(`   - Porta: ${port}`);
  console.log(`   - Ambiente: production`);
  console.log(`   - Whitelist Ativa: ${allowedOrigins.join(', ')}`);
  console.log(`   - Swagger UI: http://0.0.0.0:${port}/docs\n`);
});
