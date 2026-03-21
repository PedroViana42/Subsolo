import { UserIdentity } from '../types';
import { ADJECTIVES, NOUNS } from '../constants/identity';

export const generateIdentity = (): UserIdentity => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h from now
  const honestyScore = Math.random() > 0.5 ? '😇' : '🤥';
  return { nickname: `${noun} ${adj}`, expiresAt, honestyScore };
};
