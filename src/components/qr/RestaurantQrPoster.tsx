import React from 'react';
import { RestaurantInfo } from '@/types/client';
import { buildRestaurantUrl, generateQrSvgDataUrl } from '@/lib/qr/qrGenerator';

interface RestaurantQrPosterProps {
  isOpen: boolean;
  restaurant: RestaurantInfo;
  onClose: () => void;
}

export const RestaurantQrPoster: React.FC<RestaurantQrPosterProps> = ({
  isOpen,
  restaurant,
  onClose,
}) => {
  if (!isOpen) return null;

  const targetUrl = buildRestaurantUrl(restaurant.id);
  const qrSvgUrl = generateQrSvgDataUrl(targetUrl);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn">
      <div className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800 w-8 h-8 flex items-center justify-center text-sm print:hidden"
        >
          ✕
        </button>

        {/* Printable Poster Container */}
        <div id="printable-poster" className="bg-white text-slate-900 rounded-2xl p-6 shadow-inner border border-slate-200 my-2">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-1">
            <div className="w-6 h-6 rounded bg-red-600 text-white font-extrabold text-xs flex items-center justify-center">
              N
            </div>
            <span className="font-extrabold text-sm tracking-wider text-slate-900">NEXA</span>
          </div>

          <h2 className="text-2xl font-black uppercase tracking-tight text-red-600 mt-2">
            {restaurant.name}
          </h2>
          <p className="text-xs font-semibold text-slate-600 mb-4">
            Scannez pour cumuler vos points & débloquer vos cadeaux !
          </p>

          {/* QR Code SVG Image */}
          <div className="inline-block p-3 bg-slate-50 border-2 border-slate-900 rounded-2xl shadow-sm mb-4">
            <img src={qrSvgUrl} alt={`QR Code ${restaurant.name}`} className="w-48 h-48 mx-auto" />
          </div>

          {/* Value Proposition */}
          <div className="bg-red-50 border border-red-200 text-red-700 font-extrabold text-xs py-2 px-3 rounded-xl uppercase tracking-wide mb-3">
            1 SCAN = +20 POINTS DE FIDÉLITÉ
          </div>

          <p className="text-[10px] text-slate-400 font-mono break-all">
            {targetUrl}
          </p>
        </div>

        {/* Action Buttons (Hidden on print) */}
        <div className="flex gap-3 mt-4 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 font-bold text-white shadow-lg text-xs hover:from-red-500 hover:to-red-600 active:scale-[0.98] transition-all"
          >
            🖨️ Imprimer l'Affiche
          </button>
          <a
            href={qrSvgUrl}
            download={`nexa-qr-${restaurant.name.toLowerCase().replace(/\s+/g, '-')}.svg`}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold text-white text-xs transition-all flex items-center justify-center gap-1 border border-slate-700"
          >
            ⬇️ Télécharger SVG
          </a>
        </div>
      </div>
    </div>
  );
};
