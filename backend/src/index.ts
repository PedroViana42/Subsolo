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

// 0. Configurar confiança no Proxy do Render (Necessário para express-rate-limit)
app.set('trust proxy', 1);

// 1. CORS deve vir ANTES de qualquer outro middleware ou rota
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'subsolo-frontend.vercel.app',
  'localhost:3000',
  'localhost:5173'
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isAllowed = allowedOrigins.some(allowed => origin.includes(allowed));
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

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido. Configure a variável de ambiente.');
}

// Redirecionamento de docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'Subsolo Backend is running' });
});

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

// Handler global de erros — captura qualquer throw em rotas async
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`\n🚀 [SUBSOLO-v1.1] Backend iniciado com sucesso!`);
  console.log(`   - Porta: ${port}`);
  console.log(`   - Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   - Whitelist CORS: ${allowedOrigins.join(', ')}`);
  console.log(`   - Swagger UI: http://0.0.0.0:${port}/docs\n`);
});
