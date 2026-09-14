import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArticleCtaBand,
  SimpleSiteFooter,
  SimpleSiteNav,
} from '@/components/SimpleSiteChrome';

export const metadata: Metadata = {
  title: "Alléger la charge mentale sans culpabilité | natura'bio by yas",
  description:
    'Comprendre la charge mentale (organisationnelle, émotionnelle, relationnelle) et des pistes concrètes pour poser des limites sans culpabiliser. Chat IA, ebook et coaching.',
  openGraph: {
    title: 'Alléger la charge mentale sans culpabilité',
    description:
      'Pistes concrètes pour alléger la charge invisible : limites, rumination, récupération. Approche naturelle et bienveillante.',
    locale: 'fr_FR',
    type: 'article',
  },
};

export default function ChargeMentaleArticlePage() {
  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#2A3A32]">
      <SimpleSiteNav />

      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-10 sm:py-14">
        <p className="text-[#4A9B8C] text-xs tracking-[2px] font-medium uppercase mb-3">
          Charge mentale &amp; émotions
        </p>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight leading-tight mb-4">
          Alléger la charge mentale sans culpabilité
        </h1>
        <p className="text-[#5A6B62] text-base sm:text-lg leading-relaxed mb-8">
          La charge mentale n&apos;est pas un manque d&apos;organisation. C&apos;est souvent une charge
          invisible : décisions, émotions des autres, perfectionnisme, et la peur de décevoir.
        </p>

        <div className="card rounded-3xl p-5 sm:p-8 bg-white space-y-5 text-[15px] text-[#5A6B62] leading-relaxed">
          <p>
            Beaucoup de femmes (étudiantes, mamans, actives, en transition) décrivent la même chose :
            la tête qui tourne le soir, la difficulté à dire non, la sensation de tout porter… puis la
            culpabilité dès qu&apos;elles s&apos;arrêtent.
          </p>

          <h2 className="text-xl font-semibold text-[#2A3A32] pt-2">
            3 types de charge (pour cibler la bonne piste)
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong className="text-[#2A3A32]">Organisationnelle</strong> : listes, RDV, courses,
              micro-décisions.
            </li>
            <li>
              <strong className="text-[#2A3A32]">Émotionnelle</strong> : rumination, anxiété, « je
              devrais ».
            </li>
            <li>
              <strong className="text-[#2A3A32]">Relationnelle</strong> : réguler tout le monde,
              anticiper les conflits, être « la fiable ».
            </li>
          </ul>
          <p>
            Si tu traites une rumination comme un problème de planning, tu te fatigues sans te
            soulager. Nommer le type de charge, c&apos;est déjà alléger.
          </p>

          <h2 className="text-xl font-semibold text-[#2A3A32] pt-2">
            5 pistes concrètes (à tester cette semaine)
          </h2>
          <ol className="list-decimal pl-5 space-y-3">
            <li>
              <strong className="text-[#2A3A32]">Le non en une phrase</strong> : « Je ne peux pas ce
              jour-là. » Sans roman, sans te justifier trois fois.
            </li>
            <li>
              <strong className="text-[#2A3A32]">Le brain dump du soir</strong> : 5 minutes pour tout
              écrire (tâches + peurs). La tête descend quand le papier porte.
            </li>
            <li>
              <strong className="text-[#2A3A32]">Une micro-récupération protégée</strong> : 10 minutes
              sans téléphone, notées comme un vrai rendez-vous.
            </li>
            <li>
              <strong className="text-[#2A3A32]">Séparer « urgent » et « important pour les
              autres »</strong> : ce qui est urgent pour quelqu&apos;un d&apos;autre n&apos;est pas
              toujours ta priorité.
            </li>
            <li>
              <strong className="text-[#2A3A32]">Ancrage corps</strong> : 4 cycles de respiration lente
              (inspire 4, expire 6) avant de répondre à un message stressant.
            </li>
          </ol>

          <h2 className="text-xl font-semibold text-[#2A3A32] pt-2">
            Quand le gratuit ne suffit plus
          </h2>
          <p>
            Le chat IA de natura&apos;bio t&apos;aide à clarifier et à repartir avec des pistes. Si tu
            sens que « comprendre » ne change pas ton quotidien, un{' '}
            <strong className="text-[#2A3A32]">appel découverte gratuit</strong> ou le{' '}
            <strong className="text-[#2A3A32]">coaching 4 semaines</strong> permet un suivi humain :
            limites, protocole, et quelqu&apos;un qui te relit semaine après semaine.
          </p>

          <p className="text-xs text-[#8A9A92] border-t border-[#E6EDE9] pt-4">
            Contenu éducatif — ne remplace pas un avis médical ou un accompagnement thérapeutique si tu
            es en détresse. En cas de mal-être important, contacte un professionnel de santé.
          </p>
        </div>

        <ArticleCtaBand />

        <p className="mt-8 text-sm text-[#5A6B62]">
          <Link href="/blog" className="text-[var(--sage-600)] font-medium hover:underline">
            ← Tous les articles
          </Link>
        </p>
      </article>

      <SimpleSiteFooter />
    </div>
  );
}
