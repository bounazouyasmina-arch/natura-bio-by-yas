import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArticleCtaBand,
  DoteraPackCard,
  DOTERA_PACK_SOMMEIL,
  SimpleSiteFooter,
  SimpleSiteNav,
} from '@/components/SimpleSiteChrome';

export const metadata: Metadata = {
  title: "Blog santé au naturel | natura'bio by yas",
  description:
    'Articles sur la charge mentale, le sommeil, les hormones et les approches naturelles. Pistes concrètes + chat IA et coaching.',
};

const articles = [
  {
    id: 'charge-mentale',
    href: '/blog/charge-mentale-sans-culpabilite',
    tag: 'Charge mentale',
    title: 'Alléger la charge mentale sans culpabilité',
    teaser:
      'Organisation, émotions, relationnel : nommer ta charge et 5 pistes concrètes pour cette semaine.',
    featured: true,
  },
  {
    id: 'sommeil-hormones',
    href: '/blog#sommeil-hormones',
    tag: 'Sommeil',
    title: 'Mieux dormir naturellement',
    teaser: 'Lavande, respiration, rythme du soir : des leviers simples à combiner.',
  },
  {
    id: 'aromatherapie-sommeil',
    href: '/blog#aromatherapie-sommeil',
    tag: 'Aromathérapie',
    title: 'Aromathérapie pour le sommeil et la détente',
    teaser: 'Rituel roll-on + diffusion + souffle pour descendre en régime de repos.',
  },
  {
    id: 'approche-holistique',
    href: '/blog#approche-holistique',
    tag: 'Holistique',
    title: "L'approche holistique : corps, émotions et énergie",
    teaser: 'Pourquoi traiter un seul symptôme ne suffit souvent pas.',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2A3A32]">
      <SimpleSiteNav />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-10 sm:py-12">
        <div className="text-center mb-10 sm:mb-12">
          <div className="text-[#4A9B8C] text-sm tracking-[2px] font-medium mb-2">
            RESSOURCES &amp; ARTICLES
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">
            Le blog de natura&apos;bio by yas
          </h1>
          <p className="text-base sm:text-lg text-[#5A6B62] max-w-xl mx-auto leading-relaxed">
            Des articles concrets pour mieux comprendre ton corps, ta tête et ton rythme — puis passer
            à l&apos;action.
          </p>
        </div>

        {/* Article à la une (SEO) */}
        <Link
          href="/blog/charge-mentale-sans-culpabilite"
          className="block card rounded-3xl p-6 sm:p-8 mb-8 bg-white border-2 border-[var(--sage-600)]/25 hover:border-[var(--sage-600)] transition"
        >
          <div className="text-[10px] sm:text-xs font-semibold tracking-[1.5px] text-[var(--sage-600)] uppercase mb-2">
            À la une
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-2 leading-snug">
            Alléger la charge mentale sans culpabilité
          </h2>
          <p className="text-sm sm:text-[15px] text-[#5A6B62] leading-relaxed mb-4">
            Comprendre les 3 types de charge invisible et 5 pistes à tester cette semaine — sans te
            juger.
          </p>
          <span className="text-sm font-semibold text-[var(--sage-600)]">Lire l&apos;article →</span>
        </Link>

        <div className="grid sm:grid-cols-2 gap-4 mb-12">
          {articles
            .filter((a) => !a.featured)
            .map((a) => (
              <Link
                key={a.id}
                href={a.href}
                className="card rounded-3xl p-5 bg-white hover:border-[var(--sage-600)] border border-transparent transition"
              >
                <div className="text-[10px] font-semibold tracking-[1.5px] text-[#4A9B8C] uppercase mb-1">
                  {a.tag}
                </div>
                <div className="font-semibold text-[#2A3A32] mb-1 leading-snug">{a.title}</div>
                <p className="text-sm text-[#5A6B62] leading-relaxed">{a.teaser}</p>
              </Link>
            ))}
        </div>

        {/* Articles longs existants (ancres) */}
        <article id="approche-holistique" className="card rounded-3xl p-6 sm:p-8 mb-8 scroll-mt-24 bg-white">
          <div className="uppercase tracking-[2px] text-xs text-[#4A9B8C] mb-2">APPROCHE HOLISTIQUE</div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            L&apos;approche holistique : harmoniser corps, émotions et énergie
          </h2>
          <div className="space-y-3 text-sm sm:text-[15px] text-[#5A6B62] leading-relaxed">
            <p>
              Anxiété, insomnies, fatigue et troubles digestifs sont souvent interconnectés. L&apos;approche
              holistique agit sur le terrain plutôt que sur un seul symptôme : aromathérapie,
              respiration / nerf vague, alimentation, traditions chinoise et prophétique.
            </p>
            <p>
              Exemple : lavande le soir + respiration lente + infusion de mélisse, pratiqués
              régulièrement, aident souvent en 2–3 semaines.
            </p>
          </div>
          <div className="mt-5">
            <Link
              href="/espace?tab=chat&agent=globale"
              className="text-sm font-semibold text-[#4A9B8C] hover:underline"
            >
              → Poser ma question au chat IA
            </Link>
          </div>
        </article>

        <article id="sommeil-hormones" className="card rounded-3xl p-6 sm:p-8 mb-8 scroll-mt-24 bg-white">
          <div className="uppercase tracking-[2px] text-xs text-[#4A9B8C] mb-2">SOMMEIL NATUREL</div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            Mieux dormir naturellement
          </h2>
          <ul className="space-y-2 text-sm sm:text-[15px] text-[#5A6B62] leading-relaxed list-disc pl-5">
            <li>Diffusion de lavande 20–30 min avant le coucher</li>
            <li>Respiration 4-7-8 (quelques cycles)</li>
            <li>Écrans et repas lourds en moins en fin de soirée</li>
          </ul>
          <DoteraPackCard
            title="Pack sommeil doTERRA"
            description="Rituel simple pour accompagner l’endormissement :"
            href={DOTERA_PACK_SOMMEIL}
            details={[
              '30 min avant le coucher : 3–4 gouttes d’huile Serenity dans le diffuseur.',
              'Au moment de te mettre au lit : stick sous les pieds, poignets et nuque.',
              'Si tu veux encore plus d’effet : une petite inhalation de l’huile dans les mains juste avant d’éteindre.',
              'Astuce : n’en mets pas trop partout (peau + draps + diffuseur fort). L’odeur est déjà assez présente — commence léger, surtout la première nuit.',
            ]}
          />
        </article>

        <article id="aromatherapie-sommeil" className="card rounded-3xl p-6 sm:p-8 mb-8 scroll-mt-24 bg-white">
          <div className="uppercase tracking-[2px] text-xs text-[#4A9B8C] mb-2">AROMATHÉRAPIE</div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            Aromathérapie pour le sommeil et la détente
          </h2>
          <p className="text-sm sm:text-[15px] text-[#5A6B62] leading-relaxed mb-3">
            Roll-on dilué (huile végétale + lavande), diffusion le soir, et respiration lente en même
            temps. Privilégie les notes apaisantes plutôt que toniques la nuit.
          </p>
          <p className="text-sm text-[#5A6B62]">
            Le pack sommeil doTERRA est présenté dans l&apos;article{' '}
            <a href="#sommeil-hormones" className="font-semibold text-[#4A9B8C] hover:underline">
              Mieux dormir naturellement
            </a>
            .
          </p>
        </article>

        <article id="charge-mentale" className="card rounded-3xl p-6 sm:p-8 mb-8 scroll-mt-24 bg-white">
          <div className="uppercase tracking-[2px] text-xs text-[#4A9B8C] mb-2">CHARGE MENTALE</div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight mb-3">
            Alléger la charge mentale sans culpabilité
          </h2>
          <p className="text-sm sm:text-[15px] text-[#5A6B62] leading-relaxed mb-4">
            Version longue avec les 3 types de charge et 5 pistes détaillées.
          </p>
          <Link
            href="/blog/charge-mentale-sans-culpabilite"
            className="text-sm font-semibold text-[#4A9B8C] hover:underline"
          >
            → Lire l&apos;article complet
          </Link>
        </article>

        <ArticleCtaBand />
      </div>

      <SimpleSiteFooter />
    </div>
  );
}
