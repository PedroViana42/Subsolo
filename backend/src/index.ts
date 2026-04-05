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

// 1. CORS Totalmente Aberto (Para Debug e Estabilização)
app.use(cors({
  origin: true, // Echoes the request origin back to the client
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Log de Auditoria
app.use((req, _res, next) => {
  console.log(`[SUBSOLO v1.4] ${new Date().toISOString()} | ${req.method} ${req.url} | Origin: ${req.headers.origin || 'N/A'}`);
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
  res.json({ status: 'ok', version: 'v1.4', message: 'Subsolo Backend is now wide open for testing' });
});

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

// Handler global de erros
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 [ERROR]:', err);
  res.status(500).json({ error: 'Erro interno do servidor.', details: err.message });
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`\n🚀 [SUBSOLO-v1.4] Servidor em teste de estresse!`);
  console.log(`   - Porta: ${port}`);
  console.log(`   - CORS: Totalmente Aberto (origin: true)`);
  console.log(`   - Swagger UI: http://0.0.0.0:${port}/docs\n`);
});
