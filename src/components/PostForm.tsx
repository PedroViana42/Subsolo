import React, { useState } from 'react';
import { Ghost, Send, Clock, Hash } from 'lucide-react';
import { UserIdentity, Tag } from '../types';

interface PostFormProps {
  onPost: (content: string, tag: Tag) => Promise<void>;
  identity: UserIdentity;
}

const TAGS: Tag[] = ['#Fofoca', '#Provas', '#RU', '#Eventos'];

export function PostForm({ onPost, identity }: PostFormProps) {
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const maxChars = 280;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || content.length > maxChars || isPosting || !selectedTag) return;

    setIsPosting(true);
    try {
      await onPost(content, selectedTag);
      setContent('');
      setSelectedTag(null);
    } finally {
      setIsPosting(false);
    }
  };

  const getHoursRemaining = () => {
    const diff = identity.expiresAt.getTime() - new Date().getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60)));
  };

  const progressPercent = (getHoursRemaining() / 48) * 100;

  return (
    <div className="bg-[#121212] rounded-2xl shadow-lg border border-zinc-800/50 p-4 sm:p-6 mb-8 transition-colors relative overflow-hidden">
      {/* Hacker-like accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600/20 via-violet-500 to-violet-600/20" />
      
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-violet-900/30 flex items-center justify-center text-violet-400 border border-violet-500/20">
          <Ghost size={20} />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-400 flex items-center gap-2">
            Postando como: <strong className="text-zinc-100">{identity.nickname} {identity.honestyScore}</strong>
            <div className="group relative flex items-center">
              <Clock size={14} className="text-zinc-500 cursor-help" />
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                Expira em {getHoursRemaining()}h
              </div>
            </div>
          </span>
          {/* Mini progress bar for identity */}
          <div className="h-1 w-32 bg-zinc-800 rounded-full mt-1.5 overflow-hidden">
            <div 
              className="h-full bg-violet-500 transition-all duration-1000"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="O que você quer confessar hoje?"
          className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none transition-all font-mono text-sm"
          rows={4}
          maxLength={maxChars}
        />
        
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Hash size={16} className="text-zinc-500" />
            {TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  selectedTag === tag 
                    ? 'bg-violet-600 text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]' 
                    : 'bg-zinc-800/50 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300 border border-zinc-700/50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
          
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <span className={`text-xs font-mono ${content.length >= maxChars ? 'text-red-500' : 'text-zinc-500'}`}>
              {content.length}/{maxChars}
            </span>
            
            <button
              type="submit"
              disabled={!content.trim() || isPosting || !selectedTag}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-6 py-2 rounded-lg font-medium transition-all active:scale-95 disabled:active:scale-100 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(124,58,237,0.2)] hover:shadow-[0_0_20px_rgba(124,58,237,0.4)] disabled:shadow-none"
            >
              {isPosting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Enviando...
                </span>
              ) : (
                <>
                  <Send size={16} />
                  Postar
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
