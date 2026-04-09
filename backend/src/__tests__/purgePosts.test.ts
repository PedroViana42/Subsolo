import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('../lib/prisma.js', () => ({
  default: {
    post: {
      findMany: vi.fn(),
      deleteMany: vi.fn(),
    },
    vote: { deleteMany: vi.fn() },
    comment: { deleteMany: vi.fn() },
    report: { deleteMany: vi.fn() },
    $transaction: vi.fn(async (fn) => fn({
      vote: { deleteMany: vi.fn() },
      comment: { deleteMany: vi.fn() },
      report: { deleteMany: vi.fn() },
      post: { deleteMany: vi.fn() },
    })),
  },
}));

import prisma from '../lib/prisma.js';
import { purgeDeletedPosts } from '../jobs/purgePosts.js';

describe('purgeDeletedPosts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.PURGE_AFTER_DAYS = '30';
  });

  afterEach(() => {
    delete process.env.PURGE_AFTER_DAYS;
  });

  it('retorna 0 e não chama transaction quando não há posts para purgar', async () => {
    (prisma.post.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const count = await purgeDeletedPosts();

    expect(count).toBe(0);
    expect(prisma.$transaction).not.toHaveBeenCalled();
  });

  it('retorna a quantidade de posts purgados e executa a transaction', async () => {
    const mockPosts = [{ id: 'post-1' }, { id: 'post-2' }, { id: 'post-3' }];
    (prisma.post.findMany as ReturnType<typeof vi.fn>).mockResolvedValue(mockPosts);

    const count = await purgeDeletedPosts();

    expect(count).toBe(3);
    expect(prisma.$transaction).toHaveBeenCalledOnce();
  });

  it('usa PURGE_AFTER_DAYS do ambiente para calcular o cutoff', async () => {
    process.env.PURGE_AFTER_DAYS = '7';
    (prisma.post.findMany as ReturnType<typeof vi.fn>).mockResolvedValue([]);

    const before = Date.now();
    await purgeDeletedPosts();
    const after = Date.now();

    const callArg = (prisma.post.findMany as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(callArg.where.deletedAt).toMatchObject({ not: null });

    const cutoff: Date = callArg.where.deletedAt.lte;
    const expectedMin = before - 7 * 24 * 60 * 60 * 1000;
    const expectedMax = after - 7 * 24 * 60 * 60 * 1000;

    expect(cutoff.getTime()).toBeGreaterThanOrEqual(expectedMin);
    expect(cutoff.getTime()).toBeLessThanOrEqual(expectedMax);
  });
});
