import React, { useState } from 'react';
import { RestaurantInfo } from '@/types/client';

interface OnboardingModalProps {
  isOpen: boolean;
  restaurant: RestaurantInfo;
  onSubmit: (name: string, whatsappNumber: string) => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  restaurant,
  onSubmit,
}) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !whatsapp.trim()) return;

    setLoading(true);
    await onSubmit(name.trim(), whatsapp.trim());
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-lg p-4 animate-fadeIn">
      <div className="w-full max-w-sm rounded-3xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-red-600/10 rounded-full blur-xl pointer-events-none" />

        {/* Restaurant Entry Screen Header */}
        <div className="text-center mb-6">
          {/* Logo Nexa */}
          <div className="inline-flex items-center gap-1.5 mb-3 bg-slate-950 px-3 py-1.5 rounded-full border border-slate-800">
            <div className="w-5 h-5 rounded-md bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center text-white text-xs font-extrabold">
              N
            </div>
            <span className="font-extrabold text-xs tracking-wider text-white">NEXA</span>
          </div>

          {/* Restaurant Logo & Welcome */}
          <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-3xl mx-auto mb-2 shadow-inner">
            {restaurant.logoUrl || '🍗'}
          </div>
          <h2 className="text-xl font-extrabold text-white">{restaurant.name}</h2>
          <p className="text-xs text-amber-400 font-medium mt-0.5">
            {restaurant.welcomeMessage}
          </p>
        </div>

        {/* Profile Creation Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Votre Nom complet
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Alexandre Dupont"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>

          <div className="text-left">
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Numéro WhatsApp
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Ex: +33 6 12 34 56 78"
              className="w-full rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:border-red-500 focus:outline-none transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 font-bold text-white shadow-lg shadow-red-600/30 text-sm hover:from-red-500 hover:to-red-600 active:scale-[0.98] transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Enregistrement dans Supabase...' : '✨ Découvrir mon Espace Fidélité'}
          </button>
        </form>

        <p className="text-[10px] text-slate-500 text-center mt-4">
          Vos informations sont conservées en toute sécurité avec Nexa.
        </p>
      </div>
    </div>
  );
};
