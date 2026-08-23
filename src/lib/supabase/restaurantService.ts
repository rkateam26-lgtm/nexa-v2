import { createClient } from './client';
import { RestaurantInfo } from '@/types/client';
import { MOCK_RESTAURANT } from '@/data/mockData';

/**
 * Récupère les informations d'un restaurant dans Supabase par son ID
 */
export async function fetchRestaurantById(restaurantId: string): Promise<RestaurantInfo> {
  if (!restaurantId || restaurantId === MOCK_RESTAURANT.id) {
    return MOCK_RESTAURANT;
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .single();

    if (data && !error) {
      return {
        id: data.id,
        name: data.name,
        logoUrl: data.logo_url || '🍽️',
        welcomeMessage: data.welcome_message || `Bienvenue chez ${data.name}`,
        bannerText: data.banner_text || 'Offre Fidélité Nexa',
      };
    }
  } catch (err) {
    console.warn('Erreur chargement restaurant Supabase:', err);
  }

  // Fallback de sécurité
  return {
    id: restaurantId,
    name: `Restaurant (${restaurantId.substring(0, 8)})`,
    logoUrl: '🍽️',
    welcomeMessage: 'Bienvenue dans notre établissement',
    bannerText: 'Scannez pour accumuler des points',
  };
}
