import React, { useState, useEffect } from 'react';
import { Check, Shield, Sparkles } from 'lucide-react';
import { UserIdentity } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface MaskGenerationScreenProps {
  identity: UserIdentity;
  onAcceptMask: () => void;
}

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';

export function MaskGenerationScreen({ identity, onAcceptMask }: MaskGenerationScreenProps) {
  const [displayText, setDisplayText] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(prev => 
        identity.nickname
          .split("")
          .map((char, index) => {
            if (index < iteration) return identity.nickname[index];
            return characters[Math.floor(Math.random() * characters.length)];
          })
          .join("")
      );

      if (iteration >= identity.nickname.length) {
        clearInterval(interval);
        setIsRevealed(true);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(interval);
  }, [identity.nickname]);

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-4 selection:bg-violet-500/30 overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="w-full max-w-md brute-card rounded-2xl p-8 sm:p-12 text-center relative overflow-hidden"
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500" />

        <motion.div 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-8"
        >
          <div className="h-20 w-20 bg-emerald-950/40 rounded-xl flex items-center justify-center border-2 border-emerald-500 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <span className="text-4xl font-mono font-black text-emerald-400">{identity.honestyScore}</span>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
        >
          <h1 className="text-xl font-mono font-black text-zinc-100 mb-2 tracking-tighter uppercase italic">_Identidade_Subsolo_Forjada</h1>
          <p className="text-[12px] text-zinc-600 mb-8 max-w-xs mx-auto leading-relaxed font-mono font-bold uppercase tracking-tighter">
            &gt; máscara temporária atribuída <br/>
            &gt; validade: <span className="text-emerald-500 font-black">48h</span>
          </p>
        </motion.div>

        <div className="bg-black border-2 border-zinc-800 rounded-xl p-6 sm:p-8 mb-8 relative group">
          <div className="text-[10px] font-mono font-black text-violet-500 uppercase tracking-widest mb-4">_Pseudônimo_Gerado</div>
          <div className="text-3xl font-black text-zinc-100 font-mono tracking-tighter break-all uppercase italic">
            {displayText}
          </div>

          <AnimatePresence>
            {isRevealed && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 flex items-center justify-center gap-2 text-[10px] font-mono font-black text-emerald-500 bg-emerald-950/40 py-2 px-4 rounded border border-emerald-500 uppercase tracking-tighter shadow-lg"
              >
                <Shield size={14} />
                <span>Anonimato_Ativo</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={onAcceptMask}
          className="w-full bg-zinc-100 hover:bg-white text-black font-mono font-black py-4 rounded-xl transition-all active:translate-x-[2px] active:translate-y-[2px] flex items-center justify-center gap-3 group relative overflow-hidden uppercase tracking-widest text-[11px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-zinc-300"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Sparkles size={16} />
            ACEITAR_&_ACESSAR_SUBSOLO
          </span>
        </motion.button>
      </motion.div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ delay: 1.2 }}
        className="mt-8 text-[10px] text-zinc-500 max-w-[240px] text-center leading-relaxed"
      >
        Ao entrar, você concorda que sua máscara pode ser revogada em caso de violação das diretrizes da comunidade.
      </motion.p>
    </div>
  );
}
