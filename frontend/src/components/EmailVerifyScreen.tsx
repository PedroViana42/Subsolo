import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import logo from '../assets/logo.png';
import { motion } from 'framer-motion';
import { verifyEmail } from '../services/auth';

interface EmailVerifyScreenProps {
  token: string;
  onSuccess: () => void;
}

type Status = 'loading' | 'success' | 'error';

export function EmailVerifyScreen({ token, onSuccess }: EmailVerifyScreenProps) {
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    verifyEmail(token)
      .then(() => {
        setStatus('success');
        window.history.replaceState({}, '', '/');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message);
        window.history.replaceState({}, '', '/');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 selection:bg-violet-500/30 overflow-hidden relative font-mono">
      {/* Neo-Brutalist Background Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/5 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'circOut' }}
        className="w-full max-w-lg brute-card rounded-3xl p-12 relative overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] border-4 border-zinc-900 bg-[#050505] text-center"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-violet-600 shadow-[0_4px_20px_rgba(124,58,237,0.4)]" />

        <motion.img
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          src={logo}
          alt="Subsolo"
          className="h-12 mb-10 mx-auto opacity-80 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        />

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-6 py-10">
            <div className="relative">
              <div className="w-16 h-16 border-8 border-zinc-900 border-t-violet-600 rounded-full animate-spin shadow-[0_0_20px_rgba(124,58,237,0.2)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader size={20} className="text-zinc-600" />
              </div>
            </div>
            <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">Verificando_Protocolo_ID...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center border-4 border-emerald-900 shadow-[8px_8px_0px_0px_rgba(16,185,129,0.1)] relative">
               <div className="absolute -top-3 -right-3 bg-emerald-600 text-black p-1.5 rounded-lg border-2 border-black rotate-12">
                <CheckCircle size={16} strokeWidth={4} />
              </div>
              <CheckCircle size={40} strokeWidth={3} className="text-emerald-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-zinc-100 uppercase italic tracking-tighter mb-2">ACESSO_LIBERADO</h2>
              <div className="h-1 w-12 bg-emerald-600 mx-auto mb-4" />
              <p className="text-zinc-600 text-[11px] font-black uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                E-mail confirmado com sucesso. <br/>Suas credenciais foram autenticadas.
              </p>
            </div>
            <button
              onClick={onSuccess}
              className="mt-6 w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-5 rounded-2xl transition-all active:scale-95 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase tracking-[0.3em] text-[11px] border-4 border-violet-400"
            >
              ESTABELECER_CONEXÃO_{'>'}
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-black flex items-center justify-center border-4 border-rose-900 shadow-[8px_8px_0px_0px_rgba(244,63,94,0.1)] relative">
              <div className="absolute -top-3 -right-3 bg-rose-600 text-white p-1.5 rounded-lg border-2 border-black -rotate-12">
                <XCircle size={16} strokeWidth={4} />
              </div>
              <XCircle size={40} strokeWidth={3} className="text-rose-500" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-zinc-100 uppercase italic tracking-tighter mb-2">ERRO_DE_PROTOCOLO</h2>
              <div className="h-1 w-12 bg-rose-600 mx-auto mb-4" />
              <p className="text-zinc-600 text-[11px] font-black uppercase tracking-widest max-w-xs mx-auto leading-relaxed">
                {message || 'O link de verificação expirou ou é inválido para este terminal.'}
              </p>
            </div>
            <button
              onClick={onSuccess}
              className="mt-6 w-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white font-black py-5 rounded-2xl transition-all active:scale-95 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase tracking-[0.3em] text-[11px] border-4 border-zinc-800"
            >
              VOLTAR_AO_LOGIN
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
