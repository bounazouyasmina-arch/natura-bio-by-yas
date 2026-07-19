"use client";

import React, { useState, useEffect } from 'react';
import { 
  Leaf, Heart, Wind, Apple, BookOpen, Flame, Brain, 
  Users, ArrowRight, Check, Star, Shield 
} from 'lucide-react';
// === LIENS BEACONS (ventes) ===
// Structure simple :
// - Gratuit : 10 questions + forum
// - Ebook 9,99 € : accès illimité au chat IA + forum (idéal pour la ménopause & hormones)
// - Coaching 299,99 € : accompagnement personnalisé 4 semaines
const BEACONS_EBOOK_LINK = "https://shop.beacons.ai/yas_digital/44ca0203-408c-489d-b6d3-0a5c0af4fee2";
const BEACONS_COACHING_LINK = "https://shop.beacons.ai/yas_digital/d3e9837a-e734-4b80-8243-479d6c1f0213";

// Lien du groupe WhatsApp que tu as mis sur ton offre Beacons (pour le coaching)
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/IdGLaitmNJFFBtoduhDMdi";

// Pool LARGE et TRÈS VARIÉ pour TOUT public (jeunes et adultes) - santé au naturel générale
const articlePool = [
  { title: "L'approche holistique", slug: "approche-holistique", teaser: "Harmoniser corps, esprit et émotions au quotidien." },
  { title: "La science valide les traditions", slug: "racines-traditionnelles", teaser: "Plantes et remèdes ancestraux validés par les études." },
  { title: "Tu n'es pas seule", slug: "tu-nes-pas-seule", teaser: "La force du soutien émotionnel et collectif." },
  { title: "Mieux dormir naturellement", slug: "sommeil-hormones", teaser: "Protocoles pour des nuits réparatrices à tout âge." },
  { title: "Alléger la charge mentale sans culpabilité", slug: "charge-mentale", teaser: "Poser des limites avec douceur et efficacité." },
  { title: "Aromathérapie pour le sommeil", slug: "aromatherapie-sommeil", teaser: "Huiles essentielles pour des nuits paisibles." },
  { title: "Huiles pour calmer l'anxiété", slug: "aromatherapie-bouffees", teaser: "Synergies douces pour apaiser le mental." },
  { title: "Naturopathie pour l'énergie vitale", slug: "naturopathie-energie", teaser: "Remèdes pour retrouver vitalité et clarté." },
  { title: "Respiration et nerf vague", slug: "respiration-nerf-vague", teaser: "Techniques pour calmer l'anxiété et l'inflammation." },
  { title: "Alimentation pour l'énergie", slug: "alimentation-hormones", teaser: "Nutrition pour plus d'énergie et clarté mentale." },
  { title: "Huiles contre l'anxiété", slug: "aromatherapie-anxiete", teaser: "Synergies douces pour apaiser le mental rapidement." },
  { title: "Points d'acupression MTC", slug: "mtc-bouffees", teaser: "Gestes simples de médecine chinoise pour l'énergie et la digestion." },
  { title: "Nigelle & remèdes prophétiques", slug: "prophetique-nigelle", teaser: "Le trésor du Prophète ﷺ pour l'immunité et le bien-être." },
  { title: "Alimentation anti-inflammatoire", slug: "alimentation-inflammatoire", teaser: "Ce qu'il faut manger pour calmer l'inflammation et l'énergie." },
  { title: "Soutien naturel de l'énergie", slug: "libido-hormones", teaser: "Plantes, huiles et habitudes pour plus de vitalité." },
  { title: "Gérer le poids naturellement", slug: "poids-menopause", teaser: "Stratégies douces et durables sans frustration." },
  { title: "Magnésium et nutriments clés", slug: "magnesium-hormones", teaser: "Le minéral souvent manquant qui change tout." },
  { title: "Respiration pour les émotions", slug: "respiration-emotions", teaser: "Calmer le stress et les émotions en quelques minutes." },
  { title: "Énergie et fatigue chronique", slug: "thyroide-fatigue", teaser: "Solutions naturelles pour retrouver vitalité." },
  { title: "Digestion & ballonnements", slug: "digestion-hormones", teaser: "Solutions naturelles pour un ventre léger et une meilleure digestion." },
];

function getDailyArticles() {
  const mainSlugs = ['approche-holistique', 'racines-traditionnelles', 'tu-nes-pas-seule'];
  let filtered = articlePool.filter(a => !mainSlugs.includes(a.slug));
  // Full random shuffle for true variety each visit (not date-based)
  for (let i = filtered.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
  }
  return filtered.slice(0, 3);
}

function DynamicArticleSuggestions() {
  const [articles, setArticles] = useState<{title: string; slug: string; teaser: string}[]>([]);

  useEffect(() => {
    // Random shuffle on each page load for true variety per visit
    setArticles(getDailyArticles());
  }, []);

  const refreshSuggestions = () => {
    setArticles(getDailyArticles());
  };

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-4">
        {articles.map((art, idx) => (
          <a 
            key={idx} 
            href={`/blog#${art.slug}`} 
            className="card p-5 hover:border-[var(--mint)] transition group"
          >
            <div className="text-xs text-[var(--mint)] mb-1">À LIRE</div>
            <div className="font-semibold mb-1 group-hover:text-[var(--mint)] transition">{art.title}</div>
            <p className="text-sm text-[#5A6B62]">{art.teaser}</p>
            <span className="text-xs text-[var(--mint)] mt-2 inline-block">Lire l'article →</span>
          </a>
        ))}
      </div>
      <button 
        onClick={refreshSuggestions}
        className="mt-3 text-sm text-[var(--mint)] hover:underline"
      >
        ↻ Voir d'autres suggestions aléatoires
      </button>
    </div>
  );
}

const pillars = [
  { 
    icon: Leaf, 
    emoji: '🌸', 
    title: "Aromathérapie", 
    desc: "Calmer l'anxiété, retrouver un sommeil profond et apaiser les tensions avec des synergies d'huiles essentielles sûres.",
    color: '#7EC8B3',  // mint
    iconBg: '#E8F5F2'
  },
  { 
    icon: Heart, 
    emoji: '🌱', 
    title: "Naturopathie", 
    desc: "Renforcer ton terrain, drainer en douceur et retrouver une vitalité durable avec des remèdes naturels.",
    color: '#4F6B5F',  // sage
    iconBg: '#E8F0E9'
  },
  { 
    icon: Wind, 
    emoji: '💨', 
    title: "Respiration & Nerf Vague", 
    desc: "Réguler ton système nerveux, réduire l'inflammation et sortir du mode « toujours en alerte ».",
    color: '#7EC8B3',  // mint
    iconBg: '#E8F5F2'
  },
  { 
    icon: Apple, 
    emoji: '🍎', 
    title: "Alimentation Thérapeutique", 
    desc: "Nutrition anti-inflammatoire, cycle syncing et micronutrition ciblée pour plus d'énergie et d'équilibre.",
    color: '#E8B4BC',  // blush
    iconBg: '#FDF2F4'
  },
  { 
    icon: BookOpen, 
    emoji: '📖', 
    title: "Médecine Prophétique", 
    desc: "Miel, nigelle, henné, jeûne et remèdes ancestraux du Prophète ﷺ pour le corps et l'esprit.",
    color: '#C5A46E',  // gold
    iconBg: '#F7F0E6'
  },
  { 
    icon: Flame, 
    emoji: '☯️', 
    title: "Médecine Traditionnelle Chinoise", 
    desc: "Équilibrer le Qi, les méridiens et adapter ton alimentation aux saisons pour un mieux-être global.",
    color: '#E8B4BC',  // blush
    iconBg: '#FDF2F4'
  },
  { 
    icon: Brain, 
    emoji: '🌙', 
    title: "Régulation Hormonale", 
    desc: "Soutenir ton équilibre hormonal, ton énergie, ta thyroïde et ton bien-être général avec des approches naturelles douces.",
    color: '#7EC8B3',  // mint
    iconBg: '#E8F5F2'
  },
  { 
    icon: Shield, 
    emoji: '🌿', 
    title: "Approche Intégrative", 
    desc: "Combiner avec discernement toutes les sagesses pour des protocoles cohérents, sûrs et vraiment efficaces.",
    color: '#4F6B5F',  // sage
    iconBg: '#E8F0E9'
  },
];

const testimonials = [
  {
    name: "Amina K.",
    role: "Coach & maman de 3 enfants",
    quote: "L'ebook sur la ménopause m'a ouvert les yeux. Les réponses de l'IA sur les huiles et le nerf vague ont changé ma qualité de sommeil en 10 jours.",
  },
  {
    name: "Fatima B.",
    role: "Enseignante, 52 ans",
    quote: "Le coaching 4 semaines a été transformateur. J'ai enfin un protocole qui respecte ma foi et ma physiologie. Les échanges sur WhatsApp... enfin je me sens accompagnée.",
  },
  {
    name: "Leila S.",
    role: "Infirmière",
    quote: "J'adore le forum. On pose des questions sans jugement et l'IA ou d'autres femmes répondent avec des pistes concrètes en aromathérapie et MTC. Très puissant.",
  },
];

export default function NaturaBioByYasLanding() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--cream)] text-[#2A3A32]">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-[#E6EDE9] bg-[var(--cream)]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <a href="/" className="flex flex-col items-start shrink-0">
            <img 
              src="/natura-bio-logo.jpg" 
              alt="natura'bio by yas" 
              className="h-14 sm:h-16 md:h-20 w-auto" 
            />
            <div className="text-[10px] sm:text-[11px] font-medium tracking-tight text-[var(--sage-600)] mt-0.5">by yas · santé au naturel</div>
          </a>

          <div className="hidden lg:flex items-center gap-6 text-sm font-medium">
            <a href="#approche" className="hover:text-[var(--mint)] transition">L&apos;approche</a>
            <a href="/bilan" className="hover:text-[var(--mint)] transition">Bilan gratuit</a>
            <a href="#comment" className="hover:text-[var(--mint)] transition">Comment ça marche</a>
            <a href="#tarifs" className="hover:text-[var(--mint)] transition">Offres</a>
            <a href="/blog" className="hover:text-[var(--mint)] transition">Blog</a>
            <a href="/espace" className="hover:text-[var(--mint)] transition">Espace</a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <a 
              href="/espace" 
              className="hidden sm:inline-flex rounded-full px-4 py-2 text-sm font-medium border border-[var(--mint)] hover:bg-[var(--mint)] hover:text-white transition"
            >
              Espace membres
            </a>
            <a 
              href="#tarifs"
              className="btn-primary rounded-full px-4 sm:px-6 py-2 text-sm font-semibold"
            >
              Voir les offres
            </a>
            <button
              type="button"
              className="lg:hidden p-2 rounded-xl border border-[#E6EDE9] text-[#2A3A32]"
              aria-label="Menu"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
        {mobileOpen && (
          <div className="lg:hidden border-t border-[#E6EDE9] bg-white px-4 py-4 flex flex-col gap-3 text-sm font-medium">
            <a href="#approche" onClick={() => setMobileOpen(false)}>L&apos;approche</a>
            <a href="/bilan" onClick={() => setMobileOpen(false)}>Bilan gratuit</a>
            <a href="#comment" onClick={() => setMobileOpen(false)}>Comment ça marche</a>
            <a href="#tarifs" onClick={() => setMobileOpen(false)}>Offres</a>
            <a href="/blog" onClick={() => setMobileOpen(false)}>Blog</a>
            <a href="/espace" onClick={() => setMobileOpen(false)}>Espace membres</a>
            <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer">Groupe WhatsApp (coaching)</a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="relative mx-auto max-w-5xl px-4 sm:px-6 pt-12 sm:pt-16 pb-12 sm:pb-16 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-10 left-1/4 h-40 w-40 rounded-full bg-[var(--mint)]/15 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-48 w-48 rounded-full bg-[var(--blush)]/20 blur-3xl" />
        </div>

        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-white border border-[var(--border-soft)] px-4 py-1.5 text-[11px] sm:text-xs font-medium tracking-[1.5px] text-[var(--sage-600)] mb-6 shadow-sm">
          <span>NATUREL</span>
          <span className="text-[#C9D6D0]">·</span>
          <span>SCIENCE</span>
          <span className="text-[#C9D6D0]">·</span>
          <span>FOI &amp; RESPECT</span>
        </div>

        <h1 className="text-[2.35rem] sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.08] mb-5 max-w-3xl mx-auto">
          Ta santé au naturel,<br />
          <span className="text-[var(--sage-600)]">guidée par 9 expertes IA</span>
        </h1>

        <p className="mx-auto max-w-2xl text-base sm:text-lg text-[#5A6B62] mb-3">
          Stress, sommeil, énergie, hormones, charge mentale… pose ta question.
          Reçois des protocoles concrets (huiles, plantes, respiration, MTC, remèdes ancestraux).
        </p>
        <p className="mx-auto max-w-xl text-sm sm:text-base text-[#5A6B62] mb-8">
          <strong className="text-[#2A3A32]">Gratuit :</strong> 10 questions + forum.
          <strong className="text-[#2A3A32]"> Illimité :</strong> ebook 9,99 €.
          <strong className="text-[#2A3A32]"> Sur-mesure :</strong> coaching 299,99 €.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <a 
            href="/espace" 
            className="btn-primary flex items-center justify-center gap-2 rounded-full px-8 py-3.5 sm:py-4 text-base sm:text-lg font-semibold shadow-sm"
          >
            Essayer le chat IA gratuitement <ArrowRight className="h-4 w-4" />
          </a>
          <a 
            href="/bilan" 
            className="btn-secondary flex items-center justify-center gap-2 rounded-full px-8 py-3.5 sm:py-4 text-base sm:text-lg font-semibold"
          >
            Faire mon bilan (2 min)
          </a>
        </div>

        <p className="mt-5 text-sm text-[#5A6B62]">
          Sans carte bancaire · Sans engagement · Réponses en français
        </p>
      </section>

      {/* CONFIANCE */}
      <div className="border-y border-[#E6EDE9] bg-white py-6">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-[#5A6B62]">
          <div className="flex items-start gap-2"><span className="text-xl">✨</span> <div><strong className="text-[#2A3A32]">9 expertes IA</strong><br />spécialités distinctes</div></div>
          <div className="flex items-start gap-2"><span className="text-xl">📖</span> <div><strong className="text-[#2A3A32]">Ebook 9,99 €</strong><br />chat illimité inclus</div></div>
          <div className="flex items-start gap-2"><span className="text-xl">🕊️</span> <div><strong className="text-[#2A3A32]">Respect de la foi</strong><br />&amp; approches douces</div></div>
          <div className="flex items-start gap-2"><span className="text-xl">💬</span> <div><strong className="text-[#2A3A32]">10 questions offertes</strong><br />pour tester sans risque</div></div>
        </div>
      </div>

      {/* BIENVENUE - Compagnon au naturel */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">natura’bio by yas est ton compagnon santé au naturel.</h2>
          <p className="text-lg text-[#5A6B62] mb-6">
            Tu poses une question sur ton énergie, ton sommeil, ton stress, ton cycle ou ta charge mentale…<br />
            9 sagesses IA te répondent avec des conseils précis, concrets et respectueux de ta foi et de ton corps.
          </p>

          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 text-[#5A6B62]">
            <div>💡 <strong>Chaque question sous plusieurs angles</strong> — 9 visions pour une réponse riche.</div>
            <div>🎯 <strong>Des protocoles concrets</strong> — dosages, synergies, étapes claires et applicables.</div>
            <div>🧠 <strong>Charge mentale &amp; émotions</strong> — une section dédiée pour poser ce qui pèse vraiment.</div>
            <div>🌿 <strong>Approche intégrative</strong> — aromathérapie, MTC, prophétique, nerf vague, hormones, naturopathie…</div>
          </div>

          <p className="mt-6 text-[#5A6B62]">
            Ici tu n’es plus seule. Commence par le chat gratuit et vois par toi-même.
          </p>
        </div>
      </section>

      {/* LES 8 + 1 SAGesses */}
      <section id="approche" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <div className="text-[var(--mint)] font-medium tracking-[3px] text-sm mb-2">UNE APPROCHE INTÉGRATIVE</div>
          <h2 className="text-5xl font-semibold tracking-tight" style={{color: 'var(--sage-500)'}}>Huit sagesses pour comprendre et agir</h2>
          <p className="mt-3 max-w-md mx-auto text-[#5A6B62]">
            Chaque tradition apporte des réponses uniques. L&apos;IA les maîtrise et les combine avec respect et précision. Plus une section complète sur la charge mentale et les émotions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={index} 
                className="feature-card card rounded-3xl p-7 flex flex-col group"
                style={{ borderLeft: `5px solid ${pillar.color}` }}
              >
                <div 
                  className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-110"
                  style={{ backgroundColor: pillar.iconBg }}
                >
                  <Icon className="h-7 w-7" style={{ color: pillar.color }} />
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl">{pillar.emoji}</span>
                  <h3 className="font-semibold text-xl tracking-tight">{pillar.title}</h3>
                </div>
                <p className="text-[#5A6B62] text-[15px] leading-relaxed">{pillar.desc}</p>
                <div className="mt-auto pt-3 text-xs text-[var(--sage-600)] opacity-70 group-hover:opacity-100 transition">Explorer →</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* NOTRE APPROCHE - plus cara-like : propre, moderne, visuel */}
      <section className="mx-auto max-w-5xl px-6 py-16 bg-white rounded-3xl border border-[var(--border-soft)]">
        <div className="text-center mb-10">
          <div className="text-[var(--mint)] text-sm tracking-[2px] font-medium mb-1">NOTRE MISSION</div>
          <h2 className="text-3xl font-semibold tracking-tight" style={{color: 'var(--sage-500)'}}>Accompagner chacun avec douceur, science et sagesse ancestrale</h2>
          <p className="mt-3 text-[#5A6B62] max-w-lg mx-auto">Allier les approches naturelles (aromathérapie, MTC, naturopathie, médecine prophétique...) à une écoute bienveillante de ton corps et de ton esprit.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "🌿", title: "Approche holistique", desc: "Corps, émotions, hormones et spiritualité sont liés. On ne traite pas un symptôme isolé." },
            { icon: "🔬", title: "Racines traditionnelles + science", desc: "Sagesse ancestrale validée par des études modernes sur les plantes, le nerf vague et les hormones." },
            { icon: "🤝", title: "Tu n'es pas seule", desc: "Communauté, IA expertes et accompagnement humain quand tu en as besoin." }
          ].map((item, i) => {
            const slugs = ['approche-holistique', 'racines-traditionnelles', 'tu-nes-pas-seule'];
            return (
              <a 
                key={i} 
                href={`/blog#${slugs[i]}`} 
                className="feature-card card p-6 flex flex-col items-center text-center border-l-4 no-underline hover:no-underline" 
                style={{ borderColor: i === 1 ? 'var(--blush)' : 'var(--mint)' }}
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="font-semibold text-lg mb-2 tracking-tight">{item.title}</div>
                <p className="text-sm text-[#5A6B62] leading-relaxed">{item.desc}</p>
                <span className="mt-3 text-xs text-[var(--mint)]">Lire l'article →</span>
              </a>
            );
          })}
        </div>

        {/* SUGGESTIONS QUI CHANGENT - variété supplémentaire (articles différents des 3 cartes principales) */}
        <div className="mt-8 mb-12">
          <div className="text-center mb-6">
            <div className="text-[var(--mint)] text-sm tracking-[2px] font-medium mb-1">AUTRES ARTICLES VARIÉS AUJOURD'HUI</div>
            <h3 className="text-2xl font-semibold tracking-tight">Conseils frais (différents des thèmes ci-dessus)</h3>
            <p className="text-[#5A6B62] mt-1">Nouveauté quotidienne pour ne pas voir toujours la même chose.</p>
          </div>

          <DynamicArticleSuggestions />
        </div>
      </section>

      {/* EXEMPLES CONCRETS (inspiré de lucis) */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="text-center mb-8">
          <div className="text-[var(--mint)] text-sm tracking-[2px] font-medium mb-1">DES RÉPONSES QUI PARLENT VRAI</div>
          <h3 className="text-2xl font-semibold tracking-tight">Exemples de questions que les gens posent</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {[
            "Pourquoi je craque à 15h tous les jours ?",
            "Comment calmer l'anxiété et le stress naturellement ?",
            "J’ai tout le temps la charge mentale, comment poser des limites ?",
            "Insomnies malgré la fatigue : que faire avec les huiles et la respiration ?",
            "Comment booster mon énergie et mon immunité naturellement ?",
            "Je me sens vidée émotionnellement, quels outils en MTC et naturopathie ?"
          ].map((q, i) => (
            <div key={i} className="feature-card card rounded-2xl px-5 py-4 text-[#5A6B62] border border-[var(--border-soft)]">
              « {q} »
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-4 text-[#5A6B62]">L’IA te répond avec des protocoles précis. Tu peux aller plus loin avec l’ebook ou le coaching.</p>
      </section>

      {/* SECTION ÉMOTIONNELLE & CHARGE MENTALE - MISE EN AVANT (9e section visuelle) */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div 
          className="feature-card rounded-3xl p-10 md:p-14 border"
          style={{ 
            backgroundColor: '#FDF2F4', /* using blush var in css */
            borderColor: 'var(--blush)' 
          }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <div 
                className="inline-block text-xs tracking-[3px] font-medium mb-2 px-3 py-0.5 rounded-full"
                style={{ backgroundColor: '#E6E1F5', color: '#6C6B9A' }}
              >
                LE PILIER SOUVENT OUBLIÉ
              </div>
              <h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4" style={{ color: '#4A455F' }}>
                Santé Mentale &amp; Charge Invisible
              </h2>
              <p className="text-[#5A6B62] text-lg mb-6">
                Le corps parle quand l’esprit se tait. Ici on ne « gère » pas seulement le stress : on cartographie la vraie charge mentale, l’épuisement invisible et on pose des outils concrets pour reprendre de l’espace.
              </p>
              <a 
                href="/espace" 
                className="inline-flex items-center gap-2 rounded-full px-8 py-3 font-semibold text-white"
                style={{ backgroundColor: '#6C6B9A' }}
              >
                Explorer la section Émotionnelle <ArrowRight className="h-4 w-4" />
              </a>
            </div>

            <div className="space-y-4 text-[#5A6B62]">
              <div className="flex gap-3">
                <span className="text-2xl">🧠</span>
                <p><strong>Cartographie précise</strong> de ta charge mentale (tâches, émotions, décisions, culpabilité)</p>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🔄</span>
                <p><strong>Protocoles concrets</strong> sur 3 à 6 semaines pour poser des limites et alléger durablement</p>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">💬</span>
                <p><strong>Outils émotionnels avancés</strong> + régulation nerveuse + plantes adaptogènes</p>
              </div>
              <div className="flex gap-3">
                <span className="text-2xl">🪞</span>
                <p><strong>Travail intérieur</strong> : reparentage, deuil de la femme parfaite, réappropriation de ton énergie</p>
              </div>
            </div>
          </div>

          <p className="text-center text-sm text-[#5A6B62] mt-8">
            Cette section est accessible gratuitement (dans la limite des 10 questions). Pour un accompagnement vraiment personnalisé et un suivi sur plusieurs semaines, le coaching est souvent le choix le plus transformateur.
          </p>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE — 3 étapes claires */}
      <section id="comment" className="bg-white border-y border-[#E6EDE9] py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-12">
            <div className="uppercase tracking-[3px] text-xs font-medium text-[var(--sage-600)] mb-2">COMMENT ÇA MARCHE</div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight">3 niveaux. Tu avances à ton rythme.</h2>
            <p className="mt-3 text-[#5A6B62] max-w-xl mx-auto">Commence gratuite. Passe à l&apos;illimité quand tu es convaincue. Choisis le coaching pour un accompagnement humain.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="card rounded-3xl p-7 border border-[#E6EDE9] flex flex-col">
              <div className="text-xs font-semibold tracking-[2px] text-[var(--mint)] mb-2">1 · GRATUIT</div>
              <div className="text-xl font-semibold mb-2">Tester le chat IA</div>
              <div className="text-3xl font-semibold tabular-nums mb-4">0 €</div>
              <ul className="space-y-2.5 text-sm text-[#5A6B62] mb-6 flex-1">
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[var(--sage-600)] shrink-0" /> 10 questions au chat (9 expertes)</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[var(--sage-600)] shrink-0" /> Forum communauté</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[var(--sage-600)] shrink-0" /> Bilan initial + tip du jour</li>
              </ul>
              <a href="/espace" className="btn-secondary w-full rounded-2xl py-3 font-semibold text-center text-sm">
                Commencer gratuitement
              </a>
            </div>

            <div className="card rounded-3xl p-7 border-2 border-[var(--sage-600)] flex flex-col relative shadow-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--sage-600)] text-white text-[10px] font-semibold px-3 py-1 rounded-full tracking-widest">
                LE PLUS CHOISI
              </div>
              <div className="text-xs font-semibold tracking-[2px] text-[var(--sage-600)] mb-2">2 · ILLIMITÉ</div>
              <div className="text-xl font-semibold mb-2">Ebook Ménopause Sereine</div>
              <div className="text-3xl font-semibold tabular-nums mb-1">9,99 €</div>
              <div className="text-xs text-[#5A6B62] mb-4">paiement unique · accès immédiat</div>
              <ul className="space-y-2.5 text-sm text-[#5A6B62] mb-6 flex-1">
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[var(--sage-600)] shrink-0" /> PDF ebook complet</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[var(--sage-600)] shrink-0" /> Chat IA illimité + forum</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[var(--sage-600)] shrink-0" /> Suivi symptômes &amp; protocoles</li>
              </ul>
              <a 
                href={BEACONS_EBOOK_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary w-full rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 text-sm"
              >
                Acheter l&apos;ebook <ArrowRight className="h-4 w-4" />
              </a>
              <p className="text-center text-[11px] mt-2 text-[#5A6B62]">Paiement sécurisé sur Beacons</p>
            </div>

            <div className="card rounded-3xl p-7 border-2 border-[#C5A46E] flex flex-col">
              <div className="text-xs font-semibold tracking-[2px] text-[#C5A46E] mb-2">3 · ACCOMPAGNEMENT</div>
              <div className="text-xl font-semibold mb-2">Coaching 4 semaines</div>
              <div className="text-3xl font-semibold tabular-nums mb-1">299,99 €</div>
              <div className="text-xs text-[#5A6B62] mb-4">suivi humain personnalisé</div>
              <ul className="space-y-2.5 text-sm text-[#5A6B62] mb-6 flex-1">
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[var(--sage-600)] shrink-0" /> Tout l&apos;illimité inclus</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[var(--sage-600)] shrink-0" /> Visio + protocole écrit</li>
                <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 text-[var(--sage-600)] shrink-0" /> WhatsApp + suivi 4 semaines</li>
              </ul>
              <a 
                href={BEACONS_COACHING_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 text-sm bg-[#C5A46E] hover:bg-[#B38C55] text-white transition"
              >
                Réserver le coaching <ArrowRight className="h-4 w-4" />
              </a>
              <p className="text-center text-[11px] mt-2 text-[#5A6B62]">Places limitées chaque mois</p>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3"><Star className="text-[#C5A46E]" /></div>
          <h3 className="text-3xl font-semibold tracking-tight">Ce qu&apos;elles recherchent chez nous</h3>
          <p className="text-sm text-[#5A6B62] mt-2">Retours typiques de lectrices et clientes (exemples illustratifs)</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="card rounded-3xl p-8 bg-white">
              <div className="flex gap-1 mb-4 text-[#C5A46E]">
                {[...Array(5)].map((_, idx) => <Star key={idx} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="italic text-[15px] leading-relaxed mb-6">“{t.quote}”</p>
              <div>
                <div className="font-medium">{t.name}</div>
                <div className="text-sm text-[#5A6B62]">{t.role}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TARIFS DÉTAILLÉS */}
      <section id="tarifs" className="bg-[var(--cream)] py-16 sm:py-20 border-t border-[#E6EDE9]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <div className="uppercase tracking-[3px] text-xs font-medium text-[var(--sage-600)] mb-2">OFFRES</div>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">Choisis ce qui te correspond</h2>
          <p className="text-[#5A6B62] mb-10 max-w-lg mx-auto">
            L&apos;ebook débloque l&apos;illimité tout de suite. Le coaching est pour celles qui veulent un suivi humain, pas seulement des réponses IA.
          </p>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 grid md:grid-cols-2 gap-6">
          <div className="card rounded-3xl p-7 sm:p-9 bg-white">
            <div className="uppercase tracking-[2px] text-xs text-[var(--sage-600)] mb-2">POUR AVANCER SEULE, À TON RYTHME</div>
            <div className="text-2xl sm:text-3xl font-semibold">Ebook Ménopause Sereine</div>
            <p className="text-sm text-[#5A6B62] mt-1">PDF + chat IA illimité + forum</p>
            <div className="mt-3 text-4xl sm:text-5xl font-semibold tabular-nums tracking-tighter">9,99 €<span className="text-lg align-super font-normal text-[#5A6B62]"> une fois</span></div>

            <div className="my-6 h-px bg-[#E6EDE9]" />

            <ul className="space-y-3 mb-8 text-[15px]">
              {[
                "Ebook PDF « Ménopause Sereine » à télécharger",
                "Chat IA illimité avec les 9 expertes",
                "Forum, bilan, suivi de symptômes",
                "Idéal pour la ménopause, l'énergie et l'équilibre hormonal",
                "Accès immédiat après achat Beacons",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3"><Check className="mt-1 text-[var(--sage-600)] h-4 w-4 shrink-0" /> {item}</li>
              ))}
            </ul>

            <a 
              href={BEACONS_EBOOK_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary w-full py-4 rounded-2xl font-semibold text-base block text-center"
            >
              Je prends l&apos;ebook à 9,99 €
            </a>
            <p className="text-center text-xs mt-3 text-[#5A6B62]">Paiement sur Beacons · Lien d&apos;accès envoyé par email</p>
          </div>

          <div className="card rounded-3xl p-7 sm:p-9 border-[#C5A46E] border-2 relative bg-white">
            <div className="absolute -top-3 right-6 sm:right-8 bg-[#C5A46E] text-white text-xs font-semibold px-4 py-1 rounded-full tracking-widest">TRANSFORMATEUR</div>
            
            <div className="uppercase tracking-[2px] text-xs text-[#C5A46E] mb-2">ACCOMPAGNEMENT HUMAIN</div>
            <div className="text-2xl sm:text-3xl font-semibold">Coaching 4 semaines</div>
            <p className="text-sm text-[#5A6B62] mt-1">Protocole sur-mesure + suivi avec Yas</p>
            <div className="mt-3 text-4xl sm:text-5xl font-semibold tabular-nums tracking-tighter">299,99 €<span className="text-lg align-super font-normal text-[#5A6B62]"> une fois</span></div>

            <div className="my-6 h-px bg-[#E6EDE9]" />

            <ul className="space-y-3 mb-8 text-[15px]">
              {[
                "Tout l'illimité ebook + chat inclus",
                "Appel / visio découverte 45 min",
                "Protocole écrit personnalisé",
                "Groupe WhatsApp + chat privé 4 semaines",
                "Points d'étape et ajustements",
                "Soutien émotionnel et spirituel respectueux",
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3"><Check className="mt-1 text-[var(--sage-600)] h-4 w-4 shrink-0" /> {item}</li>
              ))}
            </ul>

            <a 
              href={BEACONS_COACHING_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl font-semibold text-base bg-[#C5A46E] hover:bg-[#B38C55] text-white transition block text-center"
            >
              Je réserve le coaching à 299,99 €
            </a>
            <p className="text-center text-xs mt-3 text-[#5A6B62]">Peu de places · Suivi de qualité garanti</p>
          </div>
        </div>

        <p className="text-center text-sm text-[#5A6B62] mt-8 px-4">
          Pas encore sûre ?{' '}
          <a href="/espace" className="text-[var(--sage-600)] font-medium underline underline-offset-2">
            Teste d&apos;abord 10 questions gratuites
          </a>
          {' '}ou{' '}
          <a href="/bilan" className="text-[var(--sage-600)] font-medium underline underline-offset-2">
            fais ton bilan
          </a>
          .
        </p>
      </section>

      {/* DISCLAIMER IMPORTANT */}
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="disclaimer border-l-4 border-[#C5A46E] pl-5 bg-white/60 p-5 rounded-r-2xl">
          <strong className="block mb-1 text-[#5A6B62]">Avertissement important</strong>
          Les informations, réponses de l&apos;IA et protocoles fournis sur natura'bio by yas sont donnés à titre éducatif et informatif uniquement. 
          Ils ne remplacent en aucun cas un avis médical, un diagnostic ou un traitement personnalisé par un professionnel de santé qualifié. 
          Consultez toujours votre médecin ou un praticien compétent avant d&apos;entreprendre tout changement, surtout si vous êtes enceinte, 
          allaitez, prenez des médicaments ou souffrez d&apos;une pathologie. Les approches naturelles peuvent interagir avec des traitements conventionnels.
        </div>
      </div>

      {/* FINAL CTA */}
      <div className="bg-[#2C3F36] text-white py-14 sm:py-16">
        <div className="mx-auto max-w-xl text-center px-4 sm:px-6">
          <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-3">Prête à t&apos;écouter vraiment ?</h3>
          <p className="text-[#C9D6D0] mb-8">
            Commence gratuite. Si les réponses te parlent, l&apos;ebook à 9,99 € débloque l&apos;illimité.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="/espace" className="bg-white text-[#2C3F36] font-semibold rounded-full px-8 py-3.5 text-base sm:text-lg">
              Essayer le chat gratuit
            </a>
            <a href="#tarifs" className="border border-white/40 text-white font-semibold rounded-full px-8 py-3.5 text-base sm:text-lg hover:bg-white/10 transition">
              Voir l&apos;ebook &amp; le coaching
            </a>
          </div>
          <div className="mt-5 text-xs text-[#A8BDB5]">Paiement sécurisé Beacons · Accès immédiat après achat</div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-[#E6EDE9] bg-white py-10 text-sm text-[#5A6B62]">
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row gap-y-4 items-center justify-between">
          <div className="flex flex-col items-center md:items-start">
            <img 
              src="/natura-bio-logo.jpg" 
              alt="natura'bio" 
              className="h-14 w-auto mb-1" 
            />
            <div className="text-[10px] font-medium tracking-tight text-[var(--sage-600)]">by yas</div>
          </div>

          <div className="text-center md:text-left">© {new Date().getFullYear()} natura'bio by yas — Tous droits réservés</div>

          <div className="flex gap-6">
            <a href="/mentions-legales" className="hover:text-[#2A3A32]">Mentions légales</a>
            <a href="/confidentialite" className="hover:text-[#2A3A32]">Confidentialité (RGPD)</a>
            <a href="/cgv" className="hover:text-[#2A3A32]">CGV</a>
            <a href="/avertissement-sante" className="hover:text-[#2A3A32]">Avertissement santé</a>
          </div>

          <div className="text-xs text-center md:text-right">Fait avec respect et discernement</div>
        </div>
      </footer>
      </div>
  );
}
