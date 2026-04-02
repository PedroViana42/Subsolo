import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { createPostLimiter, voteLimiter } from '../middleware/limiters.js';
import { sanitizeText } from '../lib/sanitize.js';

const router = Router();

// Zod schemas for validation
const createPostSchema = z.object({
  content: z.string().min(10, 'A confissão deve ter pelo menos 10 caracteres.').max(500, 'A confissão não pode ultrapassar 500 caracteres.'),
  tag: z.string().optional(),
});

const voteSchema = z.object({
  isReal: z.boolean({ message: 'O tipo de voto (Fact ou Fic) é obrigatório.' }),
});

/**
 * @swagger
 * /posts:
 *   post:
 *     summary: Cria uma nova confissão
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               tag:
 *                 type: string
 *     responses:
 *       201:
 *         description: Confissão criada com sucesso
 */
router.post('/', requireAuth, createPostLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const parsed = createPostSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }
    const { content, tag } = parsed.data;
    const { nickId } = req.user!;

    const post = await prisma.post.create({
      data: {
        content: sanitizeText(content),
        tag: sanitizeText(tag),
        nickId,
      },
    });

    res.status(201).json({ message: 'Confissão publicada!', post });
  } catch (error) {
    console.error('[createPost error]:', error);
    res.status(500).json({ error: 'Erro interno ao criar post.' });
  }
});

/**
 * @swagger
 * /posts:
 *   get:
 *     summary: Lista confissões cronologicamente
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Número da página
 *     responses:
 *       200:
 *         description: Lista de posts retornado com sucesso
 */
router.get('/', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 20;
    const skip = (page - 1) * limit;

    const posts = await prisma.post.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        nick: {
          select: {
            name: true,
            aura: true,
            score: true,
          },
        },
      },
    });

    const total = await prisma.post.count();

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('[getPosts error]:', error);
    res.status(500).json({ error: 'Erro interno ao carregar posts.' });
  }
});

/**
 * @swagger
 * /posts/{id}/vote:
 *   post:
 *     summary: Vota em uma confissão como Fact (Real Oficial) ou Fic
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isReal
 *             properties:
 *               isReal:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Voto computado
 */
router.post('/:id/vote', requireAuth, voteLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const parsed = voteSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }
    const { isReal } = parsed.data;
    const { nickId } = req.user!;

    // Executa as operações em uma transação para garantir integridade
    const result = await prisma.$transaction(async (tx) => {
      // 1. Verifica se o post existe
      const post = await tx.post.findUnique({ where: { id: postId } });
      if (!post) {
        throw new Error('Post não encontrado.');
      }

      // 2. Verifica se o usuário já votou nesse post usando este Nick
      const existingVote = await tx.vote.findUnique({
        where: {
          nickId_postId: {
            nickId,
            postId,
          },
        },
      });

      if (existingVote) {
        throw new Error('Você já votou nesta confissão com sua identidade atual.');
      }

      // 3. Cria o voto
      const vote = await tx.vote.create({
        data: {
          isReal,
          nickId,
          postId,
        },
      });

      // 4. Atualiza a contagem no Post
      const updatedPost = await tx.post.update({
        where: { id: postId },
        data: {
          ...(isReal ? { factCount: { increment: 1 } } : { ficCount: { increment: 1 } }),
        },
      });

      return { vote, updatedPost };
    });

    res.json({ message: 'Voto computado!', post: result.updatedPost });
  } catch (error: any) {
    // Tratamos as mensagens jogadas dentro da transação
    if (error.message === 'Post não encontrado.' || error.message === 'Você já votou nesta confissão com sua identidade atual.') {
        res.status(400).json({ error: error.message });
        return;
    }

    console.error('[votePost error]:', error);
    res.status(500).json({ error: 'Erro interno ao computar voto.' });
  }
});

export default router;
