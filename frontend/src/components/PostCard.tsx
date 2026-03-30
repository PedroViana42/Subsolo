import React, { useState } from 'react';
import { Flag, MessageCircle, CheckCircle2, XCircle, Send, Bot } from 'lucide-react';
import { Post, UserIdentity } from '../types';
import { BadgeList } from './BadgeList';
import { AuraWrapper } from './AuraWrapper';
import { motion, AnimatePresence } from 'framer-motion';

interface PostCardProps {
  key?: string;
  post: Post;
  identity: UserIdentity;
  onVote: (postId: string, vote: 'fact' | 'fic') => void;
  onComment: (postId: string, content: string) => Promise<void>;
  onReport: (postId: string) => void;
}

const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return `há ${Math.floor(interval)} anos`;
  
  interval = seconds / 2592000;
  if (interval > 1) return `há ${Math.floor(interval)} meses`;
  
  interval = seconds / 86400;
  if (interval > 1) return `há ${Math.floor(interval)} dias`;
  
  interval = seconds / 3600;
  if (interval > 1) return `há ${Math.floor(interval)} horas`;
  
  interval = seconds / 60;
  if (interval > 1) return `há ${Math.floor(interval)} min`;
  
  return 'agora mesmo';
};

export function PostCard({ post, identity, onVote, onComment, onReport }: PostCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);

  const totalVotes = post.factCount + post.ficCount;
  const factPercent = totalVotes === 0 ? 50 : Math.round((post.factCount / totalVotes) * 100);
  const ficPercent = totalVotes === 0 ? 50 : Math.round((post.ficCount / totalVotes) * 100);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim() || isCommenting) return;
    setIsCommenting(true);
    try {
      await onComment(post.id, commentContent);
      setCommentContent('');
    } finally {
      setIsCommenting(false);
    }
  };

  return (
    <div className={`glass-card rounded-[2.5rem] p-9 transition-all relative overflow-hidden group/card ${post.isBot ? 'neon-border-violet' : 'border-white/5'}`}>
      {post.isBot && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 via-violet-400 to-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
      )}
      <div className="flex justify-between items-start mb-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <AuraWrapper honestyScore={post.honestyScore} isBot={post.isBot} className={`text-[15px] font-bold flex items-center gap-2 ${post.isBot ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]' : 'text-zinc-200'}`}>
              {post.isBot && <Bot size={18} />}
              {post.authorNickname} {post.honestyScore}
            </AuraWrapper>
            <span className="px-3 py-1 rounded-full bg-zinc-800/40 text-zinc-400 text-[11px] font-black uppercase tracking-widest border border-white/5 shadow-inner">
              {post.tag}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BadgeList badgeIds={post.authorBadges} />
            <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest opacity-60">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>
        </div>
        <button
          onClick={() => onReport(post.id)}
          className="text-zinc-600 hover:text-rose-500 transition-all p-2 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
          title="Denunciar"
        >
          <Flag size={18} />
        </button>
      </div>
      
      <p className="text-zinc-100 text-lg sm:text-xl leading-[1.6] mb-10 whitespace-pre-wrap break-words font-sans selection:bg-violet-500/30">
        {post.content}
      </p>
      
      {/* Fato ou Fic System */}
      <div className="mb-8 relative z-10">
        <div className="flex items-center justify-between mb-5 gap-4">
          <button
            onClick={() => onVote(post.id, 'fact')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all active:scale-[0.98] text-[11px] uppercase tracking-[0.2em] border ${
              post.userVote === 'fact'
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                : 'bg-zinc-800/20 text-zinc-500 border-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20'
            }`}
          >
            <CheckCircle2 size={18} />
            <span>Fato • {post.factCount}</span>
          </button>
          
          <button
            onClick={() => onVote(post.id, 'fic')}
            className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-2xl font-black transition-all active:scale-[0.98] text-[11px] uppercase tracking-[0.2em] border ${
              post.userVote === 'fic'
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
                : 'bg-zinc-800/20 text-zinc-500 border-white/5 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20'
            }`}
          >
            <XCircle size={18} />
            <span>Fic • {post.ficCount}</span>
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-2 w-full bg-zinc-800/30 rounded-full overflow-hidden flex border border-white/5 relative shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${factPercent}%` }}
            transition={{ duration: 1, ease: "circOut" }}
            className="h-full bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.5)]"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${ficPercent}%` }}
            transition={{ duration: 1, ease: "circOut" }}
            className="h-full bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.5)]"
          />
        </div>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center pt-6 border-t border-white/5">
        <button
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className={`flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] transition-all py-2 px-4 rounded-xl ${
            isCommentsOpen ? 'bg-violet-500/10 text-violet-400 shadow-inner' : 'text-zinc-500 hover:text-violet-400 hover:bg-violet-500/5'
          }`}
        >
          <MessageCircle size={20} className={isCommentsOpen ? 'animate-bounce' : ''} />
          {post.comments.length} {post.comments.length === 1 ? 'Comentário' : 'Comentários'}
        </button>
      </div>

      {/* Comments Section */}
      <AnimatePresence>
        {isCommentsOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-6 pt-6 border-t border-white/5">
              <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-8">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Contribua com a treta..."
                  className="flex-1 bg-black/40 border border-white/5 rounded-2xl p-5 text-[15px] text-zinc-100 placeholder-zinc-700 focus:outline-none focus:ring-2 focus:ring-violet-500/20 resize-none font-sans transition-all min-h-[60px]"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={!commentContent.trim() || isCommenting}
                  className="bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-600 text-white w-14 h-14 flex items-center justify-center rounded-2xl transition-all active:scale-90 disabled:active:scale-100 flex-shrink-0 shadow-lg"
                >
                  {isCommenting ? (
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={20} />
                  )}
                </button>
              </form>

              <div className="space-y-4">
                {post.comments.map((comment, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={comment.id} 
                    className="flex flex-col gap-3 bg-zinc-900/40 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AuraWrapper honestyScore={comment.honestyScore} isBot={comment.isBot} className={`text-sm font-bold flex items-center gap-2 ${comment.isBot ? 'text-violet-400' : 'text-zinc-300'}`}>
                          {comment.isBot && <Bot size={14} />}
                          {comment.authorNickname} {comment.honestyScore}
                        </AuraWrapper>
                        {comment.isOp && (
                          <span className="px-2 py-0.5 rounded-md bg-violet-600 text-white text-[9px] font-black uppercase tracking-widest shadow-lg">
                            OP
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-[15px] text-zinc-400 leading-relaxed">
                      {comment.content}
                    </p>
                  </motion.div>
                ))}
                {post.comments.length === 0 && (
                  <div className="text-center py-10 glass-card rounded-2xl border border-dashed border-white/5">
                    <p className="text-sm text-zinc-600 font-bold uppercase tracking-widest">
                      Silêncio ensurdecedor...
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
