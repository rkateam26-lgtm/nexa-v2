'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layouts/Header';
import { BottomNav, TabType } from '@/components/layouts/BottomNav';
import { TabHome } from '@/components/client/TabHome';
import { TabRewards } from '@/components/client/TabRewards';
import { TabNotifications } from '@/components/client/TabNotifications';
import { TabProfile } from '@/components/client/TabProfile';
import { ScanModal } from '@/components/client/ScanModal';
import { OnboardingModal } from '@/components/client/OnboardingModal';
import { saveClientToSupabase, fetchClientProfile } from '@/lib/supabase/clientServices';
import { ClientProfile } from '@/types/client';
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
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [clientProfile, setClientProfile] = useState<ClientProfile>(MOCK_CLIENT);
  const [activities, setActivities] = useState(MOCK_ACTIVITIES);
  const [isInitialized, setIsInitialized] = useState(false);

  // Charger le profil client sauvegardé s'il existe
  useEffect(() => {
    async function loadSavedProfile() {
      try {
        const savedRaw = localStorage.getItem('nexa_client_profile');
        if (savedRaw) {
          const parsed = JSON.parse(savedRaw) as ClientProfile;
          setClientProfile(parsed);

          // Tenter de rafraîchir depuis Supabase si un ID Supabase existe
          if (parsed.id && !parsed.id.startsWith('local_')) {
            const remoteProfile = await fetchClientProfile(parsed.id);
            if (remoteProfile) {
              setClientProfile(remoteProfile);
              localStorage.setItem('nexa_client_profile', JSON.stringify(remoteProfile));
            }
          }
        } else {
          // Aucun profil enregistré -> Ouvrir la modale de création
          setIsOnboardingOpen(true);
        }
      } catch (err) {
        console.warn('Erreur chargement profil client local:', err);
      } finally {
        setIsInitialized(true);
      }
    }

    loadSavedProfile();
  }, []);

  // Enregistrement du profil dans Supabase & état local
  const handleCreateProfile = async (name: string, whatsappNumber: string) => {
    const profile = await saveClientToSupabase(name, whatsappNumber, MOCK_RESTAURANT.id);
    setClientProfile(profile);
    localStorage.setItem('nexa_client_profile', JSON.stringify(profile));
    setIsOnboardingOpen(false);
  };

  // Next reward target
  const nextReward = MOCK_REWARDS.find((r) => r.pointsCost > clientProfile.points) || MOCK_REWARDS[MOCK_REWARDS.length - 1];

  // Simuler un scan de points pour la démonstration
  const handleSimulateScan = () => {
    const addedPoints = 10;
    const newPoints = clientProfile.points + addedPoints;
    const updatedProfile = { ...clientProfile, points: newPoints };

    setClientProfile(updatedProfile);
    localStorage.setItem('nexa_client_profile', JSON.stringify(updatedProfile));

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

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 animate-pulse flex items-center justify-center text-white font-extrabold text-lg">
            N
          </div>
          <p className="text-xs text-slate-400 font-medium">Chargement de Nexa V1...</p>
        </div>
      </div>
    );
  }

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

      {/* Onboarding Profile Creation Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        restaurant={MOCK_RESTAURANT}
        onSubmit={handleCreateProfile}
      />
    </div>
  );
}
