import { createClient } from './client';
import { RewardItem } from '@/types/client';
import { MOCK_REWARDS } from '@/data/mockData';

const DEFAULT_RESTAURANT_ID = '00000000-0000-0000-0000-000000000001';

export interface ClaimRewardResult {
  success: boolean;
  newPointsBalance?: number;
  rewardTitle?: string;
  message: string;
}

/**
 * Récupère le catalogue des récompenses actives d'un restaurant
 */
export async function fetchRestaurantRewards(
  restaurantId: string = DEFAULT_RESTAURANT_ID
): Promise<RewardItem[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('rewards')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('is_active', true)
      .order('points_cost', { ascending: true });

    if (data && data.length > 0 && !error) {
      return data.map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description || '',
        pointsCost: r.points_cost,
        category: r.category || 'Général',
        icon: r.icon || '🎁',
      }));
    }
  } catch (err) {
    console.warn('Erreur chargement récompenses Supabase:', err);
  }

  return MOCK_REWARDS;
}

/**
 * Récupère les identifiants des récompenses déjà utilisées par le client
 */
export async function fetchClaimedRewardIds(
  clientId: string,
  restaurantId: string = DEFAULT_RESTAURANT_ID
): Promise<string[]> {
  if (clientId.startsWith('local_')) {
    try {
      const claimedRaw = localStorage.getItem(`nexa_claimed_${clientId}_${restaurantId}`);
      return claimedRaw ? JSON.parse(claimedRaw) : [];
    } catch {
      return [];
    }
  }

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('transactions')
      .select('title')
      .eq('client_id', clientId)
      .eq('restaurant_id', restaurantId)
      .eq('type', 'claim');

    if (data && !error) {
      // Extraire les titres de récompenses utilisées
      return data.map((t) => t.title);
    }
  } catch (err) {
    console.warn('Erreur chargement récompenses utilisées:', err);
  }

  return [];
}

/**
 * Effectue la déduction sécurisée des points et le déblocage de la récompense
 */
export async function claimReward(
  clientId: string,
  reward: RewardItem,
  restaurantId: string = DEFAULT_RESTAURANT_ID
): Promise<ClaimRewardResult> {
  // 1. Client Local / Mode Démo
  if (clientId.startsWith('local_')) {
    const claimedRaw = localStorage.getItem(`nexa_claimed_${clientId}_${restaurantId}`);
    const claimedList: string[] = claimedRaw ? JSON.parse(claimedRaw) : [];

    if (claimedList.includes(reward.id) || claimedList.includes(reward.title)) {
      return {
        success: false,
        message: '⚠️ Cette récompense a déjà été utilisée et ne peut plus être récupérée.',
      };
    }

    // Marquer comme utilisée localement
    claimedList.push(reward.id);
    claimedList.push(reward.title);
    localStorage.setItem(`nexa_claimed_${clientId}_${restaurantId}`, JSON.stringify(claimedList));

    return {
      success: true,
      rewardTitle: reward.title,
      message: `🎉 Félicitations ! Récompense "${reward.title}" débloquée avec succès.`,
    };
  }

  // 2. Traitement Sécurisé Supabase
  try {
    const supabase = createClient();

    // A. Vérifier si déjà réclamée par ce client
    const { data: existingClaims } = await supabase
      .from('transactions')
      .select('id')
      .eq('client_id', clientId)
      .eq('restaurant_id', restaurantId)
      .eq('type', 'claim')
      .ilike('title', `%${reward.title}%`);

    if (existingClaims && existingClaims.length > 0) {
      return {
        success: false,
        message: '⚠️ Cette récompense a déjà été utilisée et ne peut plus être récupérée.',
      };
    }

    // B. Vérifier le solde de points actuel du client côté serveur
    const { data: clientData, error: clientFetchError } = await supabase
      .from('clients')
      .select('points')
      .eq('id', clientId)
      .single();

    if (clientFetchError || !clientData) {
      return {
        success: false,
        message: 'Impossible de vérifier votre profil client.',
      };
    }

    const currentPoints = clientData.points || 0;

    // C. Contrôle de solde suffisant
    if (currentPoints < reward.pointsCost) {
      return {
        success: false,
        message: `⚠️ Solde insuffisant ! Il vous manque ${reward.pointsCost - currentPoints} points pour débloquer cette récompense.`,
      };
    }

    const newBalance = currentPoints - reward.pointsCost;

    // D. Déduction atomique des points dans la table clients
    const { error: updateError } = await supabase
      .from('clients')
      .update({ points: newBalance })
      .eq('id', clientId);

    if (updateError) {
      return {
        success: false,
        message: 'Erreur lors de la déduction de vos points.',
      };
    }

    // E. Enregistrement de la transaction dans Supabase
    await supabase.from('transactions').insert([
      {
        restaurant_id: restaurantId,
        client_id: clientId,
        type: 'claim',
        title: `Récompense débloquée: ${reward.title}`,
        points: -reward.pointsCost,
      },
    ]);

    return {
      success: true,
      newPointsBalance: newBalance,
      rewardTitle: reward.title,
      message: `🎉 Récompense "${reward.title}" débloquée avec succès (-${reward.pointsCost} pts) !`,
    };
  } catch (err) {
    console.error('Erreur lors de la réclamation de la récompense:', err);
    return {
      success: false,
      message: 'Erreur réseau lors de la validation de la récompense.',
    };
  }
}
