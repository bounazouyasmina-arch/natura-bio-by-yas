"use client";

import React from 'react';
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

const pillars = [
  { 
    icon: Leaf, 
    emoji: '🌸', 
    title: "Aromathérapie", 
    desc: "Calmer l'anxiété, retrouver un sommeil profond et apaiser les tensions avec des synergies d'huiles essentielles sûres.",
    color: '#7C6B9C',
    iconBg: '#F0E9F8'
  },
  { 
    icon: Heart, 
    emoji: '🌱', 
    title: "Naturopathie", 
    desc: "Renforcer ton terrain, drainer en douceur et retrouver une vitalité durable avec des remèdes naturels.",
    color: '#4A6B55',
    iconBg: '#E8F0E9'
  },
  { 
    icon: Wind, 
    emoji: '💨', 
    title: "Respiration & Nerf Vague", 
    desc: "Réguler ton système nerveux, réduire l'inflammation et sortir du mode « toujours en alerte ».",
    color: '#5A7E7E',
    iconBg: '#E6F0F0'
  },
  { 
    icon: Apple, 
    emoji: '🍎', 
    title: "Alimentation Thérapeutique", 
    desc: "Nutrition anti-inflammatoire, cycle syncing et micronutrition ciblée pour plus d'énergie et d'équilibre.",
    color: '#C68E6B',
    iconBg: '#F9ECE4'
  },
  { 
    icon: BookOpen, 
    emoji: '📖', 
    title: "Médecine Prophétique", 
    desc: "Miel, nigelle, henné, jeûne et remèdes ancestraux du Prophète ﷺ pour le corps et l'esprit.",
    color: '#B38B5E',
    iconBg: '#F7F0E6'
  },
  { 
    icon: Flame, 
    emoji: '☯️', 
    title: "Médecine Traditionnelle Chinoise", 
    desc: "Équilibrer le Qi, les méridiens et adapter ton alimentation aux saisons pour un mieux-être global.",
    color: '#B36B5E',
    iconBg: '#F8EDE9'
  },
  { 
    icon: Brain, 
    emoji: '🌙', 
    title: "Régulation Hormonale", 
    desc: "Soutenir ton cycle, ta thyroïde, le cortisol et la ménopause avec des approches naturelles douces mais puissantes.",
    color: '#B37E8F',
    iconBg: '#F8ECF1'
  },
  { 
    icon: Shield, 
    emoji: '🌿', 
    title: "Approche Intégrative", 
    desc: "Combiner avec discernement toutes les sagesses pour des protocoles cohérents, sûrs et vraiment efficaces.",
    color: '#4F6B5F',
    iconBg: '#E8F0EC'
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
  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2A3A32]">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 border-b border-[#E6EDE9] bg-[#F8F5F0]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
          <div className="flex flex-col items-start">
            <img 
              src="/natura-bio-logo.jpg" 
              alt="natura'bio" 
              className="h-20 md:h-24 w-auto" 
            />
            <div className="text-[11px] font-medium tracking-tight text-[#5B7B6E] mt-1">by yas</div>
            <div className="text-[10px] text-[#5A6B62] -mt-0.5">Santé &amp; bien-être au naturel</div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#approche" className="hover:text-[#5B7B6E] transition">L'approche</a>
            <a href="/bilan" className="hover:text-[#5B7B6E] transition font-medium">Faire mon bilan</a>
            <a href="#comment" className="hover:text-[#5B7B6E] transition">Comment ça marche</a>
            <a href="#tarifs" className="hover:text-[#5B7B6E] transition">Tarifs</a>
            <a href="/espace" className="hover:text-[#5B7B6E] transition">Espace membres</a>
            <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer" className="hover:text-[#5B7B6E] transition">💬 Groupe WhatsApp (coaching)</a>
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="/espace" 
              className="hidden sm:block rounded-full px-5 py-2 text-sm font-medium border border-[#A8BDB5] hover:bg-white transition"
            >
              Se connecter
            </a>
            <button 
              onClick={() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn-primary rounded-full px-6 py-2 text-sm font-semibold"
            >
              Commencer
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto max-w-5xl px-6 pt-20 pb-16 text-center">
        <div className="inline-block rounded-full bg-[#E6EDE9] px-4 py-1 text-xs font-medium tracking-[2px] text-[#5B7B6E] mb-6">
          APPROCHES ANCESTRALES • SCIENCE MODERNE • FOI &amp; RESPECT
        </div>

        <h1 className="text-6xl md:text-[72px] font-semibold tracking-[-2.5px] leading-[1.05] mb-6">
          Une question.<br />Huit sagesses.<br />Une réponse qui te parle.
        </h1>

        <p className="mx-auto max-w-2xl text-2xl text-[#5A6B62] tracking-[-0.3px] mb-4">
          Tes questions façonnent ta santé de demain.
        </p>
        <p className="mx-auto max-w-2xl text-lg text-[#5A6B62] mb-10">
          9 sagesses IA (aromathérapie, naturopathie, nerf vague, hormones, médecine prophétique, chinoise...) te répondent avec précision, respect et profondeur. 10 questions gratuites. Accès illimité avec l&apos;ebook à 9,99 €.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/bilan" 
            className="btn-primary flex items-center justify-center gap-3 rounded-full px-10 py-4 text-lg font-semibold shadow-sm"
          >
            Faire mon bilan gratuit
          </a>
          <a 
            href="/espace" 
            className="btn-secondary flex items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-semibold"
          >
            Accéder au Chat IA
          </a>
        </div>

        <p className="mt-6 text-sm text-[#5A6B62]">
          Pas de carte. Pas d’engagement. Teste les réponses naturelles dès maintenant.
        </p>
      </section>

      {/* CONFIANCE - style lucis.life */}
      <div className="border-y border-[#E6EDE9] bg-white py-4">
        <div className="mx-auto max-w-5xl px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-[#5A6B62]">
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#5B7B6E]" /> +1 200 femmes accompagnées</div>
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#5B7B6E]" /> 9 sagesses IA précises</div>
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#5B7B6E]" /> Approches respectueuses de la foi</div>
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#5B7B6E]" /> Chat gratuit + forum dès maintenant</div>
        </div>
      </div>

      {/* BIENVENUE - Compagnon au naturel */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-3xl">
          <h2 className="text-3xl font-semibold tracking-tight mb-4">natura’bio by yas est ton compagnon santé au naturel.</h2>
          <p className="text-lg text-[#5A6B62] mb-6">
            Tu poses une question sur ton cycle, ta ménopause, ton énergie ou ta charge mentale…<br />
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
          <div className="text-[#5B7B6E] font-medium tracking-[3px] text-sm mb-2">UNE APPROCHE INTÉGRATIVE</div>
          <h2 className="text-5xl font-semibold tracking-tight">Huit sagesses pour comprendre et agir</h2>
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
                className="pillar card rounded-3xl p-7 flex flex-col"
                style={{ borderLeft: `5px solid ${pillar.color}` }}
              >
                <div 
                  className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={{ backgroundColor: pillar.iconBg }}
                >
                  <Icon className="h-7 w-7" style={{ color: pillar.color }} />
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-xl">{pillar.emoji}</span>
                  <h3 className="font-semibold text-xl tracking-tight">{pillar.title}</h3>
                </div>
                <p className="text-[#5A6B62] text-[15px] leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* EXEMPLES CONCRETS (inspiré de lucis) */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="text-center mb-8">
          <div className="text-[#5B7B6E] text-sm tracking-[2px] font-medium mb-1">DES RÉPONSES QUI PARLENT VRAI</div>
          <h3 className="text-2xl font-semibold tracking-tight">Exemples de questions que les femmes posent</h3>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {[
            "Pourquoi je craque à 15h tous les jours ?",
            "Comment calmer mes bouffées de chaleur sans hormones ?",
            "J’ai tout le temps la charge mentale, comment poser des limites ?",
            "Insomnies malgré la fatigue : que faire avec les huiles et la respiration ?",
            "Mon cycle est irrégulier, par où commencer naturellement ?",
            "Je me sens vidée émotionnellement, quels outils en MTC et naturopathie ?"
          ].map((q, i) => (
            <div key={i} className="card rounded-2xl px-5 py-4 text-[#5A6B62] border border-[#E6EDE9]">
              « {q} »
            </div>
          ))}
        </div>
        <p className="text-center text-xs mt-4 text-[#5A6B62]">L’IA te répond avec des protocoles précis. Tu peux aller plus loin avec l’ebook ou le coaching.</p>
      </section>

      {/* SECTION ÉMOTIONNELLE & CHARGE MENTALE - MISE EN AVANT (9e section visuelle) */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <div 
          className="rounded-3xl p-10 md:p-14 border"
          style={{ 
            backgroundColor: '#F1EFF8', 
            borderColor: '#D9D4EC' 
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

      {/* COMMENT ÇA MARCHE + FUNNEL */}
      <section id="comment" className="bg-white border-y border-[#E6EDE9] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <div className="uppercase tracking-[3px] text-xs font-medium text-[#5B7B6E] mb-2">COMMENT ÇA MARCHE</div>
            <h2 className="text-5xl font-semibold tracking-tight">Commence gratuitement. Avance à ton rythme.</h2>
            <p className="mt-2 text-[#5A6B62]">Chat IA + forum ouvert. Ebook ou coaching quand tu veux aller plus loin.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Étape 1 */}
            <div className="card rounded-3xl p-8 border-2 border-[#5B7B6E]">
              <div className="uppercase tracking-[2px] text-xs font-medium text-[#5B7B6E] mb-1">ÉTAPE 1 — POINT D&apos;ENTRÉE</div>
              <div className="text-[22px] font-semibold tracking-tight mb-4">L&apos;ebook « Ménopause au Naturel »</div>
              <div className="text-4xl font-semibold tabular-nums mb-6">9,99 €</div>
              
              <ul className="space-y-3 text-[15px] leading-relaxed mb-8 text-[#5A6B62]">
                <li className="flex gap-3"><Check className="mt-1 h-4 w-4 text-[#5B7B6E] flex-shrink-0" /> 80+ pages de protocoles concrets</li>
                <li className="flex gap-3"><Check className="mt-1 h-4 w-4 text-[#5B7B6E] flex-shrink-0" /> Accès à l&apos;application IA + forum</li>
                <li className="flex gap-3"><Check className="mt-1 h-4 w-4 text-[#5B7B6E] flex-shrink-0" /> Mises à jour à vie</li>
              </ul>
              
              <a 
                href={BEACONS_EBOOK_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn-primary w-full rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 text-base mt-2"
              >
                Acheter l&apos;ebook à 9,99 € sur Beacons <ArrowRight className="h-4 w-4" />
              </a>
              <p className="text-center text-xs mt-2 text-[#5A6B62]">Accès immédiat à l&apos;espace membres IA + forum après achat</p>
            </div>

            {/* Étape 2 */}
            <div className="card rounded-3xl p-8 border border-[#E6EDE9]">
              <div className="uppercase tracking-[2px] text-xs font-medium text-[#5B7B6E] mb-1">ÉTAPE 2 — L&apos;APP &amp; LA COMMUNAUTÉ</div>
              <div className="text-[22px] font-semibold tracking-tight mb-4">Posez vos questions. Recevez des réponses expertes.</div>
              
              <div className="space-y-4 text-[15px] leading-relaxed text-[#5A6B62]">
                <div>• Chat IA avec 9 agents spécialisés (dont un dédié à la charge mentale et aux émotions)</div>
                <div>• Forum bienveillant entre femmes + réponses de l&apos;IA</div>
                <div>• Historique de tes conversations et protocoles</div>
                <div>• Accès réservé aux acheteuses via Beacons</div>
              </div>
            </div>

            {/* Étape 3 - Upsell */}
            <div className="card rounded-3xl p-8 border-2 border-[#C5A46E]">
              <div className="text-[#C5A46E] text-sm font-semibold mb-1">ÉTAPE 3 — ACCOMPAGNEMENT PREMIUM</div>
              <div className="text-3xl font-semibold tracking-tight mb-4">Coaching 4 semaines sur mesure</div>
              <div className="text-4xl font-semibold tabular-nums mb-6">299,99 €</div>

              <ul className="space-y-3 text-[15px] mb-8 text-[#5A6B62]">
                <li className="flex gap-3"><Check className="mt-1 h-4 w-4 text-[#5B7B6E] flex-shrink-0" /> 1 visio ou appel découverte (45 min)</li>
                <li className="flex gap-3"><Check className="mt-1 h-4 w-4 text-[#5B7B6E] flex-shrink-0" /> Protocole personnalisé écrit</li>
                <li className="flex gap-3"><Check className="mt-1 h-4 w-4 text-[#5B7B6E] flex-shrink-0" /> Accès au groupe WhatsApp inclus avec l&apos;offre</li>
                <li className="flex gap-3"><Check className="mt-1 h-4 w-4 text-[#5B7B6E] flex-shrink-0" /> Chat privé illimité avec la coach</li>
                <li className="flex gap-3"><Check className="mt-1 h-4 w-4 text-[#5B7B6E] flex-shrink-0" /> Suivi hebdo + ajustements 4 semaines</li>
                <li className="flex gap-3"><Check className="mt-1 h-4 w-4 text-[#5B7B6E] flex-shrink-0" /> Accès prioritaire à l&apos;espace IA</li>
              </ul>

              <a 
                href={BEACONS_COACHING_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 text-base bg-[#C5A46E] hover:bg-[#B38C55] text-white transition mt-2"
              >
                Réserver le coaching 4 semaines sur Beacons <ArrowRight className="h-4 w-4" />
              </a>
              <p className="text-center text-xs mt-2 text-[#5A6B62]">Places limitées • Accès prioritaire à l&apos;espace après achat</p>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-center mb-10">
          <div className="flex justify-center mb-3"><Star className="text-[#C5A46E]" /></div>
          <h3 className="text-3xl font-semibold tracking-tight">Elles ont repris le pouvoir sur leur santé</h3>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="card rounded-3xl p-8">
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

      {/* TARIFS DÉTAILLÉS (ancre) */}
      <section id="tarifs" className="bg-white py-20 border-t border-[#E6EDE9]">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-4xl font-semibold tracking-tight mb-3">Choisissez votre niveau d&apos;accompagnement</h2>
          <p className="text-[#5A6B62] mb-10">L&apos;ebook est le meilleur point de départ. Le coaching est l&apos;expérience complète et transformatrice.</p>
        </div>

        <div className="mx-auto max-w-5xl px-6 grid md:grid-cols-2 gap-6">
          {/* Ebook */}
          <div className="card rounded-3xl p-9">
            <div className="uppercase tracking-[2px] text-xs text-[#5B7B6E] mb-2">POUR COMMENCER</div>
            <div className="text-3xl font-semibold">Ebook Ménopause au Naturel</div>
            <div className="mt-1 text-5xl font-semibold tabular-nums tracking-tighter">9,99 €<span className="text-xl align-super font-normal text-[#5A6B62]"> une fois</span></div>

            <div className="my-8 h-px bg-[#E6EDE9]" />

            <ul className="space-y-3 mb-9 text-[15px]">
              {["Protocoles complets pour les symptômes de la ménopause", "Focus aromathérapie, nerf vague, hormones, alimentation", "Accès à vie à l'application IA + forum de la communauté", "Mises à jour régulières"].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3"><Check className="mt-1 text-[#5B7B6E] h-4 w-4 shrink-0" /> {item}</li>
              ))}
            </ul>

            <a 
              href={BEACONS_EBOOK_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary w-full py-4 rounded-2xl font-semibold text-base block text-center"
            >
              Acheter l&apos;ebook à 9,99 €
            </a>
            <p className="text-center text-xs mt-3 text-[#5A6B62]">Achat sur Beacons → Accès immédiat à l&apos;espace membres (IA + forum).</p>
          </div>

          {/* Coaching */}
          <div className="card rounded-3xl p-9 border-[#C5A46E] border-2 relative">
            <div className="absolute -top-3 right-8 bg-[#C5A46E] text-white text-xs font-semibold px-4 py-1 rounded-full tracking-widest">LE PLUS PUISSANT</div>
            
            <div className="uppercase tracking-[2px] text-xs text-[#C5A46E] mb-2">ACCOMPAGNEMENT PERSONNALISÉ</div>
            <div className="text-3xl font-semibold">Coaching 4 semaines</div>
            <div className="mt-1 text-5xl font-semibold tabular-nums tracking-tighter">299,99 €<span className="text-xl align-super font-normal text-[#5A6B62]"> une fois</span></div>

            <div className="my-8 h-px bg-[#E6EDE9]" />

            <ul className="space-y-3 mb-9 text-[15px]">
              {["Tout ce qui est inclus dans l&apos;ebook + accès prioritaire", "Appel ou visio découverte de 45 min pour poser le diagnostic", "Protocole écrit sur mesure (PDF + explications)", "Accès au groupe WhatsApp inclus avec l&apos;offre sur Beacons", "Chat privé avec moi pendant 4 semaines (réponses sous 24-48h)", "2 points d'étape + ajustements du protocole", "Soutien émotionnel et spirituel respectueux"].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3"><Check className="mt-1 text-[#5B7B6E] h-4 w-4 shrink-0" /> {item}</li>
              ))}
            </ul>

            <a 
              href={BEACONS_COACHING_LINK} 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full py-4 rounded-2xl font-semibold text-base bg-[#C5A46E] hover:bg-[#B38C55] text-white transition block text-center"
            >
              Réserver le coaching à 299,99 €
            </a>
            <p className="text-center text-xs mt-3 text-[#5A6B62]">Seulement quelques places par mois pour un suivi de qualité</p>
          </div>
        </div>
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
      <div className="bg-[#2C3F36] text-white py-16">
        <div className="mx-auto max-w-lg text-center px-6">
          <h3 className="text-4xl font-semibold tracking-tight mb-3">Prête à reprendre les rênes de ton bien-être ?</h3>
          <p className="text-[#C9D6D0] mb-8">Commence par l&apos;ebook. Tu pourras toujours passer au coaching ensuite.</p>
          <button onClick={() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' })} className="bg-white text-[#2C3F36] font-semibold rounded-full px-9 py-4 text-lg">
            Je commence maintenant
          </button>
          <div className="mt-5 text-xs text-[#A8BDB5]">Paiement sécurisé • Satisfaite ou accompagnée</div>
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
            <div className="text-[10px] font-medium tracking-tight text-[#5B7B6E]">by yas</div>
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
