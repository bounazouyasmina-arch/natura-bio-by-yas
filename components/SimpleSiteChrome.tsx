import Link from 'next/link';
import type { ReactNode } from 'react';

const BEACONS_DISCOVERY_CALL_LINK =
  'https://shop.beacons.ai/yas_digital/bd259c7a-68ac-41c9-b9e4-6cb05237713c';
const BEACONS_EBOOK_LINK =
  'https://shop.beacons.ai/yas_digital/44ca0203-408c-489d-b6d3-0a5c0af4fee2';

export function SimpleSiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-[#E6EDE9] bg-[#F9F6F0]/95 backdrop-blur-md">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2 sm:gap-3 min-w-0">
          <img src="/natura-bio-logo.jpg" alt="natura'bio" className="h-8 w-auto shrink-0" />
          <span className="font-semibold text-sm sm:text-base truncate">natura&apos;bio by yas</span>
        </Link>
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm shrink-0">
          <Link href="/blog" className="hover:text-[#4A9B8C] hidden sm:inline">
            Blog
          </Link>
          <Link href="/espace?tab=chat" className="hover:text-[#4A9B8C] font-medium text-[var(--sage-600)]">
            Chat gratuit
          </Link>
          <Link href="/" className="hover:text-[#4A9B8C]">
            Accueil
          </Link>
        </div>
      </div>
    </nav>
  );
}

export function SimpleSiteFooter() {
  return (
    <footer className="border-t border-[#E6EDE9] bg-white py-8 mt-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 text-center text-xs text-[#5A6B62] space-y-3">
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
          <Link href="/mentions-legales" className="hover:text-[#2A3A32]">
            Mentions légales
          </Link>
          <Link href="/confidentialite" className="hover:text-[#2A3A32]">
            Confidentialité
          </Link>
          <Link href="/cgv" className="hover:text-[#2A3A32]">
            CGV
          </Link>
          <Link href="/avertissement-sante" className="hover:text-[#2A3A32]">
            Avertissement santé
          </Link>
        </div>
        <p>© {new Date().getFullYear()} natura&apos;bio by yas — Tous droits réservés</p>
        <p>
          <a href="mailto:contact@naturabioyas.fr" className="hover:text-[#2A3A32] underline">
            contact@naturabioyas.fr
          </a>
        </p>
      </div>
    </footer>
  );
}

export function ArticleCtaBand({ chatAgent = 'emotion' }: { chatAgent?: string }) {
  return (
    <div className="mt-8 rounded-3xl border border-[#E6EDE9] bg-white p-5 sm:p-6 space-y-4">
      <p className="text-sm sm:text-base text-[#2A3A32] font-semibold leading-snug">
        Envie d&apos;aller plus loin maintenant ?
      </p>
      <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
        <Link
          href={`/espace?tab=chat&agent=${chatAgent}`}
          className="btn-primary px-5 py-3 rounded-2xl text-sm font-semibold text-center"
        >
          Poser ma question au chat (5 gratuites)
        </Link>
        <a
          href={BEACONS_EBOOK_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-2xl text-sm font-semibold text-center border border-[var(--sage-600)] text-[var(--sage-600)] hover:bg-[#F4F7F5]"
        >
          Hormones Sereine — 9,99 €
        </a>
        <a
          href={BEACONS_DISCOVERY_CALL_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="px-5 py-3 rounded-2xl text-sm font-semibold text-center border border-[#C5A46E] text-[#8A6E3A] hover:bg-[#FBF7F0]"
        >
          Appel découverte gratuit
        </a>
      </div>
    </div>
  );
}

/** Recommandation douce pack doTERRA liée à un thème d’article */
export function DoteraPackCard({
  title,
  description,
  href,
  details,
}: {
  title: string;
  description: string;
  href: string;
  /** Explications du pack (points clés) */
  details?: string[];
}) {
  return (
    <div className="mt-6 rounded-2xl border border-[#E8D9B8] bg-[#FBF7F0] px-4 py-4 sm:px-5 sm:py-5">
      <p className="text-[10px] sm:text-xs font-semibold tracking-[1.5px] text-[#8A6E3A] uppercase mb-1">
        Pour aller plus loin · doTERRA
      </p>
      <p className="font-semibold text-[#2A3A32] text-sm sm:text-base">{title}</p>
      <p className="text-sm text-[#5A6B62] leading-relaxed mt-1">{description}</p>
      {details && details.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-sm text-[#5A6B62] list-disc pl-5 leading-relaxed">
          {details.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
      )}
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex mt-3 text-sm font-semibold text-[#8A6E3A] hover:underline"
      >
        Voir le pack sommeil →
      </a>
    </div>
  );
}

export const DOTERA_PACK_SOMMEIL = 'https://doterra.me/ZSFO1F';

export function LegalPageShell({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2A3A32]">
      <SimpleSiteNav />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-6 sm:mb-8">{title}</h1>
        <div className="card rounded-3xl p-5 sm:p-8 bg-white space-y-4 text-sm sm:text-[15px] text-[#5A6B62] leading-relaxed">
          {children}
        </div>
        <p className="mt-6 text-sm">
          <Link href="/" className="text-[var(--sage-600)] font-medium hover:underline">
            ← Retour à l&apos;accueil
          </Link>
        </p>
      </div>
      <SimpleSiteFooter />
    </div>
  );
}
