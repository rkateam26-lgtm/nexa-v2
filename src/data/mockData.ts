import { RestaurantInfo, ClientProfile, RewardItem, NotificationOffer, ActivityTransaction } from '@/types/client';

export const MOCK_RESTAURANT: RestaurantInfo = {
  id: 'rest_chitir_01',
  name: 'Chitir Chicken',
  logoUrl: '🍗',
  welcomeMessage: 'Bienvenue chez Chitir Chicken',
  bannerText: '🔥 Offre Spéciale : +10 pts sur votre menu aujourd\'hui !'
};

export const MOCK_CLIENT: ClientProfile = {
  id: 'cli_alex_88',
  name: 'Alexandre Dupont',
  whatsappNumber: '+33 6 12 34 56 78',
  points: 120,
  statusBadge: 'Gourmand VIP'
};

export const MOCK_REWARDS: RewardItem[] = [
  {
    id: 'rw_01',
    title: 'Boisson 33cl au choix',
    description: 'Coca-Cola, Sprite, Fanta ou Eau minérale',
    pointsCost: 50,
    category: 'Boisson',
    icon: '🥤'
  },
  {
    id: 'rw_02',
    title: 'Portion de Tenders (x3)',
    description: 'Tenders croustillants au poulet fait maison',
    pointsCost: 100,
    category: 'Accompagnement',
    icon: '🍗'
  },
  {
    id: 'rw_03',
    title: 'Burger Chitir Original Offert',
    description: 'Notre burger signature avec frites et sauce maison',
    pointsCost: 180,
    category: 'Plat Principal',
    icon: '🍔'
  },
  {
    id: 'rw_04',
    title: 'Bucket Familial (12 pièces)',
    description: '12 pièces de poulet pané croustillant + 4 frites moyennes',
    pointsCost: 350,
    category: 'Menu Groupe',
    icon: '🪣'
  }
];

export const MOCK_NOTIFICATIONS: NotificationOffer[] = [
  {
    id: 'notif_01',
    title: '🔥 Happy Hour Tenders',
    message: 'Doublez vos points de fidélité pour toute commande de Tenders entre 18h et 20h !',
    date: '23 août 2026',
    expirationDate: 'Expire le 31 août 2026',
    isFlashOffer: true,
    icon: '⚡'
  },
  {
    id: 'notif_02',
    title: '🎉 Nouveauté : Sauce Honey Mustard',
    message: 'Venez découvrir notre nouvelle sauce artisanale disponible en restaurant.',
    date: '20 août 2026',
    expirationDate: 'Expire le 15 septembre 2026',
    isFlashOffer: false,
    icon: '✨'
  },
  {
    id: 'notif_03',
    title: '🥤 Offre Électrisante Été',
    message: 'Une boisson offerte dès 150 points cumulés ce week-end !',
    date: '18 août 2026',
    expirationDate: 'Expire le 30 août 2026',
    isFlashOffer: true,
    icon: '🎁'
  }
];

export const MOCK_ACTIVITIES: ActivityTransaction[] = [
  {
    id: 'act_01',
    type: 'scan',
    title: 'Scan QR Code Table #04',
    points: +10,
    date: '23/08/2026 14:15'
  },
  {
    id: 'act_02',
    type: 'claim',
    title: 'Récompense débloquée: Boisson 33cl',
    points: -50,
    date: '20/08/2026 19:30'
  },
  {
    id: 'act_03',
    type: 'scan',
    title: 'Scan QR Code Caisse',
    points: +10,
    date: '18/08/2026 13:00'
  },
  {
    id: 'act_04',
    type: 'scan',
    title: 'Offre Bienvenue Inscription',
    points: +150,
    date: '15/08/2026 12:00'
  }
];
