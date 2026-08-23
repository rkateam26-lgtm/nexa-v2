'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/layouts/Header';
import { BottomNav, TabType } from '@/components/layouts/BottomNav';
import { TabHome } from '@/components/client/TabHome';
import { TabRewards } from '@/components/client/TabRewards';
import { TabNotifications } from '@/components/client/TabNotifications';
import { TabProfile } from '@/components/client/TabProfile';
import { ScanModal } from '@/components/client/ScanModal';
import { OnboardingModal } from '@/components/client/OnboardingModal';
import { RestaurantQrPoster } from '@/components/qr/RestaurantQrPoster';
import { saveClientToSupabase, fetchClientProfile } from '@/lib/supabase/clientServices';
import { awardScanPoints, fetchClientTransactions } from '@/lib/supabase/pointsService';
import { fetchRestaurantById } from '@/lib/supabase/restaurantService';
import { ClientProfile, ActivityTransaction, RestaurantInfo } from '@/types/client';
import {
  MOCK_RESTAURANT,
  MOCK_CLIENT,
  MOCK_REWARDS,
  MOCK_NOTIFICATIONS,
  MOCK_ACTIVITIES,
} from '@/data/mockData';

function NexaAppContent() {
  const searchParams = useSearchParams();
  const restaurantParam = searchParams.get('r') || searchParams.get('restaurant');

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [activeRestaurant, setActiveRestaurant] = useState<RestaurantInfo>(MOCK_RESTAURANT);
  const [isScanOpen, setIsScanOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isPosterOpen, setIsPosterOpen] = useState(false);
  const [clientProfile, setClientProfile] = useState<ClientProfile>(MOCK_CLIENT);
  const [activities, setActivities] = useState<ActivityTransaction[]>(MOCK_ACTIVITIES);
  const [scanFeedback, setScanFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [isScanLoading, setIsScanLoading] = useState(false);

  // Initialisation instantanée dès le montage du composant
  useEffect(() => {
    let isMounted = true;

    async function init() {
      // 1. Charger le restaurant s'il est spécifié dans l'URL
      if (restaurantParam) {
        try {
          const rest = await fetchRestaurantById(restaurantParam);
          if (isMounted) setActiveRestaurant(rest);
        } catch {
          // Ignorer et utiliser MOCK_RESTAURANT
        }
      }

      // 2. Charger le profil client local
      try {
        const savedRaw = localStorage.getItem('nexa_client_profile');
        if (savedRaw) {
          const parsed = JSON.parse(savedRaw) as ClientProfile;
          if (isMounted) setClientProfile(parsed);
        } else {
          // Afficher modale d'inscription si aucun profil
          if (isMounted) setIsOnboardingOpen(true);
        }
      } catch (err) {
        console.warn('Erreur lecture profil local:', err);
      }
    }

    init();

    return () => {
      isMounted = false;
    };
  }, [restaurantParam]);

  // Enregistrement de profil client
  const handleCreateProfile = async (name: string, whatsappNumber: string) => {
    const profile = await saveClientToSupabase(name, whatsappNumber, activeRestaurant.id);
    setClientProfile(profile);
    localStorage.setItem('nexa_client_profile', JSON.stringify(profile));
    setIsOnboardingOpen(false);
  };

  // Traitement manuel du scan
  const handleProcessScan = async () => {
    setIsScanLoading(true);
    setScanFeedback(null);

    const result = await awardScanPoints(clientProfile.id, activeRestaurant.id);

    if (result.success && result.pointsAwarded) {
      const newTotal = result.newTotalPoints ?? (clientProfile.points + result.pointsAwarded);
      const updatedProfile = { ...clientProfile, points: newTotal };

      setClientProfile(updatedProfile);
      localStorage.setItem('nexa_client_profile', JSON.stringify(updatedProfile));

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
      setScanFeedback({ text: result.message, isError: true });
    }

    setIsScanLoading(false);
  };

  const nextReward = MOCK_REWARDS.find((r) => r.pointsCost > clientProfile.points) || MOCK_REWARDS[MOCK_REWARDS.length - 1];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 antialiased font-sans flex flex-col">
      {/* Restaurant Header */}
      <Header restaurant={activeRestaurant} />

      {/* Quick Merchant Bar to Generate / Download QR Poster */}
      <div className="bg-slate-900/60 border-b border-slate-800 py-1.5 px-4 text-center">
        <button
          onClick={() => setIsPosterOpen(true)}
          className="inline-flex items-center gap-1.5 text-xs text-amber-400 font-bold hover:underline"
        >
          <span>🖨️ Générer & Imprimer l'Affiche QR Code ({activeRestaurant.name})</span>
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 pt-5">
        {activeTab === 'home' && (
          <TabHome
            client={clientProfile}
            nextReward={nextReward}
            restaurant={activeRestaurant}
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

      {/* QR Scanner Modal */}
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
        restaurant={activeRestaurant}
        onSubmit={handleCreateProfile}
      />

      {/* Printable QR Code Poster Generator Modal */}
      <RestaurantQrPoster
        isOpen={isPosterOpen}
        restaurant={activeRestaurant}
        onClose={() => setIsPosterOpen(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-red-600 animate-bounce flex items-center justify-center text-white font-bold">N</div>
            <p className="text-xs text-slate-400">Chargement de Nexa Client...</p>
          </div>
        </div>
      }
    >
      <NexaAppContent />
    </Suspense>
  );
}
