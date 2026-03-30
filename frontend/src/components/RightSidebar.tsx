import React, { useState } from 'react';
import { UtensilsCrossed, Calendar, Activity, CheckCircle2, XCircle, TrendingUp, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function RightSidebar() {
  const [ruVote, setRuVote] = useState<'good' | 'bad' | null>(null);

  return (
    <aside className="w-full xl:w-96 flex-shrink-0 space-y-6">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* O Fiscal do RU */}
        <div className="col-span-2 glass-card rounded-[2rem] p-7 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
            <UtensilsCrossed size={100} />
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20 shadow-inner">
              <UtensilsCrossed size={18} />
            </div>
            <h2 className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em]">O Fiscal do RU</h2>
          </div>
          
          <div className="bg-black/40 rounded-[1.5rem] p-6 border border-white/5 mb-6 group-hover:border-white/10 transition-colors">
            <p className="text-[11px] text-zinc-500 font-bold uppercase mb-3 tracking-widest opacity-60">Cardápio de Hoje</p>
            <ul className="text-[15px] text-zinc-200 space-y-3 font-medium">
              <li className="flex items-center gap-3">
                <div className="w-1.5 h-1.5 bg-violet-500 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                Estrogonofe de Frango
              </li>
              <li className="flex items-center gap-3 opacity-70 hover:opacity-100 transition-opacity">
                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full" />
                Opção Veg: PTS com Batata
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setRuVote(ruVote === 'good' ? null : 'good')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                ruVote === 'good'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                  : 'bg-zinc-800/20 text-zinc-500 border-white/5 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20'
              }`}
            >
              <CheckCircle2 size={16} />
              Banquete
            </button>
            <button
              onClick={() => setRuVote(ruVote === 'bad' ? null : 'bad')}
              className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all border ${
                ruVote === 'bad'
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 shadow-[0_0_20px_rgba(244,63,94,0.2)]'
                  : 'bg-zinc-800/20 text-zinc-500 border-white/5 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20'
              }`}
            >
              <XCircle size={16} />
              Tóxico
            </button>
          </div>
        </div>

        {/* Termômetro */}
        <div className="col-span-2 glass-card rounded-[2rem] p-7 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400 border border-rose-500/20">
                <Activity size={18} />
              </div>
              <h2 className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Status</h2>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-black text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full border border-rose-500/20 animate-pulse">
              <Flame size={14} />
              CAOS
            </div>
          </div>
          
          <div className="relative pt-2">
            <div className="h-2 w-full bg-zinc-800/30 rounded-full overflow-hidden border border-white/5 relative">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)]"
              />
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">Probabilidade de Treta</span>
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
        <div className="col-span-2 glass-card rounded-[2rem] p-7">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
              <TrendingUp size={18} />
            </div>
            <h2 className="text-[12px] font-bold text-zinc-400 uppercase tracking-[0.2em]">Top Trends</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="px-5 py-2.5 bg-violet-500/10 text-violet-400 rounded-2xl border border-violet-500/20 cursor-pointer hover:bg-violet-500/20 transition-all font-bold text-[11px] uppercase tracking-widest">#GreveNoRU</span>
            <span className="px-5 py-2.5 bg-zinc-800/20 text-zinc-500 rounded-2xl border border-white/5 cursor-pointer hover:text-zinc-300 hover:bg-zinc-800/40 transition-all font-bold text-[11px] uppercase tracking-widest">#Provas</span>
            <span className="px-5 py-2.5 bg-zinc-800/20 text-zinc-500 rounded-2xl border border-white/5 cursor-pointer hover:text-zinc-300 hover:bg-zinc-800/40 transition-all font-bold text-[11px] uppercase tracking-widest">#CaféGelado</span>
          </div>
        </div>

      </div>
    </aside>
  );
}
