import React, { useState } from 'react';
import { UtensilsCrossed, Calendar, Activity, CheckCircle2, XCircle, TrendingUp, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function RightSidebar() {
  const [ruVote, setRuVote] = useState<'good' | 'bad' | null>(null);

  return (
    <aside className="w-full xl:w-96 flex-shrink-0 space-y-4">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-2 gap-3">
        
        {/* O Fiscal do RU */}
        <div className="col-span-2 brute-card rounded-2xl p-5 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
            <UtensilsCrossed size={80} />
          </div>
          
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <UtensilsCrossed size={16} />
            </div>
            <h2 className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest leading-none">O Fiscal do RU</h2>
          </div>
          
          <div className="bg-black rounded-xl p-4 border border-zinc-800 mb-5">
            <p className="text-[9px] text-zinc-600 font-mono font-black uppercase mb-3 tracking-widest">HOJE NO PRATO</p>
            <ul className="text-[14px] text-zinc-200 space-y-2 font-medium">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-violet-600 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                Estrogonofe de Frango
              </li>
              <li className="flex items-center gap-3 opacity-60">
                <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full" />
                Opção Veg: PTS com Batata
              </li>
            </ul>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setRuVote(ruVote === 'good' ? null : 'good')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-mono font-black uppercase tracking-widest transition-all border-2 ${
                ruVote === 'good'
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-emerald-500'
              }`}
            >
              <CheckCircle2 size={14} />
              Banquete
            </button>
            <button
              onClick={() => setRuVote(ruVote === 'bad' ? null : 'bad')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-mono font-black uppercase tracking-widest transition-all border-2 ${
                ruVote === 'bad'
                  ? 'bg-rose-950/40 text-rose-400 border-rose-500 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                  : 'bg-zinc-800 border-zinc-700 text-zinc-500 hover:border-rose-500'
              }`}
            >
              <XCircle size={14} />
              Tóxico
            </button>
          </div>
        </div>

        {/* Termômetro */}
        <div className="col-span-2 brute-card rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
                <Activity size={16} />
              </div>
              <h2 className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest leading-none">STATUS</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-black text-rose-500 bg-rose-950/40 px-2.5 py-1 rounded border border-rose-500 animate-pulse">
              <Flame size={12} />
              CAOS
            </div>
          </div>
          
          <div className="relative pt-1">
            <div className="h-2 w-full bg-black rounded overflow-hidden border border-zinc-800 relative shadow-inner">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-600 via-yellow-500 to-rose-600 shadow-[0_0_10px_rgba(244,63,94,0.3)]"
              />
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-[9px] text-zinc-600 font-mono font-black uppercase tracking-tighter">Probabilidade de Treta</span>
              <span className="text-xs font-black text-zinc-100 font-mono">84%</span>
            </div>
          </div>
        </div>

        {/* Eventos */}
        <div className="col-span-2 glass-card rounded-[2rem] p-7">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center text-violet-400 border border-violet-500/20">
              <Calendar size={18} />
            </div>
            <h2 className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Agenda</h2>
          </div>
          
          <div className="space-y-6">
            <div className="flex gap-5 items-center group/item cursor-pointer">
              <div className="bg-violet-600/10 rounded-2xl p-4 text-center min-w-[4.5rem] border border-violet-500/10 group-hover/item:border-violet-500/30 transition-all group-hover/item:scale-105 shadow-inner">
                <div className="text-[10px] text-violet-400 font-black uppercase tracking-widest">NOV</div>
                <div className="text-2xl font-black text-zinc-100 leading-none mt-1">12</div>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-zinc-200 group-hover/item:text-violet-400 transition-colors mb-1">Festa da Computação</h3>
                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">DCE • 22:00h</p>
              </div>
            </div>
            
            <div className="flex gap-5 items-center group/item cursor-pointer">
              <div className="bg-zinc-800/30 rounded-2xl p-4 text-center min-w-[4.5rem] border border-white/5 group-hover/item:border-white/10 transition-all group-hover/item:scale-105 shadow-inner">
                <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">NOV</div>
                <div className="text-2xl font-black text-zinc-400 leading-none mt-1">15</div>
              </div>
              <div>
                <h3 className="text-[15px] font-bold text-zinc-300 group-hover/item:text-zinc-100 transition-colors mb-1">Semana Acadêmica</h3>
                <p className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">Auditório Principal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Tags */}
        <div className="col-span-2 brute-card rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <TrendingUp size={16} />
            </div>
            <h2 className="text-[10px] font-mono font-black text-zinc-500 uppercase tracking-widest leading-none">TOP TRENDS</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="px-3 py-1.5 bg-violet-950/40 text-violet-400 rounded-md border-2 border-violet-800 cursor-pointer hover:border-violet-500 transition-all font-mono font-black text-[10px] uppercase tracking-tighter italic">#GreveNoRU</span>
            <span className="px-3 py-1.5 bg-zinc-900 text-zinc-500 rounded-md border-2 border-zinc-800 cursor-pointer hover:border-zinc-600 transition-all font-mono font-black text-[10px] uppercase tracking-tighter">#Provas</span>
            <span className="px-3 py-1.5 bg-zinc-900 text-zinc-500 rounded-md border-2 border-zinc-800 cursor-pointer hover:border-zinc-600 transition-all font-mono font-black text-[10px] uppercase tracking-tighter">#CaféGelado</span>
          </div>
        </div>

      </div>
    </aside>
  );
}
