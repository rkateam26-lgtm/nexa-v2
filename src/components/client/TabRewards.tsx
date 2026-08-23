import React from 'react';
import { RewardItem } from '@/types/client';

interface TabRewardsProps {
  userPoints: number;
  rewards: RewardItem[];
  claimedRewardIds: string[];
  onClaimReward: (reward: RewardItem) => void;
  isLoading?: boolean;
}

export const TabRewards: React.FC<TabRewardsProps> = ({
  userPoints,
  rewards,
  claimedRewardIds,
  onClaimReward,
  isLoading = false,
}) => {
  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex items-center justify-between bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-lg font-extrabold text-white">🎁 Catalogue Récompenses</h2>
          <p className="text-xs text-slate-400">Échangez vos points contre des cadeaux</p>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 block font-medium">Votre solde</span>
          <span className="text-lg font-black text-amber-400">{userPoints} pts</span>
        </div>
      </div>

      {/* Rewards List Categorized */}
      <div className="space-y-3">
        {rewards.map((reward) => {
          const isUsed = claimedRewardIds.some(
            (id) => id === reward.id || id.toLowerCase().includes(reward.title.toLowerCase())
          );
          const hasEnoughPoints = userPoints >= reward.pointsCost;
          const isAvailable = hasEnoughPoints && !isUsed;

          return (
            <div
              key={reward.id}
              className={`relative overflow-hidden rounded-2xl p-4 border transition-all duration-200 ${
                isUsed
                  ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                  : isAvailable
                  ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-900/50 border-slate-800/80'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  {/* Icon Container */}
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 border ${
                      isUsed
                        ? 'bg-slate-800/40 border-slate-700/30 text-slate-500'
                        : isAvailable
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

                {/* Status & Action */}
                <div className="text-right shrink-0">
                  <div className="text-sm font-black text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 inline-block mb-2">
                    {reward.pointsCost} PTS
                  </div>

                  <div>
                    {isUsed ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                        ✅ Déjà Utilisée
                      </span>
                    ) : isAvailable ? (
                      <button
                        onClick={() => onClaimReward(reward)}
                        disabled={isLoading}
                        className="inline-flex items-center gap-1 text-xs font-bold text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 px-3 py-1.5 rounded-lg shadow-md shadow-red-600/20 active:scale-95 transition-all disabled:opacity-50"
                      >
                        ✨ Utiliser
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400 bg-slate-800/60 px-2 py-1 rounded-md">
                        🔒 Manque {reward.pointsCost - userPoints} pts
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
