import React from 'react';
import { ALL_BADGES } from '../constants/badges';

interface BadgeListProps {
  badgeIds: string[];
  size?: 'sm' | 'md';
}

export function BadgeList({ badgeIds, size = 'sm' }: BadgeListProps) {
  const badges = ALL_BADGES.filter(b => badgeIds.includes(b.id));

  if (badges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {badges.map(badge => (
        <div 
          key={badge.id}
          className={`group relative flex items-center justify-center bg-black border-2 border-zinc-900 transition-all cursor-help
            ${size === 'sm' ? 'w-7 h-7 rounded-lg' : 'w-9 h-9 rounded-xl'}
            hover:border-violet-600 hover:shadow-[3px_3px_0px_0px_rgba(124,58,237,0.2)] hover:-translate-x-[1px] hover:-translate-y-[1px]`}
        >
          <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>
            {badge.icon}
          </span>
          
          {/* Neo-Brutalist Tooltip */}
          <div className="absolute bottom-full left-0 mb-3 px-3 py-2 bg-black border-2 border-zinc-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-[9px] font-mono font-black uppercase tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all z-20 scale-95 group-hover:scale-100 origin-bottom-left">
            <span className={`italic ${badge.color}`}>[{badge.name}]</span>
            <span className="ml-2 text-zinc-500">{badge.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
