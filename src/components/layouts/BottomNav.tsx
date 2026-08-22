import React from 'react';

export type TabType = 'home' | 'rewards' | 'notifications' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadNotifsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  unreadNotifsCount = 3,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Accueil', icon: '🏠' },
    { id: 'rewards' as TabType, label: 'Récompenses', icon: '🎁' },
    { id: 'notifications' as TabType, label: 'Notifications', icon: '🔔', badge: unreadNotifsCount },
    { id: 'profile' as TabType, label: 'Profil', icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800 py-2 px-4 shadow-lg">
      <div className="max-w-md mx-auto grid grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-red-600/15 text-red-500 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200 font-medium'
              }`}
            >
              <span className="text-xl leading-none mb-1">{tab.icon}</span>
              <span className="text-[11px] leading-none tracking-tight">{tab.label}</span>

              {/* Notification badge */}
              {tab.badge && tab.badge > 0 && tab.id === 'notifications' && (
                <span className="absolute top-1 right-3 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[9px] font-bold text-white shadow-sm">
                  {tab.badge}
                </span>
              )}

              {/* Active Tab bar indicator */}
              {isActive && (
                <span className="absolute -bottom-1 h-1 w-6 rounded-full bg-red-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
