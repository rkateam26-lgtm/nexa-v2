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
import { awardScanPoints, fetchClientTransactions } from '@/lib/supabase/pointsService';
import { ClientProfile, ActivityTransaction } from '@/types/client';
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
  const [activities, setActivities] = useState<ActivityTransaction[]>(MOCK_ACTIVITIES);
  const [isInitialized, setIsInitialized] = useState(false);
  const [scanFeedback, setScanFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [isScanLoading, setIsScanLoading] = useState(false);

  // Charger le profil client et ses transactions Supabase
  useEffect(() => {
    async function loadSavedProfile() {
      try {
        const savedRaw = localStorage.getItem('nexa_client_profile');
        if (savedRaw) {
          const parsed = JSON.parse(savedRaw) as ClientProfile;
          setClientProfile(parsed);

          // Si le profil est sauvegardé dans Supabase, récupérer ses données réelles et transactions
          if (parsed.id && !parsed.id.startsWith('local_')) {
            const remoteProfile = await fetchClientProfile(parsed.id);
            if (remoteProfile) {
              setClientProfile(remoteProfile);
              localStorage.setItem('nexa_client_profile', JSON.stringify(remoteProfile));
            }

            const remoteTransactions = await fetchClientTransactions(parsed.id, MOCK_RESTAURANT.id);
            if (remoteTransactions && remoteTransactions.length > 0) {
              setActivities(remoteTransactions);
            }
          }
        } else {
          setIsOnboardingOpen(true);
        }
      } catch (err) {
        console.warn('Erreur chargement profil client:', err);
      } finally {
        setIsInitialized(true);
      }
    }

    loadSavedProfile();
  }, []);

  // Enregistrement du profil dans Supabase
  const handleCreateProfile = async (name: string, whatsappNumber: string) => {
    const profile = await saveClientToSupabase(name, whatsappNumber, MOCK_RESTAURANT.id);
    setClientProfile(profile);
    localStorage.setItem('nexa_client_profile', JSON.stringify(profile));
    setIsOnboardingOpen(false);
  };

  // Traitement réel du scan et validation de la règle des 3 heures
  const handleProcessScan = async () => {
    setIsScanLoading(true);
    setScanFeedback(null);

    const result = await awardScanPoints(clientProfile.id, MOCK_RESTAURANT.id);

    if (result.success && result.pointsAwarded) {
      const newTotal = result.newTotalPoints ?? (clientProfile.points + result.pointsAwarded);
      const updatedProfile = { ...clientProfile, points: newTotal };

      setClientProfile(updatedProfile);
      localStorage.setItem('nexa_client_profile', JSON.stringify(updatedProfile));

      // Ajouter à l'historique
      const newTx: ActivityTransaction = {
        id: `act_${Date.now()}`,
        type: 'scan',
        title: `Scan QR Code Table (+${result.pointsAwarded} pts)`,
        points: result.pointsAwarded,
        date: new Date().toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      };
      setActivities((prev) => [newTx, ...prev]);

      setScanFeedback({ text: result.message, isError: false });
    } else {
      // Refus Cooldown (moins de 3h)
      setScanFeedback({ text: result.message, isError: true });
    }

    setIsScanLoading(false);
  };

  // Next reward target
  const nextReward = MOCK_REWARDS.find((r) => r.pointsCost > clientProfile.points) || MOCK_REWARDS[MOCK_REWARDS.length - 1];

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 animate-pulse flex items-center justify-center text-white font-extrabold text-lg">
            N
          </div>
          <p className="text-xs text-slate-400 font-medium">Chargement du Système de Points Nexa...</p>
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
            onOpenScan={() => {
              setScanFeedback(null);
              setIsScanOpen(true);
            }}
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

      {/* QR Scanner Modal with Cooldown 3h validation */}
      <ScanModal
        isOpen={isScanOpen}
        onClose={() => setIsScanOpen(false)}
        onSimulateScan={handleProcessScan}
        messageFeedback={scanFeedback}
        isLoading={isScanLoading}
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
