import React from 'react';
import logo from '../assets/logo.png';

interface HeaderProps {
  onLogoClick: () => void;
}

export function Header({ onLogoClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-[#000000]/80 backdrop-blur-md border-b border-zinc-800/50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onLogoClick}>
          <img 
            src={logo} 
            alt="Subsolo Logo" 
            className="h-10 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" 
          />
        </div>
      </div>
    </header>
  );
}
