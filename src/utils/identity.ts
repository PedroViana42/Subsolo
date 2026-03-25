import { UserIdentity } from '../types';
import { ADJECTIVES, NOUNS } from '../constants/identity';
import { ALL_BADGES } from '../constants/badges';

export const generateIdentity = (): UserIdentity => {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48h from now
  const honestyScore = Math.random() > 0.5 ? '😇' : '🤥';
  
  // Randomly assign 1-3 badges for demo
  const shuffled = [...ALL_BADGES].sort(() => 0.5 - Math.random());
  const badges = shuffled.slice(0, Math.floor(Math.random() * 3) + 1).map(b => b.id);

  return { nickname: `${noun} ${adj}`, expiresAt, honestyScore, badges };
};
