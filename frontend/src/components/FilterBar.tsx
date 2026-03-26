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
    <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onFilterChange(tag)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
            activeFilter === tag
              ? 'bg-violet-600 text-white shadow-[0_0_10px_rgba(124,58,237,0.3)]'
              : 'bg-[#121212] text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 border border-zinc-800/50'
          }`}
        >
          {tag !== '#Tudo' && <Hash size={14} />}
          {tag === '#Tudo' ? 'Tudo' : tag.replace('#', '')}
        </button>
      ))}
    </div>
  );
}
