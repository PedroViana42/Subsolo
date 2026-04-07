export type Tag = '#Fofoca' | '#Provas' | '#RU' | '#Eventos';
export type View = 'feed' | 'hall' | 'my-posts';

export interface Comment {
  id: string;
  content: string;
  createdAt: Date;
  authorNickname: string;
  honestyScore: string;
  isOp: boolean;
  isBot?: boolean;
}

export interface Badge {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export interface Post {
  id: string;
  content: string;
  createdAt: Date;
  authorNickname: string;
  honestyScore: string;
  factCount: number;
  ficCount: number;
  userVote: 'fact' | 'fic' | null;
  comments: Comment[];
  tag: Tag;
  authorBadges: string[];
  isBot?: boolean;
  isOwner?: boolean;
}

export interface UserIdentity {
  nickname: string;
  expiresAt: Date;
  honestyScore: string;
  badges: string[];
}
