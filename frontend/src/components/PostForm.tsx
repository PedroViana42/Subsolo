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
    <div className="mb-12">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Textarea Bento Cell - Expanded */}
        <div className="glass-card rounded-[3rem] p-2 relative group focus-within:ring-4 focus-within:ring-violet-500/10 transition-all">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="O que você quer confessar hoje?"
            className="w-full bg-transparent border-none rounded-[2.5rem] p-10 text-zinc-100 placeholder-zinc-700 focus:outline-none resize-none font-sans text-xl leading-relaxed min-h-[220px]"
            maxLength={maxChars}
          />
          <div className="absolute bottom-8 right-10 text-xs font-mono text-zinc-600 font-bold bg-black/40 px-4 py-1.5 rounded-full border border-white/5 shadow-2xl">
            <span className={content.length >= maxChars ? 'text-rose-500' : 'text-zinc-400'}>
              {content.length}
            </span>
            <span className="opacity-40"> / {maxChars}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Tags Bento Cell */}
          <div className="md:col-span-3 glass-card rounded-[2.25rem] p-5 flex items-center gap-4 overflow-x-auto scrollbar-hide border-white/5 hover:border-white/10 transition-colors">
            <div className="pl-4">
              <Hash size={20} className="text-violet-500/40" />
            </div>
            <div className="flex gap-3">
              {TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setSelectedTag(tag)}
                  className={`whitespace-nowrap px-8 py-4 rounded-2xl text-[13px] font-black transition-all border uppercase tracking-[0.2em] ${
                    selectedTag === tag 
                      ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_30px_rgba(124,58,237,0.4)] scale-[1.02]' 
                      : 'bg-zinc-800/20 border-white/5 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/40 hover:border-white/10'
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
              className="w-full h-full min-h-[84px] glass-card rounded-[2.25rem] flex items-center justify-center gap-4 group relative overflow-hidden transition-all disabled:opacity-30 disabled:grayscale disabled:cursor-not-allowed hover:bg-violet-500/10 active:scale-[0.98] border-violet-500/20"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-700 pointer-events-none" />
              
              <AnimatePresence mode="wait">
                {isPosting ? (
                  <motion.div 
                    key="posting"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <div className="w-7 h-7 border-3 border-violet-500/20 border-t-violet-400 rounded-full animate-spin" />
                  </motion.div>
                ) : (
                  <motion.div 
                    key="idle"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="flex items-center gap-3 text-zinc-300 group-hover:text-violet-400 transition-colors font-black uppercase tracking-[0.3em] text-[13px]"
                  >
                    Postar
                    <Send size={20} className="group-hover:translate-x-1.5 group-hover:-translate-y-1.5 transition-transform duration-500 ease-out" />
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
