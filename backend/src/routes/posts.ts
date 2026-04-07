import { Router, type Request, type Response } from 'express';
import { z } from 'zod';
import prisma from '../lib/prisma.js';
import { requireAuth } from '../middleware/auth.js';
import { createPostLimiter, voteLimiter, commentLimiter } from '../middleware/limiters.js';
import { sanitizeText } from '../lib/sanitize.js';

const router = Router();

// Zod schemas for validation
const createPostSchema = z.object({
  content: z.string().min(10, 'A confissão deve ter pelo menos 10 caracteres.').max(500, 'A confissão não pode ultrapassar 500 caracteres.'),
  tag: z.string().optional(),
});

const updatePostSchema = z.object({
  content: z.string().min(10, 'A confissão deve ter pelo menos 10 caracteres.').max(500, 'A confissão não pode ultrapassar 500 caracteres.'),
  tag: z.string().optional(),
});

const voteSchema = z.object({
  isReal: z.boolean({ message: 'O tipo de voto (Fact ou Fic) é obrigatório.' }),
});

const createCommentSchema = z.object({
  content: z.string().min(1, 'O comentário não pode estar vazio.').max(300, 'O comentário não pode ultrapassar 300 caracteres.'),
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
        comments: {
          orderBy: { createdAt: 'asc' as const },
          include: {
            nick: {
              select: {
                name: true,
                aura: true,
                score: true,
              },
            },
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

/**
 * @swagger
 * /posts/{id}/comments:
 *   post:
 *     summary: Cria um comentário em uma confissão
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comentário criado com sucesso
 */
router.post('/:id/comments', requireAuth, commentLimiter, async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const parsed = createCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }
    const { content } = parsed.data;
    const { nickId } = req.user!;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      res.status(404).json({ error: 'Post não encontrado.' });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        content: sanitizeText(content),
        nickId,
        postId,
      },
      include: {
        nick: {
          select: { name: true, aura: true, score: true },
        },
      },
    });

    res.status(201).json({ message: 'Comentário publicado!', comment });
  } catch (error) {
    console.error('[createComment error]:', error);
    res.status(500).json({ error: 'Erro interno ao criar comentário.' });
  }
});

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Edita o conteúdo de uma confissão
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
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *               tag:
 *                 type: string
 *     responses:
 *       200:
 *         description: Confissão atualizada com sucesso
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Sem permissão para editar este post
 *       404:
 *         description: Post não encontrado
 */
router.put('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const { nickId } = req.user!;

    const parsed = updatePostSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.flatten().fieldErrors });
      return;
    }
    const { content, tag } = parsed.data;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      res.status(404).json({ error: 'Post não encontrado.' });
      return;
    }

    if (post.nickId !== nickId) {
      res.status(403).json({ error: 'Você não tem permissão para editar este post.' });
      return;
    }

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        content: sanitizeText(content),
        tag: sanitizeText(tag),
      },
    });

    res.json({ message: 'Confissão atualizada!', post: updatedPost });
  } catch (error) {
    console.error('[updatePost error]:', error);
    res.status(500).json({ error: 'Erro interno ao atualizar post.' });
  }
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Exclui uma confissão
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Confissão excluída com sucesso
 *       403:
 *         description: Sem permissão para excluir este post
 *       404:
 *         description: Post não encontrado
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    const { nickId } = req.user!;

    const post = await prisma.post.findUnique({ where: { id: postId } });
    if (!post) {
      res.status(404).json({ error: 'Post não encontrado.' });
      return;
    }

    if (post.nickId !== nickId) {
      res.status(403).json({ error: 'Você não tem permissão para excluir este post.' });
      return;
    }

    await prisma.post.delete({ where: { id: postId } });

    res.json({ message: 'Confissão excluída.' });
  } catch (error) {
    console.error('[deletePost error]:', error);
    res.status(500).json({ error: 'Erro interno ao excluir post.' });
  }
});

export default router;
