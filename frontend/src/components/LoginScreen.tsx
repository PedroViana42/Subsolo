import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.png';
import { login, register, resendVerification } from '../services/auth';
import type { NickData } from '../services/auth';
import { motion, AnimatePresence } from 'framer-motion';

type Mode = 'login' | 'register';

interface LoginScreenProps {
  onLoginSuccess: (token: string, nick: NickData) => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showResend, setShowResend] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setSuccessMsg('');
    setPassword('');
    setShowResend(false);
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await resendVerification(email);
      setShowResend(false);
      setError('');
      setSuccessMsg('Novo link enviado! Verifique sua caixa de entrada.');
    } catch {
      setSuccessMsg('Novo link enviado! Verifique sua caixa de entrada.');
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (mode === 'register') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError('Insira um e-mail válido.');
        return;
      }
      if (password.length < 8) {
        setError('A senha deve ter no mínimo 8 caracteres.');
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setError('A senha deve conter pelo menos uma letra maiúscula.');
        return;
      }
      if (!/[0-9]/.test(password)) {
        setError('A senha deve conter pelo menos um número.');
        return;
      }
    }

    setIsLoading(true);

    try {
      if (mode === 'register') {
        await register(email, password);
        setMode('login');
        setPassword('');
        setError('');
        setSuccessMsg('Conta criada! Enviamos um link de verificação para o seu e-mail. Confirme antes de fazer login.');
      } else {
        const { token, nick } = await login(email, password);
        onLoginSuccess(token, nick);
      }
    } catch (err: any) {
      setError(err.message);
      if (err.message?.includes('não verificado')) {
        setShowResend(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-4 selection:bg-violet-500/30 overflow-hidden relative">
      {/* Dynamic Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "circOut" }}
        className="w-full max-w-lg glass-card rounded-[3rem] p-12 relative overflow-hidden shadow-2xl"
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

        {/* Header */}
        <div className="flex flex-col items-center mb-10 relative z-10">
          {mode === 'register' ? (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="self-start flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-xs mb-8 transition-all font-black uppercase tracking-widest bg-white/5 px-4 py-2 rounded-xl group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Voltar
            </button>
          ) : (
            <motion.img 
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              src={logo} 
              alt="Subsolo" 
              className="h-20 mb-6 drop-shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
            />
          )}

          <h1 className="text-3xl font-black text-zinc-100 tracking-tight">
            {mode === 'login' ? 'Bem-vindo ao Subsolo.' : 'Criar Conta'}
          </h1>
          <p className="text-[15px] text-zinc-500 mt-4 text-center leading-relaxed font-medium max-w-sm">
            {mode === 'login'
              ? 'A rede social restrita. Faça login com seu e-mail para acessar o submundo.'
              : 'Crie sua conta para receber uma identidade temporária e forjada de 48h.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-5 rounded-2xl text-[13px] shadow-lg"
            >
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="mt-0.5 flex-shrink-0" />
                <span className="font-medium leading-relaxed">{error}</span>
              </div>
              {showResend && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="mt-3 w-full text-center text-[12px] font-black uppercase tracking-widest text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 py-2.5 rounded-xl transition-all disabled:opacity-50"
                >
                  {resendLoading ? 'Enviando...' : 'Reenviar e-mail de verificação'}
                </button>
              )}
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-5 rounded-2xl text-[13px] font-bold shadow-lg"
            >
              ✓ {successMsg}
            </motion.div>
          )}

          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] pl-2">
              E-mail
            </label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-all duration-300" size={20} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="w-full glass-input rounded-2xl py-5 pl-14 pr-6 text-zinc-100 placeholder-zinc-700 transition-all font-sans text-[15px] focus:ring-2 focus:ring-violet-500/20"
                required
              />
            </div>
          </div>

          <div className="space-y-2.5">
            <label className="text-[11px] font-black text-zinc-500 uppercase tracking-[0.2em] pl-2 flex justify-between">
              Senha
              {mode === 'register' && (
                <span className="text-zinc-700 normal-case font-bold tracking-tight text-[10px]">mín. 8 caracteres</span>
              )}
            </label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-violet-400 transition-all duration-300" size={20} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={mode === 'register' ? 8 : undefined}
                className="w-full glass-input rounded-2xl py-5 pl-14 pr-6 text-zinc-100 placeholder-zinc-700 transition-all font-sans text-[15px] focus:ring-2 focus:ring-violet-500/20"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-900 disabled:text-zinc-700 text-white font-black py-5 rounded-[1.5rem] transition-all active:scale-[0.98] disabled:active:scale-100 flex items-center justify-center gap-3 mt-8 shadow-2xl group overflow-hidden relative uppercase tracking-[0.2em] text-xs"
          >
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 pointer-events-none" />
            <span className="relative z-10 flex items-center gap-3">
              {isLoading ? (
                <div className="w-5 h-5 border-3 border-white/20 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? (
                'Acessar Submundo'
              ) : (
                'Forjar Minha Máscara'
              )}
            </span>
          </button>

          {/* Switch mode */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="pt-2 text-center"
            >
              <p className="text-sm text-zinc-500">
                {mode === 'login' ? 'Não tem uma conta? ' : 'Já possui uma conta? '}
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  className="text-violet-400 hover:text-violet-300 font-semibold transition-colors decoration-violet-400/30 underline-offset-4 hover:underline"
                >
                  {mode === 'login' ? 'Criar conta' : 'Fazer login'}
                </button>
              </p>
            </motion.div>
          </AnimatePresence>
        </form>
      </motion.div>

      <p className="text-xs text-zinc-600 mt-8 text-center max-w-sm">
        O Subsolo é uma plataforma de anonimato controlado.
        Seus dados reais são protegidos e nunca expostos publicamente.
      </p>
    </div>
  );
}
