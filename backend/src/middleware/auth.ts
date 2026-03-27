import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string; nickId: string };
    }
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Token ausente' });
    return;
  }

  const token = authHeader.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as unknown;

    if (
      typeof payload !== 'object' ||
      payload === null ||
      !('userId' in payload) ||
      !('nickId' in payload) ||
      typeof (payload as any).userId !== 'string' ||
      typeof (payload as any).nickId !== 'string'
    ) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }

    req.user = {
      userId: (payload as any).userId,
      nickId: (payload as any).nickId,
    };
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}
