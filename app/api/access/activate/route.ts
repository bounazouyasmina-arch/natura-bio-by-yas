import { NextRequest, NextResponse } from 'next/server';
import { ACCESS_COOKIE, type AccessTier } from '@/lib/member-access';
import { isValidUnlockToken } from '@/lib/access-config';

export async function POST(request: NextRequest) {
  let body: { token?: string; plan?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Requête invalide' }, { status: 400 });
  }

  const token = (body.token || '').trim();
  if (!token) {
    return NextResponse.json({ error: 'Code manquant' }, { status: 400 });
  }

  const candidates: AccessTier[] =
    body.plan === 'ebook' || body.plan === 'coaching'
      ? [body.plan]
      : ['ebook', 'coaching'];

  let matched: AccessTier | null = null;
  for (const plan of candidates) {
    if (isValidUnlockToken(plan, token)) {
      matched = plan;
      break;
    }
  }

  if (!matched) {
    return NextResponse.json(
      { error: 'Code invalide. Vérifie le lien reçu après ton achat Beacons.' },
      { status: 403 }
    );
  }

  const response = NextResponse.json({
    ok: true,
    plan: matched,
    message:
      matched === 'coaching'
        ? 'Coaching activé avec succès'
        : 'Accès illimité activé avec succès',
  });

  response.cookies.set(ACCESS_COOKIE, matched, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
    path: '/',
  });

  return response;
}