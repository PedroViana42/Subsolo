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
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 selection:bg-violet-500/30 overflow-hidden relative">
      {/* Neo-Brutalist Background Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md brute-card rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden bg-[#050505] border-4 border-zinc-900 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)]"
      >
        {/* Top accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-600 shadow-[0_4px_20px_rgba(16,185,129,0.4)]" />

        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="flex justify-center mb-10"
        >
          <div className="h-24 w-24 bg-black rounded-2xl flex flex-col items-center justify-center border-4 border-emerald-900 shadow-[8px_8px_0px_0px_rgba(16,185,129,0.1)] relative group">
            <div className="absolute -top-3 -right-3 bg-emerald-600 text-black p-1.5 rounded-lg border-2 border-black rotate-12 group-hover:rotate-0 transition-transform">
              <Check size={14} strokeWidth={4} />
            </div>
            <span className="text-[10px] font-mono font-black text-emerald-900 uppercase tracking-[0.2em] mb-1">HONESTY</span>
            <span className="text-4xl font-mono font-black text-emerald-500 leading-none">{identity.honestyScore}</span>
          </div>
        </motion.div>

        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="mb-10"
        >
          <h1 className="text-2xl font-mono font-black text-zinc-100 mb-3 tracking-tighter uppercase italic leading-none">
            _SISTEMA_DE_MÁSCARAS
          </h1>
          <div className="h-1 w-12 bg-emerald-600 mx-auto" />
          <p className="text-[11px] text-zinc-600 mt-5 max-w-xs mx-auto leading-relaxed font-mono font-black uppercase tracking-[0.2em]">
            Protocolo de anonimato <br/>
            gerado em <span className="text-emerald-500 font-black px-1.5 py-0.5 bg-emerald-950/30 border-2 border-emerald-900 rounded-lg">48H</span>
          </p>
        </motion.div>

        <div className="bg-black border-4 border-zinc-900 rounded-3xl p-8 sm:p-10 mb-10 relative group shadow-inner">
          <div className="absolute -top-3 left-6 px-3 py-1 bg-black border-2 border-zinc-900 rounded-lg text-[9px] font-mono font-black text-zinc-700 uppercase tracking-[0.3em]">
            Pseudônimo_Atribuído
          </div>
          
          <div className="text-3xl font-black text-zinc-100 font-mono tracking-tighter break-all uppercase italic py-4 overflow-hidden">
            {displayText || 'GENERATING...'}
          </div>

          <AnimatePresence>
            {isRevealed && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="mt-8 flex items-center justify-center gap-3 text-[10px] font-mono font-black text-emerald-500 bg-black py-3 px-6 rounded-2xl border-4 border-emerald-900 uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_rgba(16,185,129,0.1)]"
              >
                <Shield size={16} strokeWidth={3} className="text-emerald-500" />
                <span>ANONIMATO_ESTABILIZADO</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onAcceptMask}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono font-black py-5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-4 group relative overflow-hidden uppercase tracking-[0.3em] text-[12px] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-4 border-emerald-400"
        >
          <Sparkles size={18} strokeWidth={3} className="group-hover:rotate-12 transition-transform" />
          ESTABELECER_MÁSCARA
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 1.2 }}
        className="mt-12 flex flex-col items-center gap-4"
      >
        <div className="flex items-center gap-4 text-[9px] font-mono font-black text-zinc-800 uppercase tracking-[0.5em]">
          <span>LEVEL 4</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <span>ENCRYPTED_ID</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <span>TEMPORARY</span>
        </div>
        <p className="text-[10px] text-zinc-700 font-mono font-black uppercase tracking-widest max-w-[280px] text-center leading-relaxed italic">
          O uso indevido da máscara resultará em <br/>revogação imediata do acesso.
        </p>
      </motion.div>
    </div>
  );
}
