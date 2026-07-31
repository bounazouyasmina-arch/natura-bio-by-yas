import { NextResponse } from 'next/server';
import { isAccessTier, type AccessTier } from '@/lib/member-access';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

/** Lit le access_tier du profil connecté. */
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ tier: 'free' as AccessTier, authenticated: false });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ tier: 'free' as AccessTier, authenticated: false });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('access_tier, updated_at, display_name')
      .eq('id', user.id)
      .maybeSingle();

    const tier: AccessTier = isAccessTier(profile?.access_tier)
      ? profile!.access_tier
      : 'free';

    return NextResponse.json({
      authenticated: true,
      tier,
      displayName: profile?.display_name || null,
      updatedAt: profile?.updated_at || null,
      userId: user.id,
      email: user.email,
    });
  } catch {
    return NextResponse.json({ tier: 'free' as AccessTier, authenticated: false });
  }
}
