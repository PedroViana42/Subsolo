import React from 'react';
import { Hash } from 'lucide-react';
import { Tag } from '../types';

interface FilterBarProps {
  activeFilter: '#Tudo' | Tag;
  onFilterChange: (tag: '#Tudo' | Tag) => void;
  tags: ('#Tudo' | Tag)[];
}

export function FilterBar({ activeFilter, onFilterChange, tags }: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-3 scrollbar-hide">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onFilterChange(tag)}
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-[11px] font-mono font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
            activeFilter === tag
              ? 'bg-violet-950/40 text-violet-400 border-violet-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
              : 'bg-zinc-900 text-zinc-600 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700'
          }`}
        >
          {tag !== '#Tudo' && <Hash size={12} />}
          {tag === '#Tudo' ? 'Tudo' : tag.replace('#', '')}
        </button>
      ))}
    </div>
  );
}
