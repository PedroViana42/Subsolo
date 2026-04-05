import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function SearchInput({ value, onChange }: SearchInputProps) {
  return (
    <div className="relative mb-6 group">
      <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-zinc-600 group-focus-within:text-violet-500 transition-colors duration-300">
        <Search size={18} strokeWidth={3} />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="O que você está procurando no Subsolo?"
        className="w-full bg-[#050505] border-4 border-zinc-900 rounded-2xl py-4 pl-14 pr-12 text-[11px] font-mono font-black uppercase tracking-widest text-zinc-100 placeholder:text-zinc-800 focus:outline-none focus:border-violet-600 focus:shadow-[8px_8px_0px_0px_#000000] focus:-translate-y-1 transition-all duration-300"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute inset-y-0 right-5 flex items-center text-zinc-600 hover:text-rose-500 transition-colors active:scale-90"
        >
          <X size={20} strokeWidth={3} />
        </button>
      )}
    </div>
  );
}
