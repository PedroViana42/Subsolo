import React from 'react';
import { Check, Shield } from 'lucide-react';
import { UserIdentity } from '../types';

interface MaskGenerationScreenProps {
  identity: UserIdentity;
  onAcceptMask: () => void;
}

export function MaskGenerationScreen({ identity, onAcceptMask }: MaskGenerationScreenProps) {
  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 selection:bg-violet-500/30">
      <div className="w-full max-w-md bg-[#121212] rounded-2xl border border-zinc-800/50 p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-[60px] rounded-full pointer-events-none" />

        <div className="flex justify-center mb-6 relative z-10">
          <div className="h-16 w-16 bg-zinc-900 rounded-2xl flex items-center justify-center border border-zinc-800">
            <span className="text-3xl animate-bounce">{identity.honestyScore}</span>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-zinc-100 mb-2 relative z-10">Identidade Temporal</h1>
        <p className="text-sm text-zinc-400 mb-8 relative z-10">
          Sua máscara foi atribuída. Ela será válida pelas próximas 48 horas.
        </p>

        <div className="bg-[#0a0a0a] border border-zinc-800 rounded-xl p-6 mb-8 relative z-10">
          <div className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-2">Seu Nick atual</div>
          <div className="text-2xl font-black text-zinc-100">
            {identity.nickname}
          </div>

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-zinc-500 bg-zinc-900/50 py-1.5 px-3 rounded-full inline-flex border border-zinc-800/50">
            <Shield size={12} className="text-emerald-400" />
            <span>Anonimato Controlado Ativo</span>
          </div>
        </div>

        <button
          onClick={onAcceptMask}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 relative z-10"
        >
          <Check size={18} />
          Aceitar Máscara & Entrar
        </button>
      </div>
    </div>
  );
}
