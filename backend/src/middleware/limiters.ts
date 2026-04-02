import rateLimit from 'express-rate-limit';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: 'Muitas tentativas de login. Tente novamente em 15 minutos.' },
});

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Limite de cadastros atingido. Tente novamente em 1 hora.' },
});

// Limite de Postagens: 15 posts a cada 10 minutos (bem tranquilo pro lançamento)
export const createPostLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 15,
  message: { error: 'Você está postando muito rápido. Dê um tempo de 10 minutos e tente novamente.' },
});

// Limite de Votos: 150 votos a cada 15 minutos (permite engajamento em massa sem deixar scripts derrubarem o server)
export const voteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
  message: { error: 'Muitos votos computados. Descanse os dedos por alguns minutos.' },
});
