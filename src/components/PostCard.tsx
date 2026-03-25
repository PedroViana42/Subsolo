import React, { useState } from 'react';
import { Flag, MessageCircle, CheckCircle2, XCircle, Send, Bot } from 'lucide-react';
import { Post, UserIdentity } from '../types';
import { BadgeList } from './BadgeList';
import { AuraWrapper } from './AuraWrapper';

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
    <div className={`bg-[#121212] rounded-2xl shadow-sm border p-4 sm:p-6 mb-4 transition-colors relative ${post.isBot ? 'border-violet-500/30 shadow-[0_0_15px_rgba(124,58,237,0.1)]' : 'border-zinc-800/50'}`}>
      {post.isBot && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600/50 via-violet-400 to-violet-600/50 rounded-t-2xl" />
      )}
      <div className="flex justify-between items-start mb-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <AuraWrapper honestyScore={post.honestyScore} isBot={post.isBot} className={`text-sm flex items-center gap-1.5 ${post.isBot ? 'text-violet-400 drop-shadow-[0_0_5px_rgba(124,58,237,0.5)]' : 'text-zinc-300'}`}>
              {post.isBot && <Bot size={14} />}
              {post.authorNickname} {post.honestyScore}
            </AuraWrapper>
            <span className="px-2 py-0.5 rounded-full bg-zinc-800/80 text-zinc-400 text-xs font-medium border border-zinc-700/50">
              {post.tag}
            </span>
          </div>
          <BadgeList badgeIds={post.authorBadges} />
          <span className="text-xs text-zinc-500 font-medium mt-1">
            {formatTimeAgo(post.createdAt)}
          </span>
        </div>
        <button
          onClick={() => onReport(post.id)}
          className="text-zinc-500 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-900/20"
          title="Denunciar"
        >
          <Flag size={16} />
        </button>
      </div>
      
      <p className="text-zinc-200 text-base sm:text-lg leading-relaxed mb-6 whitespace-pre-wrap break-words font-sans">
        {post.content}
      </p>
      
      {/* Fato ou Fic System */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3 gap-3 sm:gap-4">
          <button
            onClick={() => onVote(post.id, 'fact')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-xl font-medium transition-all active:scale-95 text-sm sm:text-base ${
              post.userVote === 'fact'
                ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-zinc-800/30 text-zinc-400 border border-zinc-800 hover:bg-emerald-900/20 hover:text-emerald-400 hover:border-emerald-900/50'
            }`}
          >
            <CheckCircle2 size={18} />
            <span>Real Oficial ({post.factCount})</span>
          </button>
          
          <button
            onClick={() => onVote(post.id, 'fic')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 sm:py-2.5 rounded-xl font-medium transition-all active:scale-95 text-sm sm:text-base ${
              post.userVote === 'fic'
                ? 'bg-rose-900/40 text-rose-400 border border-rose-800 shadow-[0_0_10px_rgba(244,63,94,0.2)]'
                : 'bg-zinc-800/30 text-zinc-400 border border-zinc-800 hover:bg-rose-900/20 hover:text-rose-400 hover:border-rose-900/50'
            }`}
          >
            <XCircle size={18} />
            <span>Pura Fic ({post.ficCount})</span>
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden flex border border-zinc-800">
          <div 
            className="h-full bg-emerald-500/80 transition-all duration-500"
            style={{ width: `${factPercent}%` }}
          />
          <div 
            className="h-full bg-rose-500/80 transition-all duration-500"
            style={{ width: `${ficPercent}%` }}
          />
        </div>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center pt-4 border-t border-zinc-800/50">
        <button
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-violet-400 transition-colors"
        >
          <MessageCircle size={18} />
          {post.comments.length} {post.comments.length === 1 ? 'Comentário' : 'Comentários'}
        </button>
      </div>

      {/* Comments Section */}
      {isCommentsOpen && (
        <div className="mt-4 pt-4 border-t border-zinc-800/50 animate-in fade-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleCommentSubmit} className="flex gap-2 mb-6">
            <textarea
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Adicione um comentário..."
              className="flex-1 bg-[#0a0a0a] border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 resize-none font-mono scrollbar-hide [field-sizing:content] max-h-32 overflow-y-auto"
              rows={1}
            />
            <button
              type="submit"
              disabled={!commentContent.trim() || isCommenting}
              className="bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white p-3 rounded-xl transition-all active:scale-95 disabled:active:scale-100 flex-shrink-0"
            >
              <Send size={18} />
            </button>
          </form>

          <div className="space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-1 bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/30">
                <div className="flex items-center gap-2">
                  <AuraWrapper honestyScore={comment.honestyScore} isBot={comment.isBot} className={`text-sm flex items-center gap-1.5 ${comment.isBot ? 'text-violet-400' : 'text-zinc-300'}`}>
                    {comment.isBot && <Bot size={12} />}
                    {comment.authorNickname} {comment.honestyScore}
                  </AuraWrapper>
                  {comment.isOp && (
                    <span className="px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 text-[10px] font-bold uppercase tracking-wider border border-violet-500/20">
                      OP
                    </span>
                  )}
                  <span className="text-xs text-zinc-500">
                    • {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-zinc-300">
                  {comment.content}
                </p>
              </div>
            ))}
            {post.comments.length === 0 && (
              <p className="text-sm text-zinc-500 text-center py-2 font-mono">
                Nenhum comentário ainda. Seja o primeiro!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
