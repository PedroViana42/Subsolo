import { Router } from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import { assignNick } from '../services/nick.js';

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
 *     description: Registra um novo usuário. Não atribui identidade — isso acontece no login.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: Conta criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Conta criada com sucesso
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       409:
 *         description: Email já cadastrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', async (req, res) => {
  const result = registerSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.flatten().fieldErrors });
    return;
  }

  const { email, password } = result.data;

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    await prisma.user.create({ data: { email, passwordHash } });
    res.status(201).json({ message: 'Conta criada com sucesso' });
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
 *     description: |
 *       Autentica o usuário e retorna um JWT de 48h junto com a identidade temporária (Nick).
 *       Se o Nick ativo ainda não expirou, o mesmo é reutilizado. Caso contrário, um novo é sorteado do catálogo.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login bem-sucedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Dados inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/login', async (req, res) => {
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

  const nick = await assignNick(user.id);

  const token = jwt.sign(
    { userId: user.id, nickId: nick.id },
    process.env.JWT_SECRET!,
    { expiresIn: '48h' },
  );

  res.json({
    token,
    nick: {
      name: nick.name,
      expiresAt: nick.expiresAt,
      score: nick.score,
      aura: nick.aura,
    },
  });
});

export default router;
