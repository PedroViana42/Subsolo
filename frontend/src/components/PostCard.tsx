import React, { useState } from 'react';
import { Flag, MessageCircle, CheckCircle2, XCircle, Send, Bot, Trophy, Pencil, Trash2, X, Check } from 'lucide-react';
import { Post, UserIdentity } from '../types';
import { BadgeList } from './BadgeList';
import { AuraWrapper } from './AuraWrapper';
import { motion, AnimatePresence } from 'framer-motion';

interface PostCardProps {
  key?: string;
  post: Post;
  identity: UserIdentity;
  isRelic?: boolean;
  onVote: (postId: string, vote: 'fact' | 'fic') => void;
  onComment: (postId: string, content: string) => Promise<void>;
  onReport: (postId: string) => void;
  onEdit?: (postId: string, content: string, tag: string) => Promise<void>;
  onDelete?: (postId: string) => Promise<void>;
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

export function PostCard({ post, identity, isRelic, onVote, onComment, onReport, onEdit, onDelete }: PostCardProps) {
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const totalVotes = post.factCount + post.ficCount;
  const factPercent = totalVotes === 0 ? 50 : Math.round((post.factCount / totalVotes) * 100);
  const ficPercent = totalVotes === 0 ? 50 : Math.round((post.ficCount / totalVotes) * 100);

  const handleSaveEdit = async () => {
    if (!onEdit || isSavingEdit) return;
    setIsSavingEdit(true);
    try {
      await onEdit(post.id, editContent, post.tag);
      setIsEditing(false);
    } finally {
      setIsSavingEdit(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete || isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(post.id);
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

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
    <div className={`brute-card brute-card-hover rounded-2xl p-4 sm:p-6 relative overflow-hidden group/card transition-all duration-500 ${
      isRelic 
        ? 'border-violet-500 shadow-[8px_8px_0px_0px_#7c3aed] sm:shadow-[15px_15px_0px_0px_#7c3aed] bg-gradient-to-br from-[#0a0a0a] to-violet-950/20' 
        : post.isBot ? 'neon-border-violet' : ''
    }`}>
      {isRelic && (
        <div className="absolute top-0 right-0 p-2 z-20">
          <div className="bg-violet-600 text-white text-[8px] font-black px-3 py-1 rounded-bl-xl rounded-tr-sm border-l-2 border-b-2 border-violet-400 font-mono shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-[0.2em] flex items-center gap-1.5 animate-pulse">
            <Trophy size={10} strokeWidth={4} />
            Relíquia
          </div>
        </div>
      )}
      {post.isBot && !isRelic && (
        <div className="absolute top-0 left-0 w-full h-1.5 bg-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.5)]" />
      )}
      <div className="flex justify-between items-start mb-6">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-3">
            <AuraWrapper honestyScore={post.honestyScore} isBot={post.isBot} className={`text-[13px] font-mono font-black flex items-center gap-2 tracking-tight ${post.isBot ? 'text-violet-400 drop-shadow-[0_0_8px_rgba(124,58,237,0.6)]' : 'text-zinc-100'}`}>
              {post.isBot && <Bot size={14} strokeWidth={3} />}
              {post.authorNickname.toUpperCase()}
              <span className="ml-0.5">{post.honestyScore}</span>
            </AuraWrapper>
            <span className="px-2 py-0.5 rounded bg-black text-zinc-500 text-[9px] font-mono font-black uppercase tracking-widest border border-zinc-800">
              {post.tag}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <BadgeList badgeIds={post.authorBadges} />
            <span className="text-[10px] text-zinc-600 font-mono font-black uppercase tracking-[0.15em]">
              {formatTimeAgo(post.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {post.isOwner && onEdit && (
            <button
              onClick={() => { setIsEditing(true); setEditContent(post.content); setConfirmDelete(false); }}
              className="text-zinc-700 hover:text-violet-400 transition-all p-2 rounded-xl hover:bg-violet-500/10 border border-transparent hover:border-violet-900 active:scale-90"
              title="Editar"
            >
              <Pencil size={15} />
            </button>
          )}
          {post.isOwner && onDelete && !confirmDelete && (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-zinc-700 hover:text-rose-500 transition-all p-2 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-900 active:scale-90"
              title="Excluir"
            >
              <Trash2 size={15} />
            </button>
          )}
          {post.isOwner && onDelete && confirmDelete && (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-rose-400 hover:text-rose-300 transition-all p-2 rounded-xl hover:bg-rose-500/10 border border-rose-900 active:scale-90 disabled:opacity-40"
                title="Confirmar exclusão"
              >
                {isDeleting ? <div className="w-3.5 h-3.5 border-2 border-rose-400/20 border-t-rose-400 rounded-full animate-spin" /> : <Check size={15} strokeWidth={3} />}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-zinc-600 hover:text-zinc-300 transition-all p-2 rounded-xl hover:bg-zinc-800 border border-transparent active:scale-90"
                title="Cancelar"
              >
                <X size={15} strokeWidth={3} />
              </button>
            </div>
          )}
          {!post.isOwner && (
            <button
              onClick={() => onReport(post.id)}
              className="text-zinc-700 hover:text-rose-500 transition-all p-2 rounded-xl hover:bg-rose-500/10 border border-transparent hover:border-rose-900 active:scale-90"
              title="Denunciar"
            >
              <Flag size={16} />
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="mb-8">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full brute-input rounded-xl p-4 text-base resize-none min-h-[100px] mb-3"
            maxLength={500}
            autoFocus
          />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-zinc-600 font-mono">{editContent.length}/500</span>
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="text-[11px] font-mono font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2 border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSavingEdit || editContent.trim().length < 10}
                className="text-[11px] font-mono font-black uppercase tracking-widest px-4 py-2 rounded-xl border-2 border-violet-600 bg-violet-700 hover:bg-violet-600 text-white transition-all disabled:opacity-30 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
              >
                {isSavingEdit ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </div>
        </div>
      ) : (
      <p className="text-zinc-100 text-base sm:text-lg leading-relaxed mb-8 whitespace-pre-wrap break-words font-sans font-medium selection:bg-violet-500/30">
        {post.content}
      </p>
      )}
      
      {/* Fato ou Fic System */}
      <div className="mb-6 relative z-10">
        <div className="flex items-center justify-between mb-4 gap-3">
          <button
            onClick={() => onVote(post.id, 'fact')}
            className={`flex-1 min-w-[100px] sm:min-w-[120px] brute-card bg-zinc-900 border-2 border-emerald-950/30 hover:border-emerald-500/50 hover:bg-emerald-950/20 px-3 py-3 sm:px-6 sm:py-4 rounded-xl flex items-center justify-center gap-2 sm:gap-3 transition-all group active:translate-x-[1px] active:translate-y-[1px] text-[10px] uppercase tracking-widest border-2 ${
              post.userVote === 'fact'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-emerald-500/50 hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 size={16} strokeWidth={3} />
            <span>Fato • {post.factCount}</span>
          </button>
          
          <button
            onClick={() => onVote(post.id, 'fic')}
            className={`flex-1 min-w-[100px] sm:min-w-[120px] brute-card bg-zinc-900 border-2 border-rose-950/30 hover:border-rose-500/50 hover:bg-rose-950/20 px-3 py-3 sm:px-6 sm:py-4 rounded-xl flex items-center justify-center gap-2 sm:gap-3 transition-all group active:translate-x-[1px] active:translate-y-[1px] text-[10px] uppercase tracking-widest border-2 ${
              post.userVote === 'fic'
                ? 'bg-rose-600 text-white border-rose-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-rose-500/50 hover:text-rose-400'
            }`}
          >
            <XCircle size={16} strokeWidth={3} />
            <span>Fic • {post.ficCount}</span>
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-black rounded-full overflow-hidden flex border border-zinc-800">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${factPercent}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="h-full bg-emerald-500"
          />
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${ficPercent}%` }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="h-full bg-rose-500"
          />
        </div>
      </div>

      {/* Actions Footer */}
      <div className="flex items-center pt-4 border-t border-zinc-800/50">
        <button
          onClick={() => setIsCommentsOpen(!isCommentsOpen)}
          className={`flex items-center gap-3 text-[10px] font-mono font-black uppercase tracking-[0.2em] transition-all py-2 px-4 rounded-xl border-2 ${
            isCommentsOpen 
              ? 'bg-violet-950/40 text-violet-400 border-violet-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' 
              : 'text-zinc-600 hover:text-zinc-300 border-zinc-800 hover:border-zinc-700'
          }`}
        >
          <MessageCircle size={14} strokeWidth={3} />
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
            <div className="mt-6 pt-6 border-t border-zinc-800/30">
              <form onSubmit={handleCommentSubmit} className="flex gap-3 mb-6">
                <textarea
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  placeholder="Contribua com a treta..."
                  className="flex-1 brute-input rounded-xl p-4 text-sm resize-none min-h-[52px]"
                  rows={1}
                />
                <button
                  type="submit"
                  disabled={!commentContent.trim() || isCommenting}
                  className="bg-violet-700 hover:bg-violet-600 disabled:opacity-30 text-white w-12 h-12 flex items-center justify-center rounded-xl transition-all border-2 border-violet-500 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
                >
                  {isCommenting ? (
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send size={18} strokeWidth={3} />
                  )}
                </button>
              </form>

              <div className="space-y-3">
                {post.comments.map((comment, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    key={comment.id} 
                    className="flex flex-col gap-3 bg-zinc-900 border-2 border-zinc-800 p-5 rounded-2xl"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AuraWrapper honestyScore={comment.honestyScore} isBot={comment.isBot} className={`text-[12px] font-mono font-black flex items-center gap-2 uppercase ${comment.isBot ? 'text-violet-400' : 'text-zinc-200'}`}>
                          {comment.isBot && <Bot size={12} strokeWidth={3} />}
                          {comment.authorNickname} {comment.honestyScore}
                        </AuraWrapper>
                        {comment.isOp && (
                          <span className="px-2 py-0.5 rounded-lg bg-violet-600 text-white text-[8px] font-black uppercase tracking-widest border border-violet-400 shadow-sm">
                            OP
                          </span>
                        )}
                      </div>
                      <span className="text-[9px] text-zinc-600 font-black uppercase tracking-widest">
                        {formatTimeAgo(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-[14px] text-zinc-400 leading-relaxed font-sans font-medium">
                      {comment.content}
                    </p>
                  </motion.div>
                ))}
                {post.comments.length === 0 && (
                  <div className="text-center py-12 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-800">
                    <p className="text-[10px] text-zinc-700 font-black uppercase tracking-[0.3em]">
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
