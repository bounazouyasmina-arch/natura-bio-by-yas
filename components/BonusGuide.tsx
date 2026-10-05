'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SimpleSiteFooter, SimpleSiteNav } from '@/components/SimpleSiteChrome';
import { BONUS_GUIDES } from '@/lib/bonus-guides';
import { hasEbookAccess, readStoredAccessTier, type AccessTier } from '@/lib/member-access';

const BEACONS_EBOOK_LINK =
  'https://shop.beacons.ai/yas_digital/44ca0203-408c-489d-b6d3-0a5c0af4fee2';

function GuideBody({ variant }: { variant: 'anxiete' | 'aliments' }) {
  const slug = variant === 'anxiete' ? 'anxiete' : 'aliments';
  const label =
    variant === 'anxiete'
      ? 'Guide Anxiété et stress'
      : 'Guide Aliments et leurs symptômes';

  return (
    <div className="space-y-3">
      <a
        href={`/api/download/guide?slug=${slug}`}
        download
        className="inline-flex text-sm font-semibold text-[var(--sage-600)] hover:underline"
      >
        Télécharger le PDF
      </a>
      <iframe
        title={label}
        src={`/api/download/guide?slug=${slug}`}
        className="w-full h-[75vh] min-h-[32rem] rounded-2xl border border-[#E6EDE9] bg-white"
      />
    </div>
  );
}

const GUIDE_COPY = {
  anxiete: {
    title: 'Anxiété & stress',
    href: '/guides/anxiete-stress',
    intro:
      'Anxiété, stress : et si ton corps avait sa part d’explication ? Ton guide Natura’bio, à lire ici ou à télécharger.',
  },
  aliments: {
    title: 'Aliments et leurs symptômes',
    href: '/guides/aliments-symptomes',
    intro:
      'Ces aliments du quotidien qui pourraient entretenir tes symptômes. Ton guide Natura’bio, à lire ici ou à télécharger.',
  },
} as const;

export function BonusGuide({ variant }: { variant: 'anxiete' | 'aliments' }) {
  const copy = GUIDE_COPY[variant];
  const [tier, setTier] = useState<AccessTier | null>(null);

  useEffect(() => {
    let cancelled = false;
    const stored = readStoredAccessTier();

    if (hasEbookAccess(stored)) {
      setTier(stored);
    }

    void fetch('/api/access/status')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { tier?: AccessTier } | null) => {
        if (cancelled) return;
        if (data?.tier === 'ebook' || data?.tier === 'coaching') {
          setTier(data.tier);
          return;
        }
        setTier(stored);
      })
      .catch(() => {
        if (!cancelled) setTier(stored);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const unlocked = tier !== null && hasEbookAccess(tier);
  const others = BONUS_GUIDES.filter((guide) => guide.href !== copy.href);

  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2A3A32]">
      <SimpleSiteNav />
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
        <p className="text-[11px] uppercase tracking-[2px] text-[var(--sage-600)] mb-3">
          🎁 Guide offert · accès illimité
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">{copy.title}</h1>
        <p className="text-[#5A6B62] leading-relaxed mb-8">{copy.intro}</p>

        {tier === null ? (
          <p className="text-sm text-[#5A6B62]">Chargement…</p>
        ) : unlocked ? (
          <article className="card rounded-3xl bg-white p-5 sm:p-8 space-y-8 text-[15px] leading-relaxed">
            <GuideBody variant={variant} />
            <p className="text-xs text-[#5A6B62] border-t border-[#E6EDE9] pt-4">
              Guide éducatif. Il ne remplace pas un avis médical. En cas de symptômes
              invalidants, grossesse, traitement ou doute, consulte un professionnel de santé.
            </p>
          </article>
        ) : (
          <div className="card rounded-3xl bg-white p-5 sm:p-8 space-y-4">
            <p className="leading-relaxed">
              Ce guide est offert avec <strong>Hormones Sereine</strong> (9,99 €), en plus
              de l&apos;ebook et du chat illimité.
            </p>
            <a
              href={BEACONS_EBOOK_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex px-5 py-3 rounded-2xl text-sm font-semibold"
            >
              Débloquer l&apos;accès illimité · 9,99 €
            </a>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-3 text-sm">
          <Link href="/espace" className="font-semibold text-[var(--sage-600)] hover:underline">
            Retour à l&apos;espace membres
          </Link>
          {others.map((guide) => (
            <Link key={guide.href} href={guide.href} className="text-[#5A6B62] hover:underline">
              {guide.emoji} {guide.title}
            </Link>
          ))}
        </div>
      </main>
      <SimpleSiteFooter />
    </div>
  );
}
