import { Trophy, Settings, Star } from 'lucide-react';
import { View } from '../types';

interface ViewHeaderProps {
  currentView: View;
}

export function ViewHeader({ currentView }: ViewHeaderProps) {
  if (currentView === 'feed') return null;

  const isHall = currentView === 'hall';

  return (
    <div className={`mb-10 p-5 sm:p-8 rounded-2xl border-4 relative overflow-hidden shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] ${isHall ? 'bg-violet-600 border-violet-400' : 'bg-zinc-900 border-zinc-800'}`}>
      <div className="absolute -top-6 -right-6 p-8 sm:p-12 opacity-10 rotate-12 pointer-events-none">
        {isHall ? <Trophy className="w-20 h-20 sm:w-32 sm:h-32" strokeWidth={3} /> : <Settings className="w-20 h-20 sm:w-32 sm:h-32" strokeWidth={3} />}
      </div>
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 sm:p-3 rounded-xl border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isHall ? 'bg-black text-violet-400 border-violet-900' : 'bg-black text-zinc-500 border-zinc-950'}`}>
              {isHall ? <Trophy size={16} className="sm:w-5 sm:h-5" strokeWidth={3} /> : <Settings size={16} className="sm:w-5 sm:h-5" strokeWidth={3} />}
            </div>
            <h2 className={`text-xl sm:text-2xl font-mono font-black uppercase italic tracking-tighter ${isHall ? 'text-white' : 'text-zinc-100'}`}>
              {isHall ? 'Mural de Relíquias' : 'Minhas Confissões'}
            </h2>
          </div>
          <p className={`text-sm font-mono font-bold uppercase tracking-widest max-w-xl ${isHall ? 'text-violet-200' : 'text-zinc-500'}`}>
            {isHall 
              ? 'Onde o tempo não apaga o que a comunidade validou como verdade absoluta.' 
              : 'Seu histórico secreto protegido pelo anonimato do Subsolo.'}
          </p>
        </div>

        {isHall && (
          <div className="flex items-center gap-2 bg-black border-2 border-violet-900 px-4 py-2 rounded-xl text-[10px] font-mono font-black text-violet-400 uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-pulse">
            <Star size={14} fill="currentColor" />
            Hall of Fame
          </div>
        )}
      </div>
    </div>
  );
}
