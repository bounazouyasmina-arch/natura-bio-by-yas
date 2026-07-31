import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE } from '@/lib/member-access';
import { getSiteUrl, isValidUnlockToken } from '@/lib/access-config';
import type { AccessTier } from '@/lib/member-access';
import { grantAccessToProfile } from '@/lib/access-profile';
import { createClient } from '@/lib/supabase/server';
import { isSupabaseConfigured } from '@/lib/supabase/config';

function parsePlan(value: string | null): AccessTier | null {
  if (value === 'ebook' || value === 'coaching') return value;
  return null;
}

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const plan = parsePlan(url.searchParams.get('plan'));
  const token = url.searchParams.get('token');
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
