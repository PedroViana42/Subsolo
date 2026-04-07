import express, { type Request, type Response, type NextFunction } from 'express';
import 'express-async-errors';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './lib/swagger.js';
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  process.env.FRONTEND_URL,
  'subsolo-frontend.vercel.app',
  'usenexora.online',
  'localhost:3000',
  'localhost:5173',
  '127.0.0.1:3000',
  '127.0.0.1:5173',
].filter(Boolean) as string[];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isAllowed =
        allowedOrigins.some((allowed) => origin.includes(allowed)) ||
        origin.endsWith('.vercel.app') ||
        origin.endsWith('usenexora.online');
      if (isAllowed) {
        callback(null, true);
      } else {
        console.warn(`[CORS Blocked]: ${origin}`);
        callback(null, false);
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

app.use(express.json());

app.use((req, _res, next) => {
  console.log(`[SUBSOLO v1.8.1] ${req.method} ${req.url} | Origin: ${req.headers.origin || 'N/A'}`);
  next();
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', version: 'v1.8.1', message: 'Subsolo Backend via Resend (noreply@usenexora.online)' });
});

app.use('/auth', authRouter);
app.use('/posts', postsRouter);

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error('🔥 [INTERNAL ERROR]:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: 'Ocorreu um erro interno no servidor.',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Tente novamente em instantes.',
  });
});

export default app;
