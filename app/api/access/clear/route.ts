import { NextResponse } from 'next/server';
import { ACCESS_COOKIE } from '@/lib/member-access';

/** Efface le cookie d’accès appareil (retour gratuit sur cet appareil). */
export async function POST() {
  const response = NextResponse.json({ ok: true, tier: 'free' });
  response.cookies.set(ACCESS_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });
  return response;
}
