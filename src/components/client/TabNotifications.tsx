import React from 'react';
import { ProcessedNotification } from '@/lib/supabase/notificationsService';

interface TabNotificationsProps {
  notifications: ProcessedNotification[];
}

export const TabNotifications: React.FC<TabNotificationsProps> = ({ notifications }) => {
  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-extrabold text-white">🔔 Offres & Notifications</h2>
        <p className="text-xs text-slate-400">Offres promotionnelles de votre restaurant</p>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl p-4 border transition-all duration-200 ${
              item.isExpired
                ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                : item.isFlashOffer
                ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-red-500/40 shadow-md shadow-red-500/5'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <h3 className={`font-bold text-sm ${item.isExpired ? 'text-slate-400 line-through' : 'text-white'}`}>
                  {item.title}
                </h3>
              </div>

              {/* Status Badge */}
              {item.isExpired ? (
                <span className="text-[10px] font-extrabold uppercase bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full border border-slate-700">
                  🚫 Offre Expirée
                </span>
              ) : item.isFlashOffer ? (
                <span className="text-[10px] font-extrabold uppercase bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                  ⚡ Offre Flash
                </span>
              ) : (
                <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ✨ Active
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {item.message}
            </p>

            {/* Dates & Expiration Notice */}
            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80 text-slate-400">
              <span>Publié le: {item.date}</span>
              <span
                className={`font-bold px-2 py-0.5 rounded border ${
                  item.isExpired
                    ? 'text-slate-500 bg-slate-900 border-slate-800'
                    : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                }`}
              >
                {item.isExpired ? '🚫 Expirée' : `⏳ ${item.expirationDate}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
