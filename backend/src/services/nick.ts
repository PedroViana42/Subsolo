import { randomInt, randomBytes } from 'crypto';
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

  // 2. Tudo dentro de uma transação para evitar race condition (usando any para evitar erro de inferência do Prisma)
  return prisma.$transaction(async (tx: any) => {
    // Reativa entradas do catálogo cujos nicks já expiraram
    const stillActiveIds = await tx.nick.findMany({
      where: { expiresAt: { gt: now }, catalogueId: { not: null } },
      select: { catalogueId: true },
      distinct: ['catalogueId'],
    });

    await tx.nickCatalogue.updateMany({
      where: {
        isActive: false,
        id: { notIn: stillActiveIds.map((n: { catalogueId: string | null }) => n.catalogueId!) },
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
      // Fallback: Gerar um nick pseudo-aleatório se o catálogo estiver vazio
      const fallbackSuffix = randomBytes(3).toString('hex');
      const fallbackName = `Anon_${fallbackSuffix}`;
      
      return tx.nick.create({
        data: {
          userId,
          name: fallbackName,
          catalogueId: null, // Identifica que não veio do catálogo oficial
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        },
      });
    }

    const entry = pool[randomInt(pool.length)];

    // Tenta marcar atomicamente — se já foi tomado por outro request, count = 0
    const claimed = await tx.nickCatalogue.updateMany({
      where: { id: entry.id, isActive: true },
      data: { isActive: false },
    });

    if (claimed.count === 0) {
      // Race condition safety: se outro request tomou o nick no mesmo milissegundo, gera um fallback imediato
      const fallbackSuffix = randomBytes(2).toString('hex');
      return tx.nick.create({
        data: {
          userId,
          name: `Anon_${fallbackSuffix}`,
          catalogueId: null,
          expiresAt: new Date(Date.now() + 48 * 60 * 60 * 1000),
        },
      });
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
