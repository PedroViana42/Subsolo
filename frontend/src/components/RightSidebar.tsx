import React, { useState } from 'react';
import { UtensilsCrossed, Calendar, Activity, CheckCircle2, XCircle } from 'lucide-react';

export function RightSidebar() {
  const [ruVote, setRuVote] = useState<'good' | 'bad' | null>(null);

  return (
    <aside className="w-full lg:w-72 flex-shrink-0 space-y-6">
      {/* O Fiscal do RU */}
      <div className="bg-[#121212] rounded-2xl border border-zinc-800/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <UtensilsCrossed size={18} className="text-violet-400" />
          <h2 className="text-sm font-bold text-zinc-100">O Fiscal do RU</h2>
        </div>
        
        <div className="bg-[#0a0a0a] rounded-xl p-3 border border-zinc-800 mb-4">
          <p className="text-xs text-zinc-400 font-mono mb-2">Cardápio de Hoje:</p>
          <ul className="text-sm text-zinc-300 space-y-1">
            <li>• Estrogonofe de Frango</li>
            <li>• Opção Veg: PTS com Batata</li>
            <li>• Arroz, Feijão, Salada</li>
            <li>• Sobremesa: Gelatina</li>
          </ul>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setRuVote(ruVote === 'good' ? null : 'good')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
              ruVote === 'good'
                ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-800'
                : 'bg-zinc-800/30 text-zinc-400 border border-zinc-800 hover:bg-emerald-900/20 hover:text-emerald-400'
            }`}
          >
            <CheckCircle2 size={14} />
            Banquete
          </button>
          <button
            onClick={() => setRuVote(ruVote === 'bad' ? null : 'bad')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
              ruVote === 'bad'
                ? 'bg-rose-900/40 text-rose-400 border border-rose-800'
                : 'bg-zinc-800/30 text-zinc-400 border border-zinc-800 hover:bg-rose-900/20 hover:text-rose-400'
            }`}
          >
            <XCircle size={14} />
            Sobrevivência
          </button>
        </div>
      </div>

      {/* Próximos Eventos */}
      <div className="bg-[#121212] rounded-2xl border border-zinc-800/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-violet-400" />
          <h2 className="text-sm font-bold text-zinc-100">Próximos Eventos</h2>
        </div>
        
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <div className="bg-zinc-800/50 rounded-lg p-2 text-center min-w-[3rem] border border-zinc-700/50">
              <div className="text-[10px] text-violet-400 font-bold uppercase">Nov</div>
              <div className="text-sm font-bold text-zinc-200">12</div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-200">Festa da Computação</h3>
              <p className="text-xs text-zinc-500 mt-0.5">DCE - 22h</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-start">
            <div className="bg-zinc-800/50 rounded-lg p-2 text-center min-w-[3rem] border border-zinc-700/50">
              <div className="text-[10px] text-violet-400 font-bold uppercase">Nov</div>
              <div className="text-sm font-bold text-zinc-200">15</div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-zinc-200">Semana Acadêmica</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Auditório Principal</p>
            </div>
          </div>
        </div>
      </div>

      {/* Termômetro do Campus */}
      <div className="bg-[#121212] rounded-2xl border border-zinc-800/50 p-5">
        <div className="flex items-center gap-2 mb-4">
          <Activity size={18} className="text-violet-400" />
          <h2 className="text-sm font-bold text-zinc-100">Termômetro do Campus</h2>
        </div>
        
        <div className="relative pt-6 pb-2">
          <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-2 absolute top-0 w-full">
            <span>Paz</span>
            <span>Caos</span>
          </div>
          
          <div className="h-3 w-full bg-zinc-800/50 rounded-full overflow-hidden border border-zinc-800 relative">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-yellow-500/20 to-rose-500/20" />
            {/* Indicator bar - currently at 75% chaos */}
            <div 
              className="h-full bg-gradient-to-r from-emerald-500 via-yellow-500 to-rose-500 transition-all duration-1000 w-[75%]"
            />
          </div>
          <p className="text-xs text-zinc-400 text-center mt-3 font-mono">
            Nível de fofoca: <span className="text-rose-400 font-bold">Crítico</span>
          </p>
        </div>
      </div>
    </aside>
  );
}
