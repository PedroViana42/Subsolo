import React from 'react';
import { LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

interface HeaderProps {
  onLogoClick: () => void;
  onLogout: () => void;
}

export function Header({ onLogoClick, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-2xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={onLogoClick}
        >
          <img
            src={logo}
            alt="Subsolo Logo"
            className="h-10 w-auto object-contain opacity-70 group-hover:opacity-100 transition-all duration-500 group-hover:drop-shadow-[0_0_15px_rgba(139,92,246,0.4)] group-hover:scale-105"
          />
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 text-zinc-500 hover:text-rose-400 transition-all text-[11px] font-black uppercase tracking-[0.2em] px-6 py-3 rounded-2xl hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 active:scale-95 group"
        >
          <LogOut size={16} className="group-hover:-translate-x-1 transition-transform" />
          Sair
        </button>
      </div>
    </header>
  );
}
