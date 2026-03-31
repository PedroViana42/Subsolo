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
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-4 selection:bg-violet-500/30 overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: 'circOut' }}
        className="w-full max-w-lg glass-card rounded-[3rem] p-12 relative overflow-hidden shadow-2xl text-center"
      >
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

        <motion.img
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          src={logo}
          alt="Subsolo"
          className="h-14 mb-8 mx-auto drop-shadow-[0_0_15px_rgba(139,92,246,0.2)]"
        />

        {status === 'loading' && (
          <div className="flex flex-col items-center gap-4">
            <Loader size={40} className="text-violet-400 animate-spin" />
            <p className="text-zinc-400 font-medium">Verificando seu e-mail...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-violet-500/10 flex items-center justify-center border border-violet-500/20">
              <CheckCircle size={32} className="text-violet-400" />
            </div>
            <h2 className="text-2xl font-black text-zinc-100">E-mail confirmado!</h2>
            <p className="text-zinc-500 text-sm">Sua conta está ativa. Faça login para entrar no Subsolo.</p>
            <button
              onClick={onSuccess}
              className="mt-4 w-full bg-violet-600 hover:bg-violet-500 text-white font-black py-4 rounded-2xl transition-all uppercase tracking-[0.2em] text-xs"
            >
              Fazer Login
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
              <XCircle size={32} className="text-rose-400" />
            </div>
            <h2 className="text-2xl font-black text-zinc-100">Link inválido</h2>
            <p className="text-zinc-500 text-sm">{message || 'Este link expirou ou já foi utilizado.'}</p>
            <button
              onClick={onSuccess}
              className="mt-4 w-full border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-zinc-200 font-black py-4 rounded-2xl transition-all uppercase tracking-[0.2em] text-xs"
            >
              Voltar ao Login
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
