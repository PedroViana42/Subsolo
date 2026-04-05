import React from 'react';
import { LogOut } from 'lucide-react';
import logo from '../assets/logo.png';

interface HeaderProps {
  onLogoClick: () => void;
  onLogout: () => void;
}

export function Header({ onLogoClick, onLogout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#000000] border-b border-zinc-900/50 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={onLogoClick}
        >
          <img
            src={logo}
            alt="Subsolo Logo"
            className="h-7 w-auto object-contain opacity-50 group-hover:opacity-100 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]"
          />
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-2 text-zinc-700 hover:text-zinc-300 transition-all text-[9px] font-mono font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg hover:bg-zinc-900 border border-transparent hover:border-zinc-800 active:scale-95 group"
        >
          <LogOut size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          Sair
        </button>
      </div>
    </header>
  );
}
