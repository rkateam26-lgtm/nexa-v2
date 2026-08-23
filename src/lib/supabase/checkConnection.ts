import { createClient } from './client';

export async function checkSupabaseConnection(): Promise<{
  connected: boolean;
  message: string;
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key || url.includes('your-project') || key.includes('your-anon-key')) {
    return {
      connected: false,
      message: 'Variables Supabase non configurées (Prêt dans .env.local)',
    };
  }

  try {
    const supabase = createClient();
    const { error } = await supabase.from('restaurants').select('id').limit(1);

    if (error) {
      return {
        connected: false,
        message: `Erreur connexion Supabase: ${error.message}`,
      };
    }

    return {
      connected: true,
      message: 'Connexion Supabase active et fonctionnelle !',
    };
  } catch (err) {
    return {
      connected: false,
      message: `Exception lors du test Supabase: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}
