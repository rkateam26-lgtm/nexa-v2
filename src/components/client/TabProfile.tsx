import React from 'react';
import { ClientProfile, ActivityTransaction } from '@/types/client';

interface TabProfileProps {
  client: ClientProfile;
  activities: ActivityTransaction[];
}

export const TabProfile: React.FC<TabProfileProps> = ({ client, activities }) => {
  return (
    <div className="space-y-5 pb-24 animate-fadeIn">
      {/* Profile Card */}
      <div className="rounded-2xl bg-slate-900 p-5 border border-slate-800 text-center relative overflow-hidden">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 mx-auto flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-red-500/20 mb-3">
          👤
        </div>
        <h2 className="text-lg font-extrabold text-white">{client.name}</h2>
        <p className="text-xs text-amber-400 font-semibold mt-0.5">
          💬 WhatsApp : {client.whatsappNumber}
        </p>

        {/* Points Summary Badge */}
        <div className="mt-4 inline-flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
          <div className="text-left">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Solde Actuel</span>
            <span className="text-base font-black text-white">{client.points} Points</span>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="text-left">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Statut Client</span>
            <span className="text-xs font-bold text-amber-400">{client.statusBadge}</span>
          </div>
        </div>
      </div>

      {/* Activity History */}
      <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800">
        <h3 className="font-extrabold text-sm text-white mb-3 flex items-center gap-2">
          <span>📜</span> Historique des activités
        </h3>
        <div className="space-y-2.5">
          {activities.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-lg">{act.type === 'scan' ? '📲' : '🎁'}</span>
                <div>
                  <div className="font-bold text-slate-200">{act.title}</div>
                  <div className="text-[10px] text-slate-400">{act.date}</div>
                </div>
              </div>
              <span
                className={`font-mono font-extrabold text-xs px-2 py-0.5 rounded ${
                  act.points > 0
                    ? 'text-emerald-400 bg-emerald-500/10'
                    : 'text-red-400 bg-red-500/10'
                }`}
              >
                {act.points > 0 ? `+${act.points}` : act.points} pts
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Help & Support Section */}
      <div className="rounded-2xl bg-slate-900 p-4 border border-slate-800">
        <h3 className="font-extrabold text-sm text-white mb-3 flex items-center gap-2">
          <span>❓</span> Aide & Support Nexa
        </h3>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 text-xs text-left text-slate-200 transition-colors">
            <span className="flex items-center gap-2">💬 Contacter l'assistance WhatsApp</span>
            <span className="text-slate-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 text-xs text-left text-slate-200 transition-colors">
            <span className="flex items-center gap-2">📖 Comment accumuler des points ?</span>
            <span className="text-slate-400">→</span>
          </button>
          <button className="w-full flex items-center justify-between p-3 rounded-xl bg-slate-950/80 hover:bg-slate-950 border border-slate-800 text-xs text-left text-slate-200 transition-colors">
            <span className="flex items-center gap-2">🔒 Politique de confidentialité Nexa</span>
            <span className="text-slate-400">→</span>
          </button>
        </div>
      </div>
    </div>
  );
};
