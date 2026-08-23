import { createClient } from './client';
import { ActivityTransaction } from '@/types/client';

export interface AwardPointsResult {
  success: boolean;
  pointsAwarded?: number;
  newTotalPoints?: number;
  cooldownRemainingMinutes?: number;
  message: string;
}

const DEFAULT_RESTAURANT_ID = '00000000-0000-0000-0000-000000000001';
const DEFAULT_POINTS_PER_SCAN = 20; // Valeur par défaut : 20 points
const COOLDOWN_HOURS = 3; // 1 scan toutes les 3 heures

/**
 * Fonction préparée pour recevoir l'identifiant d'un restaurant après un scan QR Code.
 * Attribue les points et applique la règle stricte des 3 heures.
 */
export async function awardScanPoints(
  clientId: string,
  restaurantId: string = DEFAULT_RESTAURANT_ID
): Promise<AwardPointsResult> {
  const supabase = createClient();
  const now = new Date();

  try {
    // 1. Pour les clients locaux (mode démo sans Supabase distant)
    if (clientId.startsWith('local_')) {
      const lastScanRaw = localStorage.getItem(`nexa_last_scan_${clientId}_${restaurantId}`);
      if (lastScanRaw) {
        const lastScanTime = new Date(lastScanRaw);
        const diffMs = now.getTime() - lastScanTime.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);

        if (diffHours < COOLDOWN_HOURS) {
          const remainingMinutes = Math.ceil((COOLDOWN_HOURS * 60) - (diffMs / (1000 * 60)));
          const hoursLeft = Math.floor(remainingMinutes / 60);
          const minsLeft = remainingMinutes % 60;
          const timeText = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}min` : `${minsLeft}min`;

          return {
            success: false,
            cooldownRemainingMinutes: remainingMinutes,
            message: `⏳ Vous avez déjà reçu vos points. Veuillez attendre encore ${timeText} avant votre prochain scan.`,
          };
        }
      }

      // Valider le scan local
      localStorage.setItem(`nexa_last_scan_${clientId}_${restaurantId}`, now.toISOString());
      return {
        success: true,
        pointsAwarded: DEFAULT_POINTS_PER_SCAN,
        message: `🎉 +${DEFAULT_POINTS_PER_SCAN} Points crédités avec succès !`,
      };
    }

    // 2. Vérification Supabase : Règle des 3 heures basée sur les transactions en base
    const threeHoursAgo = new Date(now.getTime() - COOLDOWN_HOURS * 60 * 60 * 1000).toISOString();

    const { data: recentTransactions, error: txSearchError } = await supabase
      .from('transactions')
      .select('created_at')
      .eq('client_id', clientId)
      .eq('restaurant_id', restaurantId)
      .eq('type', 'scan')
      .gte('created_at', threeHoursAgo)
      .order('created_at', { ascending: false })
      .limit(1);

    if (recentTransactions && recentTransactions.length > 0 && !txSearchError) {
      const lastScanDate = new Date(recentTransactions[0].created_at);
      const diffMs = now.getTime() - lastScanDate.getTime();
      const remainingMinutes = Math.ceil((COOLDOWN_HOURS * 60) - (diffMs / (1000 * 60)));
      const hoursLeft = Math.floor(remainingMinutes / 60);
      const minsLeft = remainingMinutes % 60;
      const timeText = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}min` : `${minsLeft}min`;

      return {
        success: false,
        cooldownRemainingMinutes: remainingMinutes,
        message: `⏳ Vous avez déjà reçu vos points pour ce restaurant. Prochain scan disponible dans ${timeText}.`,
      };
    }

    // 3. Récupérer le solde actuel du client
    const { data: clientData, error: clientFetchError } = await supabase
      .from('clients')
      .select('points')
      .eq('id', clientId)
      .single();

    if (clientFetchError || !clientData) {
      return {
        success: false,
        message: 'Impossible d\'accéder à votre profil client.',
      };
    }

    const currentPoints = clientData.points || 0;
    const newTotal = currentPoints + DEFAULT_POINTS_PER_SCAN;

    // 4. Mettre à jour le solde du client dans Supabase
    const { error: updateError } = await supabase
      .from('clients')
      .update({ points: newTotal })
      .eq('id', clientId);

    if (updateError) {
      return {
        success: false,
        message: 'Erreur lors de la mise à jour de vos points.',
      };
    }

    // 5. Enregistrer l'opération dans la table transactions
    await supabase.from('transactions').insert([
      {
        restaurant_id: restaurantId,
        client_id: clientId,
        type: 'scan',
        title: `Scan QR Code Table (+${DEFAULT_POINTS_PER_SCAN} pts)`,
        points: DEFAULT_POINTS_PER_SCAN,
      },
    ]);

    return {
      success: true,
      pointsAwarded: DEFAULT_POINTS_PER_SCAN,
      newTotalPoints: newTotal,
      message: `🎉 +${DEFAULT_POINTS_PER_SCAN} Points ajoutés avec succès !`,
    };
  } catch (err) {
    console.error('Erreur lors de l\'attribution des points:', err);
    return {
      success: false,
      message: 'Erreur réseau lors de la validation du scan.',
    };
  }
}

/**
 * Récupère l'historique des transactions Supabase pour un client
 */
export async function fetchClientTransactions(
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
    console.warn('Erreur récupération transactions Supabase:', err);
  }

  return [];
}
