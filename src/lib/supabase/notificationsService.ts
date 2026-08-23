import { createClient } from './client';
import { NotificationOffer } from '@/types/client';
import { MOCK_NOTIFICATIONS } from '@/data/mockData';

const DEFAULT_RESTAURANT_ID = '00000000-0000-0000-0000-000000000001';

export interface ProcessedNotification extends NotificationOffer {
  isExpired: boolean;
}

/**
 * Vérifie si une date d'expiration est dépassée par rapport à la date actuelle
 */
export function isOfferExpired(expirationDateStr: string): boolean {
  try {
    const now = new Date();
    // Ex: "Expire le 31 août 2026" ou "2026-08-31"
    const cleanedDate = expirationDateStr.replace(/Expire le/i, '').trim();

    // Mois français vers chiffres
    const monthsMap: Record<string, string> = {
      janvier: '01', février: '02', mars: '03', avril: '04',
      mai: '05', juin: '06', juillet: '07', août: '08',
      septembre: '09', octobre: '10', novembre: '11', décembre: '12'
    };

    let targetDate: Date | null = null;

    // Test de format ISO
    if (!isNaN(Date.parse(cleanedDate))) {
      targetDate = new Date(cleanedDate);
    } else {
      // Format texte "31 août 2026"
      const parts = cleanedDate.split(' ');
      if (parts.length >= 3) {
        const day = parts[0].padStart(2, '0');
        const monthName = parts[1].toLowerCase();
        const year = parts[2];
        const monthNum = monthsMap[monthName] || '01';

        targetDate = new Date(`${year}-${monthNum}-${day}T23:59:59`);
      }
    }

    if (targetDate && !isNaN(targetDate.getTime())) {
      return now.getTime() > targetDate.getTime();
    }
  } catch (err) {
    console.warn('Erreur analyse date expiration:', err);
  }

  return false;
}

/**
 * Récupère les notifications et offres d'un restaurant spécifique depuis Supabase
 */
export async function fetchRestaurantNotifications(
  restaurantId: string = DEFAULT_RESTAURANT_ID
): Promise<ProcessedNotification[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (data && data.length > 0 && !error) {
      return data.map((item) => {
        const expired = isOfferExpired(item.expiration_date);
        return {
          id: item.id,
          title: item.title,
          message: item.message,
          date: item.date,
          expirationDate: item.expiration_date,
          isFlashOffer: item.is_flash_offer,
          icon: item.icon || '🔔',
          isExpired: expired,
        };
      });
    }
  } catch (err) {
    console.warn('Erreur chargement notifications Supabase:', err);
  }

  // Fallback Mock Data avec calcul d'expiration
  return MOCK_NOTIFICATIONS.map((item) => ({
    ...item,
    isExpired: isOfferExpired(item.expirationDate),
  }));
}
