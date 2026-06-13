"use client";

import React from 'react';
import { 
  Leaf, Heart, Wind, Apple, BookOpen, Flame, Brain, 
  Users, ArrowRight, Check, Star, Shield 
} from 'lucide-react';
// === LIENS BEACONS (ventes) ===
// L'espace membres (chat IA + forum) est gratuit (10 questions).
// Premium : 9.99€/mois illimité + ebook ménopause & hormones offert.
// Puis coaching pour protocole spécifique.
// Remplace BEACONS_PREMIUM_MONTHLY_LINK par ton vrai lien Beacons de l'abonnement mensuel 9.99€.
const BEACONS_EBOOK_LINK = "https://shop.beacons.ai/yas_digital/44ca0203-408c-489d-b6d3-0a5c0af4fee2";   // ← (optionnel, maintenant inclus dans premium)
const BEACONS_COACHING_LINK = "https://shop.beacons.ai/yas_digital/d3e9837a-e734-4b80-8243-479d6c1f0213"; // ← Lien coaching
const BEACONS_PREMIUM_MONTHLY_LINK = "https://shop.beacons.ai/yas_digital/REMPLACE_PAR_TON_LIEN_MENSUEL"; // ← En attente : colle ici le lien Beacons de ton abonnement mensuel 9.99€ (illimité + ebook inclus). Envoie-le moi quand tu l'auras, je le mets à jour tout de suite.

// Lien du groupe WhatsApp que tu as mis sur ton offre Beacons (pour le coaching)
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/IdGLaitmNJFFBtoduhDMdi";

const pillars = [
  { icon: Leaf, title: "Aromathérapie", desc: "Huiles essentielles et synergies sécuritaires pour le bien-être émotionnel et physique." },
  { icon: Heart, title: "Naturopathie", desc: "Approche holistique : terrain, vitalité, soutien des émonctoires et remèdes naturels." },
  { icon: Wind, title: "Respiration & Nerf Vague", desc: "Techniques de régulation du système nerveux autonome pour calmer l'anxiété et l'inflammation." },
  { icon: Apple, title: "Alimentation Thérapeutique", desc: "Nutrition anti-inflammatoire, cycle syncing, adaptogènes et micronutrition ciblée." },
  { icon: BookOpen, title: "Médecine Prophétique", desc: "Sagesse ancestrale : miel, nigelle, henné, jeûne intermittent et remèdes du Prophète ﷺ." },
  { icon: Flame, title: "Médecine Traditionnelle Chinoise", desc: "Équilibre du Qi, méridiens, points d'acupression, plantes et alimentation selon les saisons." },
  { icon: Brain, title: "Régulation Hormonale", desc: "Soutien du cycle, ménopause, thyroïde et cortisol avec approches naturelles validées." },
  { icon: Shield, title: "Approche Intégrative", desc: "Combinaison intelligente des différentes traditions pour des protocoles cohérents et sûrs." },
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
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5B7B6E]">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="font-semibold tracking-tight text-xl">natura'bio by yas</div>
              <div className="text-[10px] text-[#5A6B62] -mt-1">Santé &amp; bien-être au naturel</div>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#approche" className="hover:text-[#5B7B6E] transition">L'approche</a>
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
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-20 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#E6EDE9] px-4 py-1 text-xs font-medium tracking-widest text-[#5B7B6E] mb-6">
          APPROCHES ANCESTRALES • SCIENCE MODERNE • FOI &amp; RESPECT
        </div>

        <h1 className="text-6xl md:text-7xl font-semibold tracking-tighter leading-[1.05] mb-6">
          Retrouvez votre équilibre.<br />Naturellement.
        </h1>
        
        <p className="mx-auto max-w-2xl text-2xl text-[#5A6B62] tracking-tight mb-6">
          Accède gratuitement au Chat IA + Forum (10 questions).
        </p>
        <p className="mx-auto max-w-2xl text-xl text-[#5A6B62] tracking-tight mb-10">
          Puis passe en illimité à 9,99 €/mois (ebook ménopause &amp; hormones offert) ou coaching 299,99 €.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-primary flex items-center justify-center gap-3 rounded-full px-10 py-4 text-lg font-semibold shadow-sm"
          >
            Commencer par l&apos;ebook à 9,99 € <ArrowRight className="h-5 w-5" />
          </button>
          <button 
            onClick={() => document.getElementById('tarifs')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-secondary flex items-center justify-center gap-3 rounded-full px-8 py-4 text-lg font-semibold"
          >
            Découvrir le coaching 4 semaines
          </button>
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <a 
            href="/espace" 
            className="btn-secondary rounded-full px-8 py-3 font-semibold"
          >
            Accéder gratuitement (10 questions Chat IA + Forum)
          </a>
          <a 
            href="/espace" 
            className="text-sm underline text-[#5A6B62] hover:text-[#2A3A32]"
          >
            J&apos;ai déjà acheté via Beacons → Accéder à mon espace membres
          </a>
        </div>

        <div className="mt-3">
          <a 
            href={WHATSAPP_GROUP_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#5B7B6E] hover:underline"
          >
            💬 Groupe WhatsApp inclus avec l&apos;offre coaching (sur Beacons)
          </a>
        </div>

        <p className="mt-4 text-sm text-[#5A6B62]">
          Ebook livré via Beacons • Accès immédiat à l&apos;app IA + forum après achat
        </p>
      </section>

      {/* CONFIANCE */}
      <div className="border-y border-[#E6EDE9] bg-white py-4">
        <div className="mx-auto max-w-5xl px-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm text-[#5A6B62]">
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#5B7B6E]" /> +1 200 femmes accompagnées</div>
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#5B7B6E]" /> Approches respectueuses de la foi</div>
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#5B7B6E]" /> Réponses précises et documentées</div>
          <div className="flex items-center gap-2"><Check className="h-4 w-4 text-[#5B7B6E]" /> Suivi humain pour les coachings</div>
        </div>
      </div>

      {/* LES 8 PILIERS */}
      <section id="approche" className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center mb-12">
          <div className="text-[#5B7B6E] font-medium tracking-[3px] text-sm mb-2">UNE APPROCHE INTÉGRATIVE</div>
          <h2 className="text-5xl font-semibold tracking-tight">Huit piliers pour comprendre et guérir</h2>
          <p className="mt-3 max-w-md mx-auto text-[#5A6B62]">
            L&apos;IA de natura'bio by yas maîtrise ces traditions et les combine avec discernement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;
            return (
              <div key={index} className="pillar card rounded-3xl p-7 flex flex-col">
                <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E6EDE9]">
                  <Icon className="h-6 w-6 text-[#5B7B6E]" />
                </div>
                <h3 className="font-semibold text-xl tracking-tight mb-3">{pillar.title}</h3>
                <p className="text-[#5A6B62] text-[15px] leading-relaxed">{pillar.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMMENT ÇA MARCHE + FUNNEL */}
      <section id="comment" className="bg-white border-y border-[#E6EDE9] py-20">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-12">
            <div className="text-[#5B7B6E] font-medium tracking-[3px] text-sm mb-2">COMMENT ÇA MARCHE</div>
            <h2 className="text-5xl font-semibold tracking-tight">Commence gratuitement (Chat IA + Forum), passe aux offres premium ensuite</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Étape 1 */}
            <div className="card rounded-3xl p-8 border-2 border-[#5B7B6E]">
              <div className="text-[#5B7B6E] text-sm font-semibold mb-1">ÉTAPE 1 — POINT D&apos;ENTRÉE</div>
              <div className="text-3xl font-semibold tracking-tight mb-4">L&apos;ebook « Ménopause au Naturel »</div>
              <div className="text-4xl font-semibold tabular-nums mb-6">9,99 €</div>
              
              <ul className="space-y-3 text-[15px] mb-8 text-[#5A6B62]">
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
            <div className="card rounded-3xl p-8">
              <div className="text-[#5B7B6E] text-sm font-semibold mb-1">ÉTAPE 2 — L&apos;APP &amp; LA COMMUNAUTÉ</div>
              <div className="text-3xl font-semibold tracking-tight mb-4">Posez vos questions. Recevez des réponses expertes.</div>
              
              <div className="space-y-4 text-[15px] text-[#5A6B62]">
                <div>• Chat IA avec 8 agents spécialisés (aromathérapie, MTC, médecine prophétique...)</div>
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
        <div className="mx-auto max-w-6xl px-6 flex flex-col md:flex-row gap-y-3 items-center justify-between">
          <div>© {new Date().getFullYear()} natura'bio by yas — Tous droits réservés</div>
          <div className="flex gap-6">
            <a href="/mentions-legales" className="hover:text-[#2A3A32]">Mentions légales</a>
            <a href="/confidentialite" className="hover:text-[#2A3A32]">Confidentialité (RGPD)</a>
            <a href="/cgv" className="hover:text-[#2A3A32]">CGV</a>
            <a href="/avertissement-sante" className="hover:text-[#2A3A32]">Avertissement santé</a>
          </div>
          <div className="text-xs">Fait avec respect et discernement</div>
        </div>
      </footer>
      </div>
  );
}
