import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';

dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido. Configure a variável de ambiente.');
}

const app = express();
const port = process.env.PORT || 3001;

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'subsolo-frontend.vercel.app',
  'localhost:3000',
  'localhost:5173'
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    
    // Verifica se a origem contém algum dos nossos domínios permitidos
    const isAllowed = allowedOrigins.some(allowed => origin.includes(allowed));

    if (isAllowed) {
      callback(null, true);
    } else {
      console.warn(`[CORS Blocked]: ${origin}`);
      callback(null, false); // Retorna falso em vez de erro para evitar quebra de cabeçalho
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

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
  console.log(`Backend rodando em http://0.0.0.0:${port}`);
  console.log(`Swagger UI em    http://0.0.0.0:${port}/docs`);
});
