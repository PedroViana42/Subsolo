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
    <aside className="w-full xl:w-72 flex-shrink-0 space-y-4">
      {/* Identity Profile Section */}
      <div className="brute-card brute-card-hover rounded-2xl p-6 relative overflow-hidden group transition-all">
        <div className="absolute -top-4 -right-4 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-all duration-700 group-hover:scale-110 group-hover:-rotate-12 pointer-events-none">
          <Ghost size={140} />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-violet-500 border-2 border-zinc-900 shadow-inner">
              <ShieldCheck size={18} strokeWidth={3} />
            </div>
            <h2 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] font-mono">Identidade</h2>
          </div>

          <div className="space-y-4">
            <div className="text-lg font-black text-zinc-100 leading-tight tracking-tight break-words font-mono uppercase">
              {identity.nickname}
              <span className="ml-2 text-violet-500">
                {identity.honestyScore}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-[9px] text-zinc-500 font-black uppercase tracking-widest bg-black py-2 px-4 rounded-xl border-2 border-zinc-900 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Clock size={12} strokeWidth={3} className="text-violet-500" />
              <span>Expira em <span className="text-zinc-200">{getHoursRemaining()}h</span></span>
            </div>
          </div>

          <div className="mt-8">
            <div className="h-2 w-full bg-black rounded-full overflow-hidden border-2 border-zinc-900 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1.5, ease: "circOut" }}
                className="h-full bg-violet-600 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.3)]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu Section */}
      <nav className="brute-card rounded-2xl p-3 border-2 border-zinc-900">
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
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl font-mono font-black text-[10px] uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
                    isActive
                      ? 'bg-violet-600 text-white border-violet-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-x-[1px] -translate-y-[1px]'
                      : 'bg-zinc-900/50 text-zinc-600 border-zinc-800 hover:text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                  }`}
                >
                  <Icon size={16} strokeWidth={3} className={`${isActive ? 'text-white' : 'text-zinc-700 group-hover:text-zinc-500'} transition-colors duration-300`} />
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

