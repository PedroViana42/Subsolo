import prisma from '../lib/prisma.js';

/**
 * Permanently deletes posts (and their votes, comments, reports) that were
 * soft-deleted more than PURGE_AFTER_DAYS days ago (default: 30).
 *
 * Returns the number of posts purged.
 */
export async function purgeDeletedPosts(): Promise<number> {
  const purgeAfterDays = parseInt(process.env.PURGE_AFTER_DAYS ?? '30', 10);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - purgeAfterDays);

  const targets = await prisma.post.findMany({
    where: { deletedAt: { not: null, lte: cutoff } },
    select: { id: true },
  });

  if (targets.length === 0) {
    return 0;
  }

  const ids = targets.map((p) => p.id);

  await prisma.$transaction(async (tx) => {
    await tx.vote.deleteMany({ where: { postId: { in: ids } } });
    await tx.comment.deleteMany({ where: { postId: { in: ids } } });
    await tx.report.deleteMany({ where: { postId: { in: ids } } });
    await tx.post.deleteMany({ where: { id: { in: ids } } });
  });

  return ids.length;
}
