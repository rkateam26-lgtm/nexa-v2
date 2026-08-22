import React from 'react';
import { ClientProfile, RewardItem, RestaurantInfo } from '@/types/client';

interface TabHomeProps {
  client: ClientProfile;
  nextReward?: RewardItem;
  restaurant: RestaurantInfo;
  onOpenScan: () => void;
  onGoToRewards: () => void;
}

export const TabHome: React.FC<TabHomeProps> = ({
  client,
  nextReward,
  restaurant,
  onOpenScan,
  onGoToRewards,
}) => {
  const targetPoints = nextReward ? nextReward.pointsCost : 180;
  const progressPercent = Math.min(100, Math.round((client.points / targetPoints) * 100));

  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Welcome Card & Loyalty Status */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 p-6 border border-slate-800 shadow-xl">
        <div className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-red-600/10 blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Espace Client Fidélité
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Bonjour, {client.name} 👋
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/30">
            ⭐ {client.statusBadge}
          </span>
        </div>

        {/* Points Big Counter */}
        <div className="my-5 text-center py-2 bg-slate-950/50 rounded-xl border border-slate-800/80">
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-amber-200 to-amber-500">
            {client.points}
          </div>
          <div className="text-xs font-bold tracking-widest text-slate-400 uppercase mt-1">
            Points Cumulés
          </div>
        </div>

        {/* Progress Gauge to Next Reward */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-slate-300 font-medium">
            <span>Prochain objectif: <strong className="text-amber-400">{nextReward?.title || 'Burger Signature'}</strong></span>
            <span className="font-mono text-amber-400">{client.points} / {targetPoints} pts</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-800 p-0.5 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-red-500 via-amber-500 to-amber-400 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[11px] text-slate-400 text-right">
            Encore <strong className="text-white">{Math.max(0, targetPoints - client.points)} pts</strong> pour débloquer
          </p>
        </div>
      </div>

      {/* Primary Action Button: Scanner un QR code */}
      <button
        onClick={onOpenScan}
        className="w-full group relative flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-red-600 to-red-700 p-4 font-bold text-white shadow-lg shadow-red-600/30 transition-all duration-200 hover:from-red-500 hover:to-red-600 active:scale-[0.98]"
      >
        <span className="text-2xl group-hover:scale-110 transition-transform">📸</span>
        <span className="text-base">Scanner un QR Code pour gagner des points</span>
      </button>

      {/* Offre du Moment (Deal of the Day) */}
      <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-slate-900 to-slate-900 p-5 shadow-md">
        <div className="flex items-center justify-between mb-2">
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/20 px-2 py-0.5 text-[11px] font-extrabold uppercase text-amber-400 border border-amber-500/30">
            🔥 Offre du moment
          </span>
          <span className="text-[11px] text-slate-400">Restau: {restaurant.name}</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-1">
          Menu Tenders + Boisson à +20 Pts !
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {restaurant.bannerText || 'Profitez de points doublés sur chaque commande en restaurant aujourd\'hui !'}
        </p>
        <button
          onClick={onGoToRewards}
          className="inline-flex items-center gap-1 text-xs font-bold text-amber-400 hover:text-amber-300 underline underline-offset-4"
        >
          Voir toutes les récompenses disponibles →
        </button>
      </div>
    </div>
  );
};
