import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, type AccessTier } from '@/lib/member-access';
import { getSiteUrl, isValidUnlockToken } from '@/lib/access-config';

function parsePlan(value: string): AccessTier | null {
  if (value === 'ebook' || value === 'coaching') return value;
  return null;
}

/**
 * Lien propre pour Beacons (sans ? ni & — mieux accepté) :
 * https://ton-domaine.fr/acces/ebook/nb-ebook-xxx
 * https://ton-domaine.fr/acces/coaching/nb-coach-xxx
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

  const response = NextResponse.redirect(
    `${siteUrl}/espace?unlocked=${plan}&from=beacons&welcome=1`
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