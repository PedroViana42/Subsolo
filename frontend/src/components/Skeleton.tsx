import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div 
      className={`bg-zinc-900 border-2 border-zinc-800/50 animate-pulse ${className}`}
    />
  );
}

export function PostSkeleton() {
  return (
    <div className="brute-card rounded-2xl p-6 space-y-6 bg-[#050505] border-4 border-zinc-900 shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-3">
            <Skeleton className="w-32 h-4 rounded-lg" />
            <Skeleton className="w-16 h-4 rounded-lg opacity-30" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="w-20 h-2.5 rounded-lg opacity-40" />
            <Skeleton className="w-12 h-2.5 rounded-lg opacity-20" />
          </div>
        </div>
        <Skeleton className="w-8 h-8 rounded-xl" />
      </div>
      
      {/* Content Skeleton */}
      <div className="space-y-3 py-2">
        <Skeleton className="w-full h-5 rounded-lg" />
        <Skeleton className="w-full h-5 rounded-lg" />
        <Skeleton className="w-[85%] h-5 rounded-lg" />
      </div>

      {/* Vote Area Skeleton */}
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="flex-1 h-12 rounded-xl" />
          <Skeleton className="flex-1 h-12 rounded-xl" />
        </div>
        <Skeleton className="w-full h-1.5 rounded-full border border-zinc-800" />
      </div>

      {/* Footer Skeleton */}
      <div className="flex gap-6 pt-4 border-t border-zinc-900/50">
        <Skeleton className="w-32 h-10 rounded-xl" />
      </div>
    </div>
  );
}
