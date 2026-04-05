import React, { useState } from 'react';
import { UtensilsCrossed, Calendar, Activity, CheckCircle2, XCircle, TrendingUp, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function RightSidebar() {
  const [ruVote, setRuVote] = useState<'good' | 'bad' | null>(null);

  return (
    <aside className="w-full xl:w-96 flex-shrink-0 space-y-4">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-2 gap-4">
        
        {/* O Fiscal do RU */}
        <div className="col-span-2 brute-card brute-card-hover rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute -top-4 -right-4 p-8 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity rotate-12">
            <UtensilsCrossed size={80} />
          </div>
          
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-emerald-500 border-2 border-zinc-900 shadow-inner">
              <UtensilsCrossed size={16} strokeWidth={3} />
            </div>
            <h2 className="text-[10px] font-mono font-black text-zinc-600 uppercase tracking-[0.3em] leading-none">O Fiscal do RU</h2>
          </div>
          
          <div className="bg-black rounded-2xl p-5 border-2 border-zinc-900 mb-6 shadow-inner">
            <p className="text-[9px] text-zinc-700 font-mono font-black uppercase mb-4 tracking-[0.4em]">HOJE NO PRATO</p>
            <ul className="text-[14px] text-zinc-200 space-y-3 font-medium font-sans">
              <li className="flex items-center gap-3">
                <div className="w-2 h-2 bg-violet-600 rounded-full shadow-[0_0_8px_rgba(139,92,246,0.6)]" />
                Estrogonofe de Frango
              </li>
              <li className="flex items-center gap-3 opacity-40">
                <div className="w-2 h-2 bg-zinc-800 rounded-full" />
                Opção Veg: PTS com Batata
              </li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setRuVote(ruVote === 'good' ? null : 'good')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
                ruVote === 'good'
                  ? 'bg-emerald-600 text-white border-emerald-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-x-[1px] -translate-y-[1px]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <CheckCircle2 size={16} strokeWidth={3} />
              Banquete
            </button>
            <button
              onClick={() => setRuVote(ruVote === 'bad' ? null : 'bad')}
              className={`flex-1 flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-[0.2em] transition-all border-2 active:scale-95 ${
                ruVote === 'bad'
                  ? 'bg-rose-600 text-white border-rose-400 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-x-[1px] -translate-y-[1px]'
                  : 'bg-zinc-900 border-zinc-800 text-zinc-600 hover:text-zinc-300 hover:border-zinc-700'
              }`}
            >
              <XCircle size={16} strokeWidth={3} />
              Tóxico
            </button>
          </div>
        </div>

        {/* Termômetro */}
        <div className="col-span-2 brute-card brute-card-hover rounded-2xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-rose-500 border-2 border-zinc-900 shadow-inner">
                <Activity size={16} strokeWidth={3} />
              </div>
              <h2 className="text-[10px] font-mono font-black text-zinc-600 uppercase tracking-[0.3em] leading-none">STATUS</h2>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono font-black text-rose-500 bg-black px-4 py-2 rounded-xl border-2 border-rose-900 animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.1)]">
              <Flame size={14} strokeWidth={3} />
              CAOS
            </div>
          </div>
          
          <div className="relative pt-1">
            <div className="h-3 w-full bg-black rounded-full overflow-hidden border-2 border-zinc-900 relative shadow-inner p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '75%' }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-600 via-yellow-500 to-rose-600 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)]"
              />
            </div>
            <div className="flex justify-between mt-4">
              <span className="text-[9px] text-zinc-700 font-mono font-black uppercase tracking-widest">Treta Meter</span>
              <span className="text-sm font-black text-zinc-100 font-mono tracking-tighter">84%</span>
            </div>
          </div>
        </div>

        {/* Eventos */}
        <div className="col-span-2 brute-card brute-card-hover rounded-2xl p-6 border-2 border-zinc-900">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-violet-500 border-2 border-zinc-900 shadow-inner">
              <Calendar size={16} strokeWidth={3} />
            </div>
            <h2 className="text-[10px] font-mono font-black text-zinc-600 uppercase tracking-[0.3em] leading-none">AGENDA</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-4 items-center group/item cursor-pointer p-3 rounded-2xl hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800">
              <div className="bg-black rounded-xl p-3 text-center min-w-[4rem] border-2 border-zinc-900 shadow-inner group-hover/item:border-violet-500/30 transition-all">
                <div className="text-[8px] text-violet-400 font-black uppercase tracking-[0.2em]">NOV</div>
                <div className="text-xl font-black text-zinc-100 leading-none mt-1 font-mono">12</div>
              </div>
              <div>
                <h3 className="text-[14px] font-black text-zinc-200 group-hover/item:text-violet-400 transition-colors mb-1 font-sans">Festa da Computação</h3>
                <p className="text-[9px] text-zinc-600 font-black uppercase tracking-[0.1em]">DCE • 22:00h</p>
              </div>
            </div>
            
            <div className="flex gap-4 items-center group/item cursor-pointer p-3 rounded-2xl hover:bg-zinc-900 transition-colors border border-transparent hover:border-zinc-800">
              <div className="bg-black rounded-xl p-3 text-center min-w-[4rem] border-2 border-zinc-900 shadow-inner group-hover/item:border-zinc-700 transition-all">
                <div className="text-[8px] text-zinc-700 font-black uppercase tracking-[0.2em]">NOV</div>
                <div className="text-xl font-black text-zinc-500 leading-none mt-1 font-mono">15</div>
              </div>
              <div>
                <h3 className="text-[14px] font-black text-zinc-400 group-hover/item:text-zinc-100 transition-colors mb-1 font-sans">Semana Acadêmica</h3>
                <p className="text-[9px] text-zinc-700 font-black uppercase tracking-[0.1em]">Auditório Principal</p>
              </div>
            </div>
          </div>
        </div>

        {/* Trending Tags */}
        <div className="col-span-2 brute-card brute-card-hover rounded-2xl p-6 border-2 border-zinc-900">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-black flex items-center justify-center text-blue-500 border-2 border-zinc-900 shadow-inner">
              <TrendingUp size={16} strokeWidth={3} />
            </div>
            <h2 className="text-[10px] font-mono font-black text-zinc-600 uppercase tracking-[0.3em] leading-none">TOP TRENDS</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {['#GreveNoRU', '#Provas', '#CaféGelado', '#Geraldo', '#VouTrancar'].map(tag => (
              <span key={tag} className="px-3 py-1.5 bg-black text-zinc-500 rounded-xl border-2 border-zinc-900 cursor-pointer hover:border-violet-500 hover:text-violet-400 transition-all font-mono font-black text-[9px] uppercase tracking-tighter">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
