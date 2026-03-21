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
  isBot?: boolean;
}

export interface UserIdentity {
  nickname: string;
  expiresAt: Date;
  honestyScore: string;
}
