import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowLeft } from 'lucide-react';
import logo from '../assets/logo.png';
import { login, register } from '../services/auth';
import type { NickData } from '../services/auth';

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

  const switchMode = (next: Mode) => {
    setMode(next);
    setError('');
    setSuccessMsg('');
    setPassword('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (mode === 'register') {
        await register(email, password);
        setMode('login');
        setPassword('');
        setError('');
        setSuccessMsg('Conta criada com sucesso! Faça login para entrar.');
      } else {
        const { token, nick } = await login(email, password);
        onLoginSuccess(token, nick);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 selection:bg-violet-500/30">
      <div className="w-full max-w-md bg-[#121212] rounded-2xl border border-zinc-800/50 p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-violet-600/20 blur-[50px] rounded-full pointer-events-none" />

        {/* Header */}
        <div className="flex flex-col items-center mb-8 relative z-10">
          {mode === 'register' ? (
            <button
              type="button"
              onClick={() => switchMode('login')}
              className="self-start flex items-center gap-1.5 text-zinc-500 hover:text-zinc-300 text-sm mb-6 transition-colors"
            >
              <ArrowLeft size={15} />
              Voltar
            </button>
          ) : (
            <img src={logo} alt="Subsolo" className="h-16 mb-4" />
          )}

          <h1 className="text-2xl font-bold text-zinc-100">
            {mode === 'login' ? 'Bem-vindo ao Subsolo.' : 'Criar Conta'}
          </h1>
          <p className="text-sm text-zinc-500 mt-2 text-center">
            {mode === 'login'
              ? 'A rede social restrita. Faça login com seu e-mail institucional para acessar.'
              : 'Crie sua conta para receber uma identidade temporária de 48h.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {error && (
            <div className="bg-rose-900/20 border border-rose-900/50 text-rose-400 p-3 rounded-xl text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-900/20 border border-emerald-900/50 text-emerald-400 p-3 rounded-xl text-sm">
              ✓ {successMsg}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider pl-1">
              E-mail Institucional
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nome@instituicao.edu.br"
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-mono text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider pl-1">
              Senha{' '}
              {mode === 'register' && (
                <span className="text-zinc-600 normal-case font-normal">(mín. 8 caracteres)</span>
              )}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                minLength={mode === 'register' ? 8 : undefined}
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-mono text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : mode === 'login' ? (
              'Entrar no Submundo'
            ) : (
              'Criar Minha Conta'
            )}
          </button>

          {/* Switch mode */}
          {mode === 'login' && (
            <p className="text-center text-sm text-zinc-500 pt-2">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
              >
                Criar conta
              </button>
            </p>
          )}
        </form>
      </div>

      <p className="text-xs text-zinc-600 mt-8 text-center max-w-sm">
        O Subsolo é uma plataforma de anonimato controlado.
        Seus dados reais são protegidos e nunca expostos publicamente.
      </p>
    </div>
  );
}
