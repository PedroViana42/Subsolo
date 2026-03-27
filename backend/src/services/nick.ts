import { randomInt } from 'crypto';
import type { Nick } from '@prisma/client';
import prisma from '../lib/prisma.js';

export async function assignNick(userId: string): Promise<Nick> {
  const now = new Date();

  // 1. Retorna o Nick ativo se existir
  const activeNick = await prisma.nick.findFirst({
    where: { userId, expiresAt: { gt: now } },
    orderBy: { createdAt: 'desc' },
  });
  if (activeNick) return activeNick;

  // 2. Tudo dentro de uma transação para evitar race condition
  return prisma.$transaction(async (tx) => {
    // Reativa entradas do catálogo cujos nicks já expiraram
    const stillActiveIds = await tx.nick.findMany({
      where: { expiresAt: { gt: now }, catalogueId: { not: null } },
      select: { catalogueId: true },
      distinct: ['catalogueId'],
    });

    await tx.nickCatalogue.updateMany({
      where: {
        isActive: false,
        id: { notIn: stillActiveIds.map((n) => n.catalogueId!) },
      },
      data: { isActive: true },
    });

    // Busca o catalogueId do último Nick deste usuário para excluir do sorteio
    const lastNick = await tx.nick.findFirst({
      where: { userId, catalogueId: { not: null } },
      orderBy: { createdAt: 'desc' },
      select: { catalogueId: true },
    });

    // Sorteia do catálogo usando crypto.randomInt (seguro)
    const pool = await tx.nickCatalogue.findMany({
      where: {
        isActive: true,
        ...(lastNick ? { id: { not: lastNick.catalogueId! } } : {}),
      },
    });

    if (pool.length === 0) {
      throw new Error('Sem nicks disponíveis no momento. Tente novamente em instantes.');
    }

    const entry = pool[randomInt(pool.length)];

    // Tenta marcar atomicamente — se já foi tomado por outro request, count = 0
    const claimed = await tx.nickCatalogue.updateMany({
      where: { id: entry.id, isActive: true },
      data: { isActive: false },
    });

    if (claimed.count === 0) {
      throw new Error('Sem nicks disponíveis no momento. Tente novamente em instantes.');
    }

    return tx.nick.create({
      data: {
        userId,
        name: entry.name,
        catalogueId: entry.id,
        expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
      },
    });
  });
}
