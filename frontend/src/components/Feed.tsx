import { PostCard } from './PostCard';
import { Post, UserIdentity, View } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { PostSkeleton } from './Skeleton';

interface FeedProps {
  posts: Post[];
  identity: UserIdentity;
  isLoading?: boolean;
  currentView?: View;
  onVote: (postId: string, vote: 'fact' | 'fic') => void;
  onComment: (postId: string, content: string) => Promise<void>;
  onReport: (postId: string) => void;
}

export function Feed({ posts, identity, isLoading, currentView, onVote, onComment, onReport }: FeedProps) {
  const isHall = currentView === 'hall';

  if (isLoading && posts.length === 0) {
    return (
      <div className={`space-y-6 ${isHall ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 space-y-0' : ''}`}>
        {[1, 2, 3, 4].map((i) => (
          <PostSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20 brute-card rounded-3xl text-zinc-500 bg-[#050505]"
      >
        <p className="text-lg font-mono font-black uppercase italic">O silêncio é ensurdecedor.</p>
        <p className="text-[10px] mt-2 font-mono font-black uppercase tracking-widest opacity-40">Seja o primeiro a quebrar o gelo!</p>
      </motion.div>
    );
  }

  return (
    <div className={`space-y-6 ${isHall ? 'grid grid-cols-1 lg:grid-cols-2 gap-6 space-y-0 items-start' : ''}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ 
              duration: 0.3, 
              ease: "easeOut"
            }}
            layout
          >
            <PostCard
              post={post}
              identity={identity}
              isRelic={isHall || (post.factCount - post.ficCount > 10)}
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
