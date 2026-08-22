import React from 'react';
import { RewardItem } from '@/types/client';

interface TabRewardsProps {
  userPoints: number;
  rewards: RewardItem[];
}

export const TabRewards: React.FC<TabRewardsProps> = ({ userPoints, rewards }) => {
  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Tab Header Banner */}
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white">🎁 Catalogue Récompenses</h2>
          <p className="text-xs text-slate-400">Échangez vos points cumulés contre des cadeaux</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block font-medium">Votre solde</span>
          <span className="text-lg font-black text-amber-400">{userPoints} pts</span>
        </div>
      </div>

      {/* Rewards List */}
      <div className="space-y-3">
        {rewards.map((reward) => {
          const isUnlocked = userPoints >= reward.pointsCost;

          return (
            <div
              key={reward.id}
              className={`relative overflow-hidden rounded-2xl p-4 border transition-all duration-200 ${
                isUnlocked
                  ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/50 border-slate-800/80 opacity-80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Icon Container */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                      isUnlocked
                        ? 'bg-amber-500/15 border-amber-500/30'
                        : 'bg-slate-800/60 border-slate-700/50'
                    }`}
                  >
                    {reward.icon}
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                        {reward.category}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white mt-1">{reward.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                      {reward.description}
                    </p>
                  </div>
                </div>

                {/* Status & Point badge */}
                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 inline-block">
                    {reward.pointsCost} PTS
                  </div>
                  <div className="mt-2">
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/30">
                        ✓ Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                        🔒 Verrouillé
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
