
import React from 'react';

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, title, message }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 overlay-animate-show"
      onClick={onClose}
    >
      <div 
        className="bg-[#0a0a0a] border border-[#b000ff]/40 rounded-2xl p-8 max-w-sm w-full shadow-[0_0_60px_rgba(176,0,255,0.25)] text-center modal-animate-show"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-16 h-16 bg-[#b000ff]/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#b000ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">{title}</h3>
        <p className="text-gray-400 text-sm mb-8 leading-relaxed font-medium">{message}</p>
        <button 
          onClick={onClose}
          className="w-full py-4 bg-gradient-to-r from-[#6200ea] to-[#b000ff] rounded-xl text-white font-extrabold uppercase tracking-[0.2em] text-[10px] hover:brightness-110 active:scale-95 transition-all shadow-lg"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
};
