import type { AccessTier } from '@/lib/member-access';
import { isAccessTier, resolveAccessTier } from '@/lib/member-access';
import { createAdminClient } from '@/lib/supabase/admin';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * Enregistre le plan premium sur le profil Supabase (multi-appareils).
 * Préfère la service role ; sinon update via le client utilisateur (session).
 */
export async function grantAccessToProfile(
  userId: string,
  plan: AccessTier,
  options?: { userClient?: SupabaseClient }
): Promise<{ ok: boolean; tier: AccessTier; linked: boolean; error?: string }> {
  if (plan === 'free') {
    return { ok: false, tier: 'free', linked: false, error: 'Plan invalide' };
  }

  const admin = createAdminClient();
  const client = admin || options?.userClient;

  if (!client) {
    return {
      ok: false,
      tier: plan,
      linked: false,
      error:
        'Ajoute SUPABASE_SERVICE_ROLE_KEY sur Vercel pour lier l’accès au compte.',
    };
  }

  try {
    const { data: profile, error: readError } = await client
      .from('profiles')
      .select('access_tier')
      .eq('id', userId)
      .maybeSingle();

    if (readError) {
      return {
        ok: false,
        tier: plan,
        linked: false,
        error: `Lecture profil: ${readError.message}`,
      };
    }

    const current = isAccessTier(profile?.access_tier)
      ? profile.access_tier
      : 'free';
    const merged = resolveAccessTier(current, plan);
    const now = new Date().toISOString();

    if (profile) {
      const { error } = await client
        .from('profiles')
        .update({ access_tier: merged, updated_at: now })
        .eq('id', userId);

      if (error) {
        return { ok: false, tier: plan, linked: false, error: error.message };
      }
    } else {
      const { error } = await client.from('profiles').insert({
        id: userId,
        access_tier: merged,
        display_name: 'Membre',
        updated_at: now,
      });

      if (error) {
        return { ok: false, tier: plan, linked: false, error: error.message };
      }
    }

    // Vérifie que l’écriture a bien pris
    const { data: check } = await client
      .from('profiles')
      .select('access_tier')
      .eq('id', userId)
      .maybeSingle();

    if (!isAccessTier(check?.access_tier) || check.access_tier === 'free') {
      return {
        ok: false,
        tier: plan,
        linked: false,
        error: 'Écriture profil non confirmée (access_tier encore free)',
      };
    }

    return {
      ok: true,
      tier: check.access_tier as AccessTier,
      linked: true,
    };
  } catch (e) {
    return {
      ok: false,
      tier: plan,
      linked: false,
      error: e instanceof Error ? e.message : 'Erreur profil',
    };
  }
}
