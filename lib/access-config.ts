import type { AccessTier } from './member-access';

export function getExpectedToken(plan: AccessTier): string | undefined {
  if (plan === 'ebook') return process.env.BEACONS_ACCESS_TOKEN_EBOOK;
  if (plan === 'coaching') return process.env.BEACONS_ACCESS_TOKEN_COACHING;
  return undefined;
}

export function isValidUnlockToken(plan: AccessTier, token: string | null): boolean {
  if (!token || plan === 'free') return false;

  const expected = getExpectedToken(plan);
  if (!expected) return false;

  return token === expected;
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

/**
 * Lien propre pour coller dans Beacons (sans ? ni &).
 * Format : https://domaine/acces/ebook/TOKEN
 */
export function buildBeaconsAccessLink(plan: 'ebook' | 'coaching'): string {
  const base = getSiteUrl().replace(/\/$/, '');
  const token = getExpectedToken(plan);
  if (!token) {
    return `${base}/merci?plan=${plan}`;
  }
  return `${base}/acces/${plan}/${token}`;
}