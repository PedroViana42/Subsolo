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
    <div className="flex flex-wrap gap-1.5 mt-1">
      {badges.map(badge => (
        <div 
          key={badge.id}
          className={`group relative flex items-center justify-center rounded-full bg-zinc-900/80 border border-zinc-800/50 hover:border-zinc-700 transition-colors cursor-help
            ${size === 'sm' ? 'p-1 h-6 w-6' : 'p-1.5 h-8 w-8'}`}
          title={`${badge.name}: ${badge.description}`}
        >
          <span className={size === 'sm' ? 'text-xs' : 'text-sm'}>
            {badge.icon}
          </span>
          
          {/* Simple Tooltip */}
          <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-zinc-800 text-[10px] text-zinc-200 rounded shadow-xl border border-zinc-700 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20">
            <span className={`font-bold ${badge.color}`}>{badge.name}</span>
            <span className="ml-1 text-zinc-400">{badge.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
