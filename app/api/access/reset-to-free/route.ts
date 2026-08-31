import { NextResponse } from 'next/server';
import { ACCESS_COOKIE } from '@/lib/member-access';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/**
 * Remet l’accès en gratuit : cookie appareil + profil connecté (si session).
 * Utile pour les tests / corriger un illimité sans achat.
 */
export async function POST() {
  let profileCleared = false;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const admin = createAdminClient();
        const client = admin || supabase;
        const now = new Date().toISOString();
        const { error } = await client
          .from('profiles')
          .update({ access_tier: 'free', updated_at: now })
          .eq('id', user.id);
        profileCleared = !error;
      }
    } catch {
      /* cookie cleared anyway */
    }
  }

  const response = NextResponse.json({
    ok: true,
    tier: 'free',
    profileCleared,
    message: 'Accès remis en gratuit sur cet appareil' + (profileCleared ? ' et sur le compte' : ''),
  });

  response.cookies.set(ACCESS_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
