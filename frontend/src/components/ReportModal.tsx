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
        className="absolute inset-0 bg-black/90 backdrop-blur-sm" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="w-full max-w-md brute-card rounded-3xl relative z-10 overflow-hidden bg-[#050505] border-4 border-zinc-900 shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] animate-in fade-in zoom-in-95 duration-200">
        
        {/* Glow accent */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-rose-600 shadow-[0_4px_20px_rgba(225,29,72,0.4)]" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-4 border-zinc-900 bg-black">
          <div className="flex items-center gap-3 text-rose-500">
            <AlertTriangle size={20} strokeWidth={3} />
            <h2 className="font-mono font-black text-[11px] uppercase tracking-[0.2em] italic leading-none">REPORT_PROTOCOL</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-600 hover:text-white p-2 rounded-xl border-2 border-transparent hover:border-zinc-800 transition-all active:scale-90"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-6 space-y-2">
            <label className="text-[9px] font-mono font-black text-rose-900 uppercase tracking-[0.4em] pl-1">
              Analysis_Required
            </label>
            <p className="text-[10px] text-zinc-600 font-mono font-black uppercase tracking-widest leading-relaxed">
              Descreva a violação detectada para o conselho moderador.
            </p>
          </div>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="EX: DISCURSO_DE_ODIO, SPAM, EXPOSICAO_DADOS..."
            className="w-full brute-input rounded-2xl p-5 text-[12px] text-zinc-100 placeholder-zinc-900 focus:outline-none transition-all font-mono border-4 border-zinc-900/50 focus:border-rose-600 focus:shadow-[4px_4px_0px_0px_rgba(225,29,72,0.1)] bg-black resize-none"
            rows={4}
            required
            autoFocus
          />

          <div className="mt-8 flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-black text-zinc-600 hover:text-white font-mono font-black py-4 rounded-xl transition-all border-2 border-zinc-900 uppercase tracking-[0.2em] text-[10px]"
            >
              CANCELAR
            </button>
            <button
              type="submit"
              disabled={!reason.trim() || isSubmitting}
              className="flex-[2] bg-rose-700 hover:bg-rose-600 disabled:opacity-30 text-white font-mono font-black py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-[10px] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] border-4 border-rose-500"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-4 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Send size={16} strokeWidth={3} />
              )}
              ENVIAR_PROTOCOLO
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
