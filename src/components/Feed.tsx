import React from 'react';
import { PostCard } from './PostCard';
import { Post, UserIdentity } from '../types';

interface FeedProps {
  posts: Post[];
  identity: UserIdentity;
  onVote: (postId: string, vote: 'fact' | 'fic') => void;
  onComment: (postId: string, content: string) => Promise<void>;
  onReport: (postId: string) => void;
}

export function Feed({ posts, identity, onVote, onComment, onReport }: FeedProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-500 dark:text-zinc-400">
        <p className="text-lg">Nenhuma confissão ainda.</p>
        <p className="text-sm mt-2">Seja o primeiro a confessar algo!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          identity={identity}
          onVote={onVote}
          onComment={onComment}
          onReport={onReport}
        />
      ))}
    </div>
  );
}
