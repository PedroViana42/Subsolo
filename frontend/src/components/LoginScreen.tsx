import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowLeft, Eye, EyeOff } from 'lucide-react';
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
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
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
      if (password !== confirmPassword) {
        setError('As senhas não coincidem. Verifique a confirmação.');
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
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 selection:bg-violet-500/30 overflow-hidden relative">
      {/* Neo-Brutalist Background Elements */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-violet-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-violet-600/5 blur-[150px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md brute-card rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] border-4 border-zinc-900 bg-[#050505]"
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-full h-2 bg-violet-600 shadow-[0_4px_20px_rgba(124,58,237,0.4)]" />

        {/* Header */}
        <div className="flex flex-col items-center mb-10 relative z-10">
          <AnimatePresence mode="wait">
            {mode === 'register' ? (
              <motion.button
                key="back"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                type="button"
                onClick={() => switchMode('login')}
                className="self-start flex items-center gap-2 text-zinc-500 hover:text-white text-[9px] mb-8 transition-all font-mono font-black uppercase tracking-[0.3em] bg-black border-2 border-zinc-900 px-4 py-2 rounded-xl group active:scale-95"
              >
                <ArrowLeft size={14} strokeWidth={3} className="group-hover:-translate-x-1 transition-transform" />
                VOLTAR
              </motion.button>
            ) : (
              <motion.div
                key="logo"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6"
              >
                <img 
                  src={logo} 
                  alt="Subsolo" 
                  className="h-12 w-auto object-contain opacity-80 drop-shadow-[0_0_15px_rgba(139,92,246,0.3)]" 
                />
              </motion.div>
            )}
          </AnimatePresence>

          <h1 className="text-3xl font-mono font-black text-zinc-100 tracking-tighter uppercase italic leading-none">
            {mode === 'login' ? 'ACESSO_RESTRITO' : 'NOVA_IDENTIDADE'}
          </h1>
          <div className="h-1 w-12 bg-violet-600 mt-4 self-center" />
          <p className="text-[11px] text-zinc-600 mt-4 text-center leading-relaxed font-mono font-black max-w-sm uppercase tracking-[0.2em]">
            {mode === 'login'
              ? 'Conexão segura via túnel criptografado'
              : 'Protocolo de anonimato nível 4'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-black border-4 border-rose-900 text-rose-500 p-5 rounded-2xl text-[11px] font-mono shadow-[8px_8px_0px_0px_rgba(244,63,94,0.1)]"
              >
                <div className="flex items-start gap-4">
                  <AlertCircle size={20} strokeWidth={3} className="flex-shrink-0" />
                  <span className="font-black leading-relaxed uppercase tracking-tight">{error}</span>
                </div>
                {showResend && (
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={resendLoading}
                    className="mt-4 w-full text-center text-[10px] font-mono font-black uppercase tracking-[0.2em] text-rose-400 hover:text-white bg-rose-900/20 border-2 border-rose-900 py-3 rounded-xl transition-all active:scale-95"
                  >
                    {resendLoading ? 'TRANSMITINDO...' : 'REENVIAR VERIFICAÇÃO'}
                  </button>
                )}
              </motion.div>
            )}

            {successMsg && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-black border-4 border-emerald-900 text-emerald-500 p-5 rounded-2xl text-[11px] font-mono font-black shadow-[8px_8px_0px_0px_rgba(16,185,129,0.1)] uppercase tracking-tight"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  [CONCLUÍDO] {successMsg}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-2">
            <label className="text-[9px] font-mono font-black text-zinc-700 uppercase tracking-[0.4em] pl-1">
              E-mail_Protocol
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-violet-500 transition-all">
                <Mail size={18} strokeWidth={3} />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="USER@DOMAIN.COM"
                className="w-full brute-input rounded-2xl py-5 pl-14 pr-4 text-zinc-100 placeholder-zinc-900 transition-all font-mono text-[13px] border-4 border-zinc-900/50 focus:border-violet-600 focus:shadow-[4px_4px_0px_0px_rgba(124,58,237,0.2)] bg-black"
                required
                autoComplete="email"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-mono font-black text-zinc-700 uppercase tracking-[0.4em] pl-1 flex justify-between">
              Secret_Key
              {mode === 'register' && (
                <span className="text-zinc-800 text-[8px]">LIMIT:MIN_8</span>
              )}
            </label>
            <div className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-violet-500 transition-all">
                <Lock size={18} strokeWidth={3} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                minLength={mode === 'register' ? 8 : undefined}
                className="w-full brute-input rounded-2xl py-5 pl-14 pr-14 text-zinc-100 placeholder-zinc-900 transition-all font-mono text-[13px] border-4 border-zinc-900/50 focus:border-violet-600 focus:shadow-[4px_4px_0px_0px_rgba(124,58,237,0.2)] bg-black"
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-zinc-500 transition-colors"
              >
                {showPassword ? <EyeOff size={18} strokeWidth={3} /> : <Eye size={18} strokeWidth={3} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2 overflow-hidden"
            >
              <label className="text-[9px] font-mono font-black text-zinc-700 uppercase tracking-[0.4em] pl-1">
                Confirm_Secret
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-800 group-focus-within:text-violet-500 transition-all">
                  <Lock size={18} strokeWidth={3} />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className="w-full brute-input rounded-2xl py-5 pl-14 pr-14 text-zinc-100 placeholder-zinc-900 transition-all font-mono text-[13px] border-4 border-zinc-900/50 focus:border-violet-600 focus:shadow-[4px_4px_0px_0px_rgba(124,58,237,0.2)] bg-black"
                  required={mode === 'register'}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-zinc-500 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} strokeWidth={3} /> : <Eye size={18} strokeWidth={3} />}
                </button>
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-violet-700 hover:bg-violet-600 disabled:opacity-30 text-white font-mono font-black py-5 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-3 mt-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] uppercase tracking-[0.3em] text-[12px] border-4 border-violet-500"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-4 border-white/20 border-t-white rounded-full animate-spin" />
            ) : mode === 'login' ? (
              'ESTABELECER_CONEXÃO_>'
            ) : (
              'CRIPTOGRAFAR_IDENTIDADE_>'
            )}
          </button>

          {/* Switch mode */}
          <div className="pt-4 text-center">
            <p className="text-[10px] font-mono font-black text-zinc-700 uppercase tracking-widest">
              {mode === 'login' ? 'SEM_ACESSO? ' : 'TEM_ACESSO? '}
              <button
                type="button"
                onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                className="text-violet-500 hover:text-white transition-colors underline underline-offset-4 decoration-2"
              >
                {mode === 'login' ? 'CRIAR_CONTA' : 'LOGIN'}
              </button>
            </p>
          </div>
        </form>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-12 flex flex-col items-center gap-4 text-center"
      >
        <div className="flex items-center gap-4 text-[9px] font-mono font-black text-zinc-800 uppercase tracking-[0.5em]">
          <span>AES-256</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <span>ZERO-KNOWLEDGE</span>
          <span className="w-1 h-1 bg-zinc-800 rounded-full" />
          <span>PORT 443</span>
        </div>
        <p className="text-[10px] text-zinc-700 font-mono font-black uppercase tracking-widest max-w-xs leading-relaxed">
          Anonimato controlado. Dados protegidos. <br/>Acesso restrito ao Subsolo.
        </p>
      </motion.div>

      <p className="text-[10px] text-zinc-800 mt-8 text-center max-w-sm font-mono font-black uppercase tracking-widest opacity-30">
        O Subsolo é uma plataforma de anonimato controlado. <br/>
        Dados reais são protegidos e nunca expostos.
      </p>
    </div>
  );
}
