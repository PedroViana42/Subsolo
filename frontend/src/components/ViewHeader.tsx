import React from 'react';
import { View } from '../types';

interface ViewHeaderProps {
  currentView: View;
}

export function ViewHeader({ currentView }: ViewHeaderProps) {
  if (currentView === 'feed') return null;

  return (
    <div className="mb-8 p-6 bg-[#121212] rounded-2xl border border-zinc-800/50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600 via-violet-400 to-violet-600" />
      <h2 className="text-2xl font-bold text-zinc-100 mb-2">
        {currentView === 'hall' ? '🏆 Mural de Relíquias' : '⚙️ Minhas Confissões'}
      </h2>
      <p className="text-zinc-500 text-sm font-mono">
        {currentView === 'hall' 
          ? 'As confissões mais lendárias e comentadas do campus.' 
          : 'Suas postagens anônimas protegidas pela criptografia do Subsolo.'}
      </p>
    </div>
  );
}
