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
import { awardScanPoints } from '@/lib/supabase/pointsService';
import { fetchClientHistory } from '@/lib/supabase/historyService';
import { fetchRestaurantById } from '@/lib/supabase/restaurantService';
import {
  fetchRestaurantRewards,
  fetchClaimedRewardIds,
  claimReward,
} from '@/lib/supabase/rewardsService';
import {
  fetchRestaurantNotifications,
  ProcessedNotification,
} from '@/lib/supabase/notificationsService';
import { ClientProfile, ActivityTransaction, RestaurantInfo, RewardItem } from '@/types/client';
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
  const [rewards, setRewards] = useState<RewardItem[]>(MOCK_REWARDS);
  const [claimedRewardIds, setClaimedRewardIds] = useState<string[]>([]);
  const [notifications, setNotifications] = useState<ProcessedNotification[]>([]);
  const [activities, setActivities] = useState<ActivityTransaction[]>(MOCK_ACTIVITIES);
  const [scanFeedback, setScanFeedback] = useState<{ text: string; isError: boolean } | null>(null);
  const [isScanLoading, setIsScanLoading] = useState(false);
  const [claimToast, setClaimToast] = useState<{ text: string; isError: boolean } | null>(null);

  // Initialisation réactive du restaurant, profil, récompenses et historique Supabase
  useEffect(() => {
    let isMounted = true;

    async function init() {
      let currentRest = MOCK_RESTAURANT;

      if (restaurantParam) {
        try {
          currentRest = await fetchRestaurantById(restaurantParam);
          if (isMounted) setActiveRestaurant(currentRest);
        } catch {}
      }

      // Charger le catalogue de récompenses Supabase
      try {
        const remoteRewards = await fetchRestaurantRewards(currentRest.id);
        if (isMounted && remoteRewards.length > 0) setRewards(remoteRewards);
      } catch {}

      // Charger les notifications Supabase
      try {
        const remoteNotifs = await fetchRestaurantNotifications(currentRest.id);
        if (isMounted && remoteNotifs.length > 0) setNotifications(remoteNotifs);
      } catch {}

      // Charger le profil client et son historique réel
      try {
        const savedRaw = localStorage.getItem('nexa_client_profile');
        if (savedRaw) {
          const parsed = JSON.parse(savedRaw) as ClientProfile;
          if (isMounted) setClientProfile(parsed);

          if (parsed.id && !parsed.id.startsWith('local_')) {
            const remoteProfile = await fetchClientProfile(parsed.id);
            if (remoteProfile && isMounted) setClientProfile(remoteProfile);

            // Charger l'historique réel depuis Supabase
            const remoteHistory = await fetchClientHistory(parsed.id, currentRest.id);
            if (isMounted) setActivities(remoteHistory);

            const remoteClaimed = await fetchClaimedRewardIds(parsed.id, currentRest.id);
            if (remoteClaimed && isMounted) setClaimedRewardIds(remoteClaimed);
          } else {
            const localClaimed = await fetchClaimedRewardIds(parsed.id, currentRest.id);
            if (localClaimed && isMounted) setClaimedRewardIds(localClaimed);
          }
        } else {
          if (isMounted) setIsOnboardingOpen(true);
        }
      } catch (err) {
        console.warn('Erreur initialisation client/historique:', err);
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

  // Traitement du scan QR pour l'attribution des points
  const handleProcessScan = async () => {
    setIsScanLoading(true);
    setScanFeedback(null);

    const result = await awardScanPoints(clientProfile.id, activeRestaurant.id);

    if (result.success && result.pointsAwarded) {
      const newTotal = result.newTotalPoints ?? (clientProfile.points + result.pointsAwarded);
      const updatedProfile = { ...clientProfile, points: newTotal };

      setClientProfile(updatedProfile);
      localStorage.setItem('nexa_client_profile', JSON.stringify(updatedProfile));

      // Rafraîchir l'historique depuis Supabase
      const updatedHistory = await fetchClientHistory(clientProfile.id, activeRestaurant.id);
      if (updatedHistory.length > 0) {
        setActivities(updatedHistory);
      } else {
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
      }

      setScanFeedback({ text: result.message, isError: false });
    } else {
      setScanFeedback({ text: result.message, isError: true });
    }

    setIsScanLoading(false);
  };

  // Traitement de l'échange de Récompense
  const handleClaimReward = async (reward: RewardItem) => {
    setIsScanLoading(true);
    setClaimToast(null);

    const result = await claimReward(clientProfile.id, reward, activeRestaurant.id);

    if (result.success) {
      const newTotal = result.newPointsBalance ?? Math.max(0, clientProfile.points - reward.pointsCost);
      const updatedProfile = { ...clientProfile, points: newTotal };

      setClientProfile(updatedProfile);
      localStorage.setItem('nexa_client_profile', JSON.stringify(updatedProfile));

      setClaimedRewardIds((prev) => [...prev, reward.id, reward.title]);

      // Rafraîchir l'historique depuis Supabase
      const updatedHistory = await fetchClientHistory(clientProfile.id, activeRestaurant.id);
      if (updatedHistory.length > 0) {
        setActivities(updatedHistory);
      } else {
        const claimTx: ActivityTransaction = {
          id: `claim_${Date.now()}`,
          type: 'claim',
          title: `Récompense débloquée: ${reward.title}`,
          points: -reward.pointsCost,
          date: new Date().toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setActivities((prev) => [claimTx, ...prev]);
      }

      setClaimToast({ text: result.message, isError: false });
    } else {
      setClaimToast({ text: result.message, isError: true });
    }

    setIsScanLoading(false);
  };

  const nextReward = rewards.find((r) => r.pointsCost > clientProfile.points) || rewards[rewards.length - 1];
  const activeNotifsCount = notifications.filter((n) => !n.isExpired).length;

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
          <span>🖨️ Affiche QR Code ({activeRestaurant.name})</span>
        </button>
      </div>

      {/* Toast Notification Banner for Reward Claims */}
      {claimToast && (
        <div
          className={`mx-4 mt-3 p-3 rounded-xl border text-xs font-semibold text-center transition-all ${
            claimToast.isError
              ? 'bg-amber-500/15 border-amber-500/40 text-amber-300'
              : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
          }`}
        >
          {claimToast.text}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-md w-full mx-auto p-4 pt-4">
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
            rewards={rewards}
            claimedRewardIds={claimedRewardIds}
            onClaimReward={handleClaimReward}
            isLoading={isScanLoading}
          />
        )}

        {activeTab === 'notifications' && (
          <TabNotifications notifications={notifications} />
        )}

        {activeTab === 'profile' && (
          <TabProfile
            client={clientProfile}
            activities={activities}
            restaurant={activeRestaurant}
          />
        )}
      </main>

      {/* Bottom Navigation (4 Tabs) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        unreadNotifsCount={activeNotifsCount}
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
          <p className="text-xs text-slate-400">Chargement Nexa...</p>
        </div>
      }
    >
      <NexaAppContent />
    </Suspense>
  );
}
