import { Flame, Trophy, Settings, Clock } from 'lucide-react';
import { UserIdentity, View } from '../types';
import { BadgeList } from './BadgeList';
import { AuraWrapper } from './AuraWrapper';

interface LeftSidebarProps {
  identity: UserIdentity;
  currentView: View;
  onViewChange: (view: View) => void;
}

export function LeftSidebar({ identity, currentView, onViewChange }: LeftSidebarProps) {
  const getHoursRemaining = () => {
    const diff = identity.expiresAt.getTime() - new Date().getTime();
    return Math.max(1, Math.floor(diff / (1000 * 60 * 60)));
  };

  const progressPercent = (getHoursRemaining() / 48) * 100;

  return (
    <aside className="w-full lg:w-64 flex-shrink-0 space-y-6">
      {/* Identity Card */}
      <div className="bg-[#121212] rounded-2xl border border-zinc-800/50 p-5 relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-600/20 via-violet-500 to-violet-600/20" />
        
        <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 font-mono">
          Identidade Atual
        </h2>
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-violet-900/30 flex items-center justify-center text-2xl border border-violet-500/20 shadow-[0_0_15px_rgba(124,58,237,0.1)]">
            {identity.honestyScore}
          </div>
          <div>
            <div className="font-bold text-zinc-100 text-sm">
              <AuraWrapper honestyScore={identity.honestyScore}>
                {identity.nickname}
              </AuraWrapper>
            </div>
            <div className="text-xs text-zinc-500 font-mono mt-0.5 flex items-center gap-1">
              <Clock size={12} />
              {getHoursRemaining()}h restantes
            </div>
          </div>
        </div>

        <div className="h-1.5 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-800">
          <div 
            className="h-full bg-violet-500 transition-all duration-1000"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-4 pt-4 border-t border-zinc-800/50">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3 font-mono">
            Conquistas de Legado
          </div>
          <BadgeList badgeIds={identity.badges} size="md" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-[#121212] rounded-2xl border border-zinc-800/50 p-3">
        <ul className="space-y-1">
          <li>
            <button 
              onClick={() => onViewChange('feed')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                currentView === 'feed'
                  ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[0_0_15px_rgba(124,58,237,0.05)]'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Flame size={18} />
              Feed Principal
            </button>
          </li>
          <li>
            <button 
              onClick={() => onViewChange('hall')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                currentView === 'hall'
                  ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[0_0_15px_rgba(124,58,237,0.05)]'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Trophy size={18} />
              Mural de Relíquias
            </button>
          </li>
          <li>
            <button 
              onClick={() => onViewChange('my-posts')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                currentView === 'my-posts'
                  ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-[0_0_15px_rgba(124,58,237,0.05)]'
                  : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border border-transparent'
              }`}
            >
              <Settings size={18} />
              Minhas Confissões
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}

