import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE } from '@/lib/member-access';
import { getSiteUrl, isValidUnlockToken } from '@/lib/access-config';
import type { AccessTier } from '@/lib/member-access';

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