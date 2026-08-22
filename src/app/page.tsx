'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layouts/Header';
import { BottomNav, TabType } from '@/components/layouts/BottomNav';
import { TabHome } from '@/components/client/TabHome';
import { TabRewards } from '@/components/client/TabRewards';
import { TabNotifications } from '@/components/client/TabNotifications';
import { TabProfile } from '@/components/client/TabProfile';
import { ScanModal } from '@/components/client/ScanModal';
import {
  MOCK_RESTAURANT,
  MOCK_CLIENT,
  MOCK_REWARDS,
  MOCK_NOTIFICATIONS,
  MOCK_ACTIVITIES,
} from '@/data/mockData';

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [clientProfile, setClientProfile] = useState(MOCK_CLIENT);
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);

  // Next reward target
  const nextReward = MOCK_REWARDS.find((r) => r.pointsCost > clientProfile.points) || MOCK_REWARDS[MOCK_REWARDS.length - 1];

  // Simuler un scan de points pour la démonstration
  const handleSimulateScan = () => {
    const addedPoints = 10;
    const newPoints = clientProfile.points + addedPoints;

    setClientProfile((prev) => ({
      ...prev,
      points: newPoints,
    }));

    setActivities((prev) => [
      {
        id: `act_${Date.now()}`,
        type: 'scan',
        title: 'Scan QR Code Table (Simulé)',
        points: +addedPoints,
        date: new Date().toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      },
      ...prev,
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans flex flex-col">
      {/* Restaurant Header */}
      <Header restaurant={MOCK_RESTAURANT} />

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 pt-5">
        {activeTab === 'home' && (
          <TabHome
            client={clientProfile}
            nextReward={nextReward}
            restaurant={MOCK_RESTAURANT}
            onOpenScan={() => setIsScanOpen(true)}
            onGoToRewards={() => setActiveTab('rewards')}
          />
        )}

        {activeTab === 'rewards' && (
          <TabRewards
            userPoints={clientProfile.points}
            rewards={MOCK_REWARDS}
          />
        )}

        {activeTab === 'notifications' && (
          <TabNotifications notifications={MOCK_NOTIFICATIONS} />
        )}

        {activeTab === 'profile' && (
          <TabProfile
            client={clientProfile}
            activities={activities}
          />
        )}
      </main>

      {/* Bottom Navigation (4 Tabs) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        unreadNotifsCount={MOCK_NOTIFICATIONS.length}
      />

      {/* Mock QR Scanner Modal */}
      <ScanModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onSimulateScan={handleSimulateScan}
      />
    </div>
  );
}
