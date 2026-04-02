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
    <div className={`brute-card rounded-2xl p-6 transition-all relative overflow-hidden group/card ${post.isBot ? 'neon-border-violet' : ''}`}>
      {post.isBot && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-violet-600 via-violet-400 to-violet-600 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
      )}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <AuraWrapper honestyScore={post.honestyScore} isBot={post.isBot} className={`text-[14px] font-mono font-bold flex items-center gap-2 ${post.isBot ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]' : 'text-zinc-200'}`}>
              {post.isBot && <Bot size={16} />}
              {post.authorNickname} {post.honestyScore}
            </AuraWrapper>
            <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono font-black uppercase tracking-tighter border border-zinc-700">
              {post.tag}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BadgeList badgeIds={post.authorBadges} />
            <span className="text-[10px] text-zinc-600 font-mono font-bold uppercase tracking-tight opacity-80">
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
      
      <p className="text-zinc-100 text-base sm:text-lg leading-relaxed mb-8 whitespace-pre-wrap break-words font-sans selection:bg-violet-500/30">
        {post.content}
      </p>
      
      {/* Fato ou Fic System */}
      <div className="mb-6 relative z-10">
        <div className="flex items-center justify-between mb-4 gap-3">
          <button
            onClick={() => onVote(post.id, 'fact')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl font-mono font-black transition-all active:translate-x-[1px] active:translate-y-[1px] text-[10px] uppercase tracking-wider border-2 ${
              post.userVote === 'fact'
                ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500 shadow-[2px_2px_0px_0px_rgba(16,185,129,0.3)]'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-emerald-500/40 hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 size={16} />
            <span>Fato • {post.factCount}</span>
          </button>
          
          <button
            onClick={() => onVote(post.id, 'fic')}
            className={`flex-1 flex items-center justify-center gap-2.5 py-3 rounded-xl font-mono font-black transition-all active:translate-x-[1px] active:translate-y-[1px] text-[10px] uppercase tracking-wider border-2 ${
              post.userVote === 'fic'
                ? 'bg-rose-950/40 text-rose-400 border-rose-500 shadow-[2px_2px_0px_0px_rgba(244,63,94,0.3)]'
                : 'bg-zinc-900 text-zinc-500 border-zinc-800 hover:border-rose-500/40 hover:text-rose-400'
            }`}
          >
            <XCircle size={16} />
            <span>Fic • {post.ficCount}</span>
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-black rounded-full overflow-hidden flex border border-zinc-800 relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${factPercent}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${ficPercent}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="h-full bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
          />
        </div>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center pt-4 border-t border-zinc-800">
        <button
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className={`flex items-center gap-3 text-[10px] font-mono font-black uppercase tracking-widest transition-all py-1.5 px-3 rounded-lg ${
            isCommentsOpen ? 'bg-violet-950/40 text-violet-400 border border-violet-500/30' : 'text-zinc-600 hover:text-violet-400 hover:bg-zinc-800'
          }`}
        >
          <MessageCircle size={16} className={isCommentsOpen ? 'animate-pulse' : ''} />
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
            <div className="mt-4 pt-4 border-t border-zinc-900">
              <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Contribua com a treta..."
                  className="flex-1 bg-black border border-zinc-800 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-800 focus:outline-none focus:border-violet-500/50 resize-none font-sans transition-all min-h-[50px]"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={!commentContent.trim() || isCommenting}
                  className="bg-violet-800 hover:bg-violet-700 disabled:bg-zinc-900 disabled:text-zinc-700 text-white w-12 h-12 flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:active:scale-100 flex-shrink-0 border border-violet-600"
                >
                  {isCommenting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={18} />
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
