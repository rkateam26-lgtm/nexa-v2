import React from 'react';
import { NotificationOffer } from '@/types/client';

interface TabNotificationsProps {
  notifications: NotificationOffer[];
}

export const TabNotifications: React.FC<TabNotificationsProps> = ({ notifications }) => {
  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* Header */}
      <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
        <h2 className="text-lg font-extrabold text-white">🔔 Offres & Notifications</h2>
        <p className="text-xs text-slate-400">Restez informé des promotions et offres flash du restaurant</p>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {notifications.map((item) => (
          <div
            key={item.id}
            className={`rounded-2xl p-4 border transition-all duration-200 ${
              item.isFlashOffer
                ? 'bg-gradient-to-br from-slate-900 to-slate-950 border-red-500/40 shadow-md shadow-red-500/5'
                : 'bg-slate-900 border-slate-800'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{item.icon}</span>
                <h3 className="font-bold text-sm text-white">{item.title}</h3>
              </div>
              {item.isFlashOffer && (
                <span className="text-[10px] font-extrabold uppercase bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">
                  ⚡ Offre Flash
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {item.message}
            </p>

            {/* Dates & Expiration Notice */}
            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-slate-800/80 text-slate-400">
              <span>Publié le: {item.date}</span>
              <span className="font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                ⏳ {item.expirationDate}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
