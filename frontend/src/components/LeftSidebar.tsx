import React from 'react';
import { Flame, Trophy, Settings, Clock, Ghost, ShieldCheck } from 'lucide-react';
import { UserIdentity, View } from '../types';
import { motion } from 'framer-motion';

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
    <aside className="w-full xl:w-72 flex-shrink-0 space-y-6">
      {/* Identity Profile Section */}
      <div className="glass-card rounded-[2.5rem] p-8 relative overflow-hidden group border-violet-500/10 transition-all hover:bg-white/5">
        <div className="absolute -top-4 -right-4 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
          <Ghost size={140} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20 shadow-inner">
              <ShieldCheck size={20} />
            </div>
            <h2 className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.3em] font-mono opacity-60">Identidade</h2>
          </div>

          <div className="space-y-4">
            <div className="text-[26px] font-black text-zinc-100 leading-tight tracking-tighter break-words">
              {identity.nickname}
              <span className="ml-2 text-violet-500/40 text-[22px]">
                {identity.honestyScore}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] bg-black/20 py-1.5 px-3 rounded-xl inline-flex border border-white/5">
              <Clock size={12} className="text-violet-500/50" />
              <span>Expira em <span className="text-zinc-200 font-mono font-black">{getHoursRemaining()}h</span></span>
            </div>
          </div>

          <div className="mt-8">
            <div className="h-1.5 w-full bg-zinc-800/30 rounded-full overflow-hidden border border-white/5 p-0">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-gradient-to-r from-violet-600/60 via-violet-500 to-violet-600/60 rounded-full shadow-[0_0_15px_rgba(139,92,246,0.3)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu Section */}
      <nav className="glass-card rounded-[2.25rem] p-3 border-white/5">
        <ul className="space-y-2">
          {[
            { id: 'feed', label: 'Feed Principal', icon: Flame },
            { id: 'hall', label: 'Mural de Relíquias', icon: Trophy },
            { id: 'my-posts', label: 'Minhas Confissões', icon: Settings },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <li key={item.id}>
                <button 
                  onClick={() => onViewChange(item.id as View)}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-[1.5rem] font-bold text-[11px] uppercase tracking-[0.2em] transition-all group border ${
                    isActive
                      ? 'bg-violet-600/10 text-violet-400 border-violet-500/20 shadow-[0_0_25px_rgba(124,58,237,0.1)]'
                      : 'text-zinc-500 hover:text-zinc-200 border-transparent hover:bg-white/5 hover:border-white/5'
                  }`}
                >
                  <Icon size={18} className={`${isActive ? 'text-violet-400' : 'text-zinc-600 group-hover:text-zinc-300'} transition-colors duration-300`} />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}

