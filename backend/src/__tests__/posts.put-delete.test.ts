import { vi, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import jwt from 'jsonwebtoken';

// --- Mocks (hoisted before imports by Vitest) ---

vi.mock('../lib/prisma.js', () => ({
  default: {
    post: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock('../lib/sanitize.js', () => ({
  sanitizeText: (text: string | undefined | null) => text ?? '',
}));

// --- Imports after mocks ---

import prisma from '../lib/prisma.js';
import postsRouter from '../routes/posts.js';

// --- Constants ---

const TEST_SECRET = 'test-secret-for-vitest';
const OWNER_NICK_ID = 'nick-owner-111';
const OTHER_NICK_ID = 'nick-other-222';
const USER_ID = 'user-abc-999';

const mockPost = {
  id: 'post-abc-123',
  content: 'Texto de exemplo válido para o post.',
  tag: null,
  nickId: OWNER_NICK_ID,
  factCount: 0,
  ficCount: 0,
  createdAt: new Date(),
  deletedAt: null,
};

// --- Helpers ---

function makeToken(nickId: string, userId = USER_ID): string {
  return jwt.sign({ userId, nickId }, TEST_SECRET, { expiresIn: '1h' });
}

function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/posts', postsRouter);
  return app;
}

// --- Test Suites ---

describe('PUT /posts/:id', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    app = createApp();
    vi.clearAllMocks();
  });

  it('200 — dono edita o post com sucesso', async () => {
    const updatedContent = 'Conteúdo atualizado com sucesso agora.';
    (prisma.post.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockPost);
    (prisma.post.update as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockPost, content: updatedContent });

    const res = await request(app)
      .put('/posts/post-abc-123')
      .set('Authorization', `Bearer ${makeToken(OWNER_NICK_ID)}`)
      .send({ content: updatedContent });

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Confissão atualizada!');
    expect(res.body.post.content).toBe(updatedContent);
    expect(prisma.post.update).toHaveBeenCalledWith({
      where: { id: 'post-abc-123' },
      data: { content: updatedContent, tag: '' },
    });
  });

  it('200 — dono edita post com content e tag', async () => {
    (prisma.post.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockPost);
    (prisma.post.update as ReturnType<typeof vi.fn>).mockResolvedValue({
      ...mockPost,
      content: 'Novo conteúdo de edição aqui.',
      tag: 'confissao',
    });

    const res = await request(app)
      .put('/posts/post-abc-123')
      .set('Authorization', `Bearer ${makeToken(OWNER_NICK_ID)}`)
      .send({ content: 'Novo conteúdo de edição aqui.', tag: 'confissao' });

    expect(res.status).toBe(200);
    expect(res.body.post.tag).toBe('confissao');
  });

  it('400 — content com menos de 10 caracteres', async () => {
    const res = await request(app)
      .put('/posts/post-abc-123')
      .set('Authorization', `Bearer ${makeToken(OWNER_NICK_ID)}`)
      .send({ content: 'Curto' });

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('content');
    expect(prisma.post.findFirst).not.toHaveBeenCalled();
  });

  it('400 — content com mais de 500 caracteres', async () => {
    const res = await request(app)
      .put('/posts/post-abc-123')
      .set('Authorization', `Bearer ${makeToken(OWNER_NICK_ID)}`)
      .send({ content: 'A'.repeat(501) });

    expect(res.status).toBe(400);
    expect(res.body.error).toHaveProperty('content');
    expect(prisma.post.findFirst).not.toHaveBeenCalled();
  });

  it('400 — body sem campo content', async () => {
    const res = await request(app)
      .put('/posts/post-abc-123')
      .set('Authorization', `Bearer ${makeToken(OWNER_NICK_ID)}`)
      .send({ tag: 'unica-tag' });

    expect(res.status).toBe(400);
    expect(prisma.post.findFirst).not.toHaveBeenCalled();
  });

  it('401 — sem token de autenticação', async () => {
    const res = await request(app)
      .put('/posts/post-abc-123')
      .send({ content: 'Conteúdo válido para edição aqui.' });

    expect(res.status).toBe(401);
  });

  it('401 — token inválido', async () => {
    const res = await request(app)
      .put('/posts/post-abc-123')
      .set('Authorization', 'Bearer token-completamente-invalido')
      .send({ content: 'Conteúdo válido para edição aqui.' });

    expect(res.status).toBe(401);
  });

  it('403 — usuário não é dono do post', async () => {
    (prisma.post.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockPost);

    const res = await request(app)
      .put('/posts/post-abc-123')
      .set('Authorization', `Bearer ${makeToken(OTHER_NICK_ID)}`)
      .send({ content: 'Tentativa de edição por intruso aqui.' });

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('permissão');
    expect(prisma.post.update).not.toHaveBeenCalled();
  });

  it('404 — post não encontrado', async () => {
    (prisma.post.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const res = await request(app)
      .put('/posts/post-inexistente')
      .set('Authorization', `Bearer ${makeToken(OWNER_NICK_ID)}`)
      .send({ content: 'Conteúdo válido para edição aqui.' });

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('não encontrado');
    expect(prisma.post.update).not.toHaveBeenCalled();
  });
});

describe('DELETE /posts/:id', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    process.env.JWT_SECRET = TEST_SECRET;
    app = createApp();
    vi.clearAllMocks();
  });

  it('200 — dono exclui o post com sucesso (soft delete)', async () => {
    (prisma.post.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockPost);
    (prisma.post.update as ReturnType<typeof vi.fn>).mockResolvedValue({ ...mockPost, deletedAt: new Date() });

    const res = await request(app)
      .delete('/posts/post-abc-123')
      .set('Authorization', `Bearer ${makeToken(OWNER_NICK_ID)}`);

    expect(res.status).toBe(200);
    expect(res.body.message).toBe('Confissão excluída.');
    expect(prisma.post.update).toHaveBeenCalledWith({
      where: { id: 'post-abc-123' },
      data: { deletedAt: expect.any(Date) },
    });
  });

  it('401 — sem token de autenticação', async () => {
    const res = await request(app).delete('/posts/post-abc-123');

    expect(res.status).toBe(401);
    expect(prisma.post.findFirst).not.toHaveBeenCalled();
  });

  it('401 — token inválido', async () => {
    const res = await request(app)
      .delete('/posts/post-abc-123')
      .set('Authorization', 'Bearer token-completamente-invalido');

    expect(res.status).toBe(401);
    expect(prisma.post.findFirst).not.toHaveBeenCalled();
  });

  it('403 — usuário não é dono do post', async () => {
    (prisma.post.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(mockPost);

    const res = await request(app)
      .delete('/posts/post-abc-123')
      .set('Authorization', `Bearer ${makeToken(OTHER_NICK_ID)}`);

    expect(res.status).toBe(403);
    expect(res.body.error).toContain('permissão');
    expect(prisma.post.update).not.toHaveBeenCalled();
  });

  it('404 — post não encontrado', async () => {
    (prisma.post.findFirst as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const res = await request(app)
      .delete('/posts/post-inexistente')
      .set('Authorization', `Bearer ${makeToken(OWNER_NICK_ID)}`);

    expect(res.status).toBe(404);
    expect(res.body.error).toContain('não encontrado');
    expect(prisma.post.update).not.toHaveBeenCalled();
  });
});
