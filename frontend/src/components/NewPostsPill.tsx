import React from 'react';
import { ArrowUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewPostsPillProps {
  count: number;
  onClick: () => void;
}

export function NewPostsPill({ count, onClick }: NewPostsPillProps) {
  return (
    <AnimatePresence>
      {count > 0 && (
        <div className="sticky top-24 z-40 flex justify-center w-full pointer-events-none mb-10">
          <motion.button
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            onClick={onClick}
            className="pointer-events-auto bg-violet-700 hover:bg-violet-600 text-white px-8 py-3 rounded-2xl font-mono font-black text-[11px] uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-violet-500 flex items-center gap-3 transition-all active:scale-95 active:shadow-none active:translate-x-[4px] active:translate-y-[4px]"
          >
            <ArrowUp size={16} strokeWidth={4} className="animate-bounce" />
            {count} {count === 1 ? 'NOVA_CONFISSÃO' : 'NOVAS_CONFISSÕES'}
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  );
}
