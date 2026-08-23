import { createClient } from './client';
import { ActivityTransaction } from '@/types/client';

const DEFAULT_RESTAURANT_ID = '00000000-0000-0000-0000-000000000001';

export interface ExtendedTransaction extends ActivityTransaction {
  restaurantId: string;
  clientId: string;
  clientName?: string;
}

/**
 * Récupère l'historique complet d'un client pour un restaurant (ordre chronologique inversé)
 */
export async function fetchClientHistory(
  clientId: string,
  restaurantId: string = DEFAULT_RESTAURANT_ID
): Promise<ActivityTransaction[]> {
  if (clientId.startsWith('local_')) return [];

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('client_id', clientId)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (data && !error) {
      return data.map((t) => ({
        id: t.id,
        type: t.type as 'scan' | 'claim',
        title: t.title,
        points: t.points,
        date: new Date(t.created_at).toLocaleString('fr-FR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));
    }
  } catch (err) {
    console.warn('Erreur chargement historique client Supabase:', err);
  }

  return [];
}

/**
 * Préparation Espace Restaurant: Récupère l'historique d'activité global d'un restaurant
 * (Gains de points et utilisation des récompenses de ses propres clients)
 */
export async function fetchRestaurantHistory(
  restaurantId: string = DEFAULT_RESTAURANT_ID
): Promise<ExtendedTransaction[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('transactions')
      .select(`
        id,
        type,
        title,
        points,
        created_at,
        client_id,
        restaurant_id,
        clients ( name )
      `)
      .eq('restaurant_id', restaurantId)
      .order('created_at', { ascending: false });

    if (data && !error) {
      return data.map((t) => {
        // Correct handling of joined clients record
        const clientObj = Array.isArray(t.clients) ? t.clients[0] : t.clients;
        return {
          id: t.id,
          type: t.type as 'scan' | 'claim',
          title: t.title,
          points: t.points,
          restaurantId: t.restaurant_id,
          clientId: t.client_id,
          clientName: clientObj?.name || 'Client',
          date: new Date(t.created_at).toLocaleString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
      });
    }
  } catch (err) {
    console.warn('Erreur chargement historique restaurant Supabase:', err);
  }

  return [];
}
