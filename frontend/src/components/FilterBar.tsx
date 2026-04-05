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
    <div className="flex items-center gap-3 overflow-x-auto pb-6 mb-2 scrollbar-hide px-4 -mx-4 sm:px-0 sm:mx-0">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onFilterChange(tag)}
          className={`group flex items-center gap-2 whitespace-nowrap px-3 py-2 sm:px-6 sm:py-2.5 rounded-xl text-[10px] font-mono font-black transition-all border-2 uppercase tracking-[0.2em] ${
            activeFilter === tag
              ? 'bg-violet-600 border-violet-400 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-x-[1px] -translate-y-[1px]'
              : 'bg-zinc-900 text-zinc-600 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-800'
          }`}
        >
          {tag !== '#Tudo' && (
            <Hash 
              size={12} 
              strokeWidth={3} 
              className={activeFilter === tag ? 'text-violet-200' : 'text-violet-500/50 group-hover:text-violet-400'} 
            />
          )}
          {tag === '#Tudo' ? 'Tudo' : tag.replace('#', '')}
        </button>
      ))}
    </div>
  );
}
