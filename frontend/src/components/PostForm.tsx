import React, { useState } from 'react';
import { Ghost, Send, Clock, Hash, ShieldCheck } from 'lucide-react';
import { UserIdentity, Tag } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="mb-10">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Textarea Bento Cell - Neo-Brutalist */}
        <div className="brute-card rounded-2xl p-4 sm:p-6 mb-8 relative overflow-hidden group transition-all focus-within:border-violet-500 focus-within:shadow-[4px_4px_0px_0px_rgba(124,58,237,0.4)]">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O que você quer confessar hoje?"
            className="w-full bg-transparent border-none rounded-xl p-6 text-zinc-100 placeholder-zinc-800 focus:outline-none resize-none font-sans text-lg font-medium leading-relaxed min-h-[160px]"
            maxLength={maxChars}
          />
          <div className="absolute bottom-4 right-6 text-[10px] font-mono text-zinc-700 font-black bg-black px-3 py-1.5 border border-zinc-800 shadow-xl">
            <span className={content.length >= maxChars ? 'text-rose-500' : 'text-zinc-500'}>
              {content.length}
            </span>
            <span className="opacity-30"> / {maxChars}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Tags Bento Cell */}
          <div className="md:col-span-3 brute-card rounded-2xl p-3 flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <div className="pl-2">
              <Hash size={18} className="text-violet-500" strokeWidth={3} />
            </div>
            <div className="flex gap-2">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`whitespace-nowrap px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl text-[10px] font-mono font-black transition-all border-2 uppercase tracking-[0.2em] ${
                    selectedTag === tag 
                      ? 'bg-violet-600 border-violet-400 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-x-[1px] -translate-y-[1px]' 
                      : 'bg-zinc-800 border-zinc-700 text-zinc-600 hover:text-zinc-300 hover:border-zinc-500'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Bento Cell */}
          <div className="md:col-span-1">
            <button
              type="submit"
              disabled={!content.trim() || isPosting || !selectedTag}
              className="w-full h-full min-h-[64px] brute-card rounded-2xl flex items-center justify-center gap-3 group relative overflow-hidden transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed bg-violet-700 hover:bg-violet-600 border-violet-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
            >
              <AnimatePresence mode="wait">
                {isPosting ? (
                  <motion.div 
                    key="posting"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-2 text-white font-mono font-black uppercase tracking-[0.3em] text-[12px]"
                  >
                    Postar
                    <Send size={16} strokeWidth={3} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
