export type AccessTier = 'free' | 'ebook' | 'coaching';

export const ACCESS_STORAGE_KEY = 'natura_access_tier';
export const ACCESS_SINCE_KEY = 'natura_access_since';
export const ACCESS_COOKIE = 'natura_access';

const TIER_RANK: Record<AccessTier, number> = {
  free: 0,
  ebook: 1,
  coaching: 2,
};

export function isAccessTier(value: string | null | undefined): value is AccessTier {
  return value === 'free' || value === 'ebook' || value === 'coaching';
}

export function resolveAccessTier(
  ...candidates: Array<string | null | undefined>
): AccessTier {
  let best: AccessTier = 'free';

  for (const candidate of candidates) {
    if (!isAccessTier(candidate) || candidate === 'free') continue;
    if (TIER_RANK[candidate] > TIER_RANK[best]) {
      best = candidate;
    }
  }

  return best;
}

export function hasEbookAccess(tier: AccessTier): boolean {
  return tier === 'ebook' || tier === 'coaching';
}

export function hasCoachingAccess(tier: AccessTier): boolean {
  return tier === 'coaching';
}

export function isPremiumAccess(tier: AccessTier): boolean {
  return hasEbookAccess(tier);
}

export function getAccessLabel(tier: AccessTier): string {
  if (tier === 'coaching') return 'Coaching 4 semaines actif';
  if (tier === 'ebook') return 'Hormones Sereine + Chat illimité';
  return 'Accès gratuit (10 questions)';
}

export function saveAccessTier(tier: AccessTier): AccessTier {
  if (typeof window === 'undefined' || tier === 'free') return tier;

  const current = readStoredAccessTier();
  const merged = resolveAccessTier(current, tier);

  localStorage.setItem(ACCESS_STORAGE_KEY, merged);
  if (!localStorage.getItem(ACCESS_SINCE_KEY)) {
    localStorage.setItem(ACCESS_SINCE_KEY, new Date().toISOString());
  }

  return merged;
}

export function readStoredAccessTier(): AccessTier {
  if (typeof window === 'undefined') return 'free';
  const stored = localStorage.getItem(ACCESS_STORAGE_KEY);
  return isAccessTier(stored) ? stored : 'free';
}

export function readAccessSince(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_SINCE_KEY);
}

export function clearStoredAccess(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_STORAGE_KEY);
  localStorage.removeItem(ACCESS_SINCE_KEY);
}