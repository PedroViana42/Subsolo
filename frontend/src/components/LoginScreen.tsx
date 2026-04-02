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
    <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center p-4 selection:bg-violet-500/30 overflow-hidden relative">
      {/* Dynamic Background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "circOut" }}
        className="w-full max-w-md brute-card rounded-2xl p-8 sm:p-10 relative overflow-hidden shadow-2xl"
      >
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-violet-600" />

        {/* Header */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          {mode === 'register' ? (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="self-start flex items-center gap-2 text-zinc-500 hover:text-zinc-300 text-[10px] mb-6 transition-all font-mono font-black uppercase tracking-widest bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded group"
            >
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              VOLTAR
            </button>
          ) : (
            <motion.img 
              initial={{ y: -5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              src={logo} 
              alt="Subsolo" 
              className="h-14 mb-4 drop-shadow-[0_0_10px_rgba(139,92,246,0.3)]" 
            />
          )}

          <h1 className="text-2xl font-mono font-black text-zinc-100 tracking-tighter uppercase italic">
            {mode === 'login' ? '_Acessar_Subsolo' : '_Forjar_Identidade'}
          </h1>
          <p className="text-[13px] text-zinc-600 mt-2 text-center leading-relaxed font-mono font-bold max-w-sm uppercase tracking-tighter">
            {mode === 'login'
              ? '> rede social restrita / acesso nível 1'
              : '> criação de credenciais temporárias (48h)'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-rose-950/40 border-2 border-rose-900 text-rose-500 p-4 rounded-xl text-[11px] shadow-lg font-mono"
            >
              <div className="flex items-start gap-3">
                <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span className="font-bold leading-relaxed">{error}</span>
              </div>
              {showResend && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="mt-3 w-full text-center text-[10px] font-mono font-black uppercase tracking-widest text-rose-400 hover:text-white bg-rose-900/40 border border-rose-800 py-2 rounded-lg transition-all"
                >
                  {resendLoading ? 'TRANSMITINDO...' : 'REENVIAR VERIFICAÇÃO'}
                </button>
              )}
            </motion.div>
          )}

          {successMsg && (
            <motion.div 
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-950/40 border-2 border-emerald-900 text-emerald-500 p-4 rounded-xl text-[11px] font-mono font-bold shadow-lg"
            >
              [OK] {successMsg}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-zinc-600 uppercase tracking-widest pl-1">
              E-mail_Address
            </label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-violet-500 transition-all" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="USER@DOMAIN.COM"
                className="w-full brute-input rounded-xl py-4 pl-12 pr-4 text-zinc-100 placeholder-zinc-800 transition-all font-mono text-[14px]"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-mono font-black text-zinc-600 uppercase tracking-widest pl-1 flex justify-between">
              Secret_Key
              {mode === 'register' && (
                <span className="text-zinc-800 normal-case font-bold tracking-tight text-[9px] uppercase">mín_8_chars</span>
              )}
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-violet-500 transition-all" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                minLength={mode === 'register' ? 8 : undefined}
                className="w-full brute-input rounded-xl py-4 pl-12 pr-12 text-zinc-100 placeholder-zinc-800 transition-all font-mono text-[14px]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-zinc-500 transition-colors pt-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-2 overflow-hidden"
            >
              <label className="text-[10px] font-mono font-black text-zinc-600 uppercase tracking-widest pl-1">
                Confirm_Secret_Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 group-focus-within:text-violet-500 transition-all" size={18} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="********"
                  className="w-full brute-input rounded-xl py-4 pl-12 pr-12 text-zinc-100 placeholder-zinc-800 transition-all font-mono text-[14px]"
                  required={mode === 'register'}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 hover:text-zinc-500 transition-colors pt-1"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-violet-700 hover:bg-violet-600 disabled:bg-zinc-950 disabled:text-zinc-800 text-white font-mono font-black py-4 rounded-xl transition-all active:translate-x-[2px] active:translate-y-[2px] disabled:active:translate-x-0 disabled:active:translate-y-0 flex items-center justify-center gap-3 mt-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest text-[11px] border-2 border-violet-500 disabled:border-zinc-900"
          >
            <span className="relative z-10 flex items-center gap-3">
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? (
                'ESTABELECER_CONEXÃO'
              ) : (
                'CRIPTOGRAFAR_IDENTIDADE'
              )}
            </span>
          </button>

          {/* Switch mode */}
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-2 text-center"
            >
              <p className="text-[11px] font-mono font-bold text-zinc-600 uppercase tracking-tighter">
                {mode === 'login' ? 'SEM_CREDENCIAIS? ' : 'POSSUI_ACESSO? '}
                <button
                  type="button"
                  onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
                  className="text-violet-500 hover:text-violet-400 font-black transition-colors"
                >
                  {mode === 'login' ? '[CRIAR_CONTA]' : '[FAZER_LOGIN]'}
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
