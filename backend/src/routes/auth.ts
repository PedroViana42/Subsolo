import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import prisma from '../lib/prisma.js';
import { assignNick } from '../services/nick.js';
import { loginLimiter, registerLimiter } from '../middleware/limiters.js';
import { sendVerificationEmail } from '../lib/email.js';

const router = Router();

// Dummy hash usado para manter tempo constante quando usuário não existe (evita timing attack)
const DUMMY_HASH = '$2a$12$invalidhashfortimingprotectionxxxxxxxxxxxxxxxxxxxxxxxxx';

const registerSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(8, { message: 'Senha deve ter no mínimo 8 caracteres' }),
});

const loginSchema = z.object({
  email: z.string().email({ message: 'Email inválido' }),
  password: z.string().min(1, { message: 'Senha obrigatória' }),
});

/**
 * @openapi
 * /auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Criar conta
 *     description: Registra um novo usuário e envia e-mail de verificação.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Conta criada, e-mail de verificação enviado
 *       400:
 *         description: Dados inválidos
 *       409:
 *         description: Email já cadastrado
 */
router.post('/register', registerLimiter, async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const { email, password } = result.data;

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({ data: { email, passwordHash } });

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    await prisma.emailVerificationToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    await sendVerificationEmail(email, token);

    res.status(201).json({ message: 'Conta criada! Verifique seu e-mail para ativar.' });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(409).json({ error: 'Email já cadastrado' });
      return;
    }
    throw error;
  }
});

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login
 *     description: Autentica o usuário e retorna um JWT de 48h com a identidade temporária.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *       400:
 *         description: Dados inválidos
 *       401:
 *         description: Credenciais inválidas
 *       403:
 *         description: E-mail não verificado
 */
router.post('/login', loginLimiter, async (req, res) => {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({ where: { email } });

  // Sempre roda bcrypt mesmo se usuário não existe — evita timing attack
  const hashToCompare = user?.passwordHash ?? DUMMY_HASH;
  const passwordValid = await bcrypt.compare(password, hashToCompare);

  if (!user || !passwordValid) {
    res.status(401).json({ error: 'Credenciais inválidas' });
    return;
  }

  if (!user.emailVerified) {
    res.status(403).json({
      error: 'E-mail não verificado. Verifique sua caixa de entrada.',
      code: 'EMAIL_NOT_VERIFIED',
    });
    return;
  }

  try {
    const nick = await assignNick(user.id);

    const token = jwt.sign(
      { userId: user.id, nickId: nick.id },
      process.env.JWT_SECRET!,
      { expiresIn: '48h' },
    );

    res.json({
      token,
      nick: {
        id: nick.id,
        name: nick.name,
        expiresAt: nick.expiresAt,
        score: nick.score,
        aura: nick.aura,
      },
    });
  } catch (error: any) {
    console.error('🔥 [AUTH ERROR]:', error);
    res.status(500).json({ 
      error: 'Ocorreu um erro ao processar sua identidade. Tente novamente em alguns instantes.',
      message: error.message 
    });
  }
});

/**
 * @openapi
 * /auth/verify/{token}:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Verificar e-mail
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: E-mail verificado com sucesso
 *       400:
 *         description: Token inválido ou expirado
 */
router.get('/verify/:token', async (req, res) => {
  const { token } = req.params;

  const record = await prisma.emailVerificationToken.findUnique({ where: { token } });

  if (!record || record.expiresAt < new Date()) {
    res.status(400).json({ error: 'Link inválido ou expirado.' });
    return;
  }

  await prisma.user.update({
    where: { id: record.userId },
    data: { emailVerified: true },
  });
  await prisma.emailVerificationToken.delete({ where: { token } });

  res.json({ message: 'E-mail verificado com sucesso! Faça login.' });
});

/**
 * @openapi
 * /auth/resend-verification:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Reenviar e-mail de verificação
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: E-mail reenviado (resposta genérica para não revelar existência do usuário)
 */
router.post('/resend-verification', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ error: 'E-mail obrigatório.' });
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // Resposta genérica — não revela se o e-mail existe
  if (!user || user.emailVerified) {
    res.json({ message: 'Se o e-mail existir e não estiver verificado, um novo link foi enviado.' });
    return;
  }

  await prisma.emailVerificationToken.deleteMany({ where: { userId: user.id } });

  const token = randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await prisma.emailVerificationToken.create({
    data: { userId: user.id, token, expiresAt },
  });

  await sendVerificationEmail(email, token);

  res.json({ message: 'Se o e-mail existir e não estiver verificado, um novo link foi enviado.' });
});

export default router;
