import React, { useState } from 'react';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import logo from '../assets/logo.png';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email.endsWith('@instituicao.edu.br')) {
      setError('Apenas e-mails institucionais são permitidos.');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#000000] flex flex-col items-center justify-center p-4 selection:bg-violet-500/30">
      <div className="w-full max-w-md bg-[#121212] rounded-2xl border border-zinc-800/50 p-8 shadow-2xl relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-violet-600/20 blur-[50px] rounded-full pointer-events-none" />

        <div className="flex flex-col items-center mb-8 relative z-10">
          <img src={logo} alt="Subsolo" className="h-16 mb-4" />
          <h1 className="text-2xl font-bold text-zinc-100">Bem-vindo ao Subsolo.</h1>
          <p className="text-sm text-zinc-500 mt-2 text-center">
            A rede social restrita. Faça login com seu e-mail institucional para acessar.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 relative z-10">
          {error && (
            <div className="bg-rose-900/20 border border-rose-900/50 text-rose-400 p-3 rounded-xl text-sm flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider pl-1">E-mail Institucional</label>
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
            <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider pl-1">Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all font-mono text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full bg-violet-600 hover:bg-violet-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white font-bold py-3.5 rounded-xl transition-all active:scale-95 disabled:active:scale-100 flex items-center justify-center gap-2 mt-6"
          >
            {isLoading ? (
              <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            ) : (
              'Entrar no Submundo'
            )}
          </button>
        </form>
      </div>

      <p className="text-xs text-zinc-600 mt-8 text-center max-w-sm">
        O Subsolo é uma plataforma de anonimato controlado.
        Seus dados reais são protegidos e nunca expostos publicamente.
      </p>
    </div>
  );
}
