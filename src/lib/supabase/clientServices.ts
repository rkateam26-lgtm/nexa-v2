import { createClient } from './client';
import { ClientProfile } from '@/types/client';

const DEFAULT_RESTAURANT_ID = '00000000-0000-0000-0000-000000000001';

/**
 * Enregistre ou récupère un profil client dans Supabase
 */
export async function saveClientToSupabase(
  name: string,
  whatsappNumber: string,
  restaurantId: string = DEFAULT_RESTAURANT_ID
): Promise<ClientProfile> {
  const supabase = createClient();

  try {
    // 1. Chercher si le client existe déjà avec ce numéro WhatsApp pour ce restaurant
    const { data: existingClient, error: searchError } = await supabase
      .from('clients')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .eq('whatsapp_number', whatsappNumber)
      .maybeSingle();

    if (existingClient && !searchError) {
      return {
        id: existingClient.id,
        name: existingClient.name,
        whatsappNumber: existingClient.whatsapp_number,
        points: existingClient.points || 0,
        statusBadge: existingClient.status_badge || 'Membre VIP',
      };
    }

    // 2. Sinon, créer un nouveau client dans Supabase
    const { data: newClient, error: insertError } = await supabase
      .from('clients')
      .insert([
        {
          restaurant_id: restaurantId,
          name: name,
          whatsapp_number: whatsappNumber,
          points: 10, // Offre d'accueil
          status_badge: 'Nouveau Membre',
        },
      ])
      .select()
      .single();

    if (newClient && !insertError) {
      return {
        id: newClient.id,
        name: newClient.name,
        whatsappNumber: newClient.whatsapp_number,
        points: newClient.points || 10,
        statusBadge: newClient.status_badge || 'Nouveau Membre',
      };
    }
  } catch (err) {
    console.warn('Erreur ou Supabase non disponible, utilisation du mode local:', err);
  }

  // Fallback local sécurisé
  return {
    id: `local_cli_${Date.now()}`,
    name: name,
    whatsappNumber: whatsappNumber,
    points: 10,
    statusBadge: 'Nouveau Membre',
  };
}

/**
 * Récupère le profil client depuis Supabase par son ID
 */
export async function fetchClientProfile(clientId: string): Promise<ClientProfile | null> {
  if (clientId.startsWith('local_')) return null;

  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('id', clientId)
      .single();

    if (data && !error) {
      return {
        id: data.id,
        name: data.name,
        whatsappNumber: data.whatsapp_number,
        points: data.points || 0,
        statusBadge: data.status_badge || 'Membre VIP',
      };
    }
  } catch (err) {
    console.warn('Erreur récupération Supabase client:', err);
  }

  return null;
}
