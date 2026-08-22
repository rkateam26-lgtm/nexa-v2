import React from 'react';

interface ScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSimulateScan: () => void;
}

export const ScanModal: React.FC<ScanModalProps> = ({ isOpen, onClose, onSimulateScan }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl text-center relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/80 w-8 h-8 flex items-center justify-center text-sm"
        >
          ✕
        </button>

        <div className="my-4 inline-flex items-center justify-center w-24 h-24 rounded-2xl border-2 dashed border-red-500 bg-red-500/10 text-4xl">
          📸
        </div>

        <h3 className="text-lg font-extrabold text-white mb-1">
          Scanner un QR Code
        </h3>
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          Pointez votre appareil vers le QR code présent sur votre table ou à la caisse pour accumuler des points.
        </p>

        <button
          onClick={() => {
            onSimulateScan();
            onClose();
          }}
          className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 font-bold text-white shadow-lg shadow-red-600/30 text-sm hover:from-red-500 hover:to-red-600 active:scale-[0.98] transition-all"
        >
          ✨ Simuler un Scan (+10 Points)
        </button>
      </div>
    </div>
  );
};
