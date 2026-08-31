import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ACCESS_COOKIE, isAccessTier, type AccessTier } from '@/lib/member-access';

/**
 * Lit l’accès appareil validé (cookie httpOnly posé uniquement après un vrai lien/code Beacons).
 * Ne fait pas confiance à l’URL ?unlocked=…
 */
export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(ACCESS_COOKIE)?.value;
  const tier: AccessTier = isAccessTier(raw) ? raw : 'free';

  return NextResponse.json({
    tier,
    hasDeviceAccess: tier !== 'free',
  });
}
