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
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="w-full max-w-lg glass-card rounded-[3rem] p-12 text-center relative overflow-hidden"
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent" />

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center mb-10"
        >
          <div className="h-24 w-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)] bg-gradient-to-br from-emerald-500/5 to-transparent">
            <span className="text-5xl font-black text-emerald-400">{identity.honestyScore}</span>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl font-black text-zinc-100 mb-3 tracking-tight">Sua Identidade Subsolo</h1>
          <p className="text-[15px] text-zinc-500 mb-10 max-w-sm mx-auto leading-relaxed">
            Uma máscara temporária foi forjada para você. <br/>
            Validade: <span className="text-emerald-400 font-black font-mono">48h</span>.
          </p>
        </motion.div>

        <div className="bg-black/40 border border-white/5 rounded-[2rem] p-10 mb-10 relative group shadow-inner">
          <div className="absolute inset-0 bg-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem] pointer-events-none" />
          
          <div className="text-[11px] font-black text-violet-400/60 uppercase tracking-[0.4em] mb-4">Pseudônimo Atribuído</div>
          <div className="text-4xl font-black text-zinc-100 font-mono tracking-tighter break-all">
            {displayText}
          </div>

          <AnimatePresence>
            {isRevealed && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 flex items-center justify-center gap-3 text-xs font-black text-emerald-400 bg-emerald-400/5 py-2.5 px-6 rounded-full inline-flex border border-emerald-500/20 uppercase tracking-widest shadow-lg"
              >
                <Shield size={16} />
                <span>Anonimato Controlado Ativo</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          onClick={onAcceptMask}
          className="w-full bg-zinc-100 hover:bg-white text-black font-black py-5 rounded-2xl transition-all active:scale-[0.98] flex items-center justify-center gap-3 group relative overflow-hidden uppercase tracking-[0.2em] text-[13px] shadow-2xl"
        >
          <div className="absolute inset-0 bg-emerald-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-700 pointer-events-none" />
          <span className="relative z-10 flex items-center gap-3">
            <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-500" />
            Aceitar & Acessar
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
