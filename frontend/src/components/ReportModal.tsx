import React, { useState } from 'react';
import { AlertTriangle, X, Send } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

export function ReportModal({ isOpen, onClose, onSubmit }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setIsSubmitting(true);
    // Simulate API request delay
    setTimeout(() => {
      onSubmit(reason);
      setReason('');
      setIsSubmitting(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="bg-[#121212] border border-zinc-800/80 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/50 bg-[#0a0a0a]">
          <div className="flex items-center gap-2 text-rose-400">
            <AlertTriangle size={18} />
            <h2 className="font-bold text-sm">Denunciar Postagem</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300 p-1 rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5">
          <p className="text-sm text-zinc-400 mb-4">
            Por que você está denunciando esta postagem? Descreva o motivo para a moderação analisar.
          </p>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: Contém discurso de ódio, spam, exposição de dados reais..."
            className="w-full bg-[#0a0a0a] border border-zinc-800 rounded-xl p-3 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-rose-500/50 resize-none font-sans"
            rows={4}
            required
            autoFocus
          />

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50 rounded-xl transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isSubmitting}
              className="bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white px-5 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 disabled:active:scale-100 flex items-center gap-2 shadow-[0_0_15px_rgba(225,29,72,0.2)] disabled:shadow-none"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              ) : (
                <Send size={16} />
              )}
              Enviar Denúncia
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
