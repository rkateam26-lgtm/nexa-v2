/**
 * ÉTAPE 3 — Modèles TypeScript pour l'interface client Nexa V1
 */

export interface RestaurantInfo {
  id: string;
  name: string;
  logoUrl?: string;
  welcomeMessage: string;
  bannerText?: string;
}

export interface ClientProfile {
  id: string;
  name: string;
  whatsappNumber: string;
  points: number;
  statusBadge: string;
}

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  icon: string;
}

export interface NotificationOffer {
  id: string;
  title: string;
  message: string;
  date: string;
  expirationDate: string;
  isFlashOffer: boolean;
  icon: string;
}

export interface ActivityTransaction {
  id: string;
  type: 'scan' | 'claim';
  title: string;
  points: number;
  date: string;
}
