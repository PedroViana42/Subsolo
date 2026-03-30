import { PostCard } from './PostCard';
import { Post, UserIdentity } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

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
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 glass-card rounded-3xl text-zinc-500"
      >
        <p className="text-lg font-bold">O silêncio é ensurdecedor.</p>
        <p className="text-sm mt-2 opacity-60">Seja o primeiro a quebrar o gelo!</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.4, 
              delay: index * 0.05,
              ease: [0.23, 1, 0.32, 1]
            }}
            layout
          >
            <PostCard
              post={post}
              identity={identity}
              onVote={onVote}
              onComment={onComment}
              onReport={onReport}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
