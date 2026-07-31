import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, type AccessTier } from '@/lib/member-access';
import { getSiteUrl, isValidUnlockToken } from '@/lib/access-config';
import { grantAccessToProfile } from '@/lib/access-profile';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

function parsePlan(value: string): AccessTier | null {
  if (value === 'ebook' || value === 'coaching') return value;
  return null;
}

/**
 * Lien propre pour Beacons (sans ? ni & — mieux accepté) :
 * https://ton-domaine.fr/acces/ebook/TOKEN
 * https://ton-domaine.fr/acces/coaching/TOKEN
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ plan: string; token: string }> }
) {
  const { plan: planRaw, token } = await context.params;
  const plan = parsePlan(planRaw);
  const siteUrl = getSiteUrl();

  if (!plan) {
    return NextResponse.redirect(`${siteUrl}/merci?error=plan`);
  }

  if (!isValidUnlockToken(plan, token)) {
    return NextResponse.redirect(`${siteUrl}/merci?error=token&plan=${plan}`);
  }

  let linked = false;

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const result = await grantAccessToProfile(user.id, plan, {
          userClient: supabase,
        });
        linked = result.ok && result.linked;
      }
    } catch {
      /* continue */
    }
  }

  const response = NextResponse.redirect(
    `${siteUrl}/espace?unlocked=${plan}&from=beacons&welcome=1${linked ? '&linked=1' : ''}`
  );

  response.cookies.set(ACCESS_COOKIE, plan, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });

  return response;
}
