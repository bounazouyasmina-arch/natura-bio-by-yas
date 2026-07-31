"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { buildBilanReport, type BilanReport } from '@/lib/bilan-report';

type ResultsState = {
  email: string;
  ageRange: string;
  mainConcerns: string[];
  goals: string;
  duration: string;
  date: string;
  personalized: BilanReport;
};

export default function BilanPage() {
  const [step, setStep] = useState<'email' | 'form' | 'results'>('email');
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [bilanForm, setBilanForm] = useState({
    ageRange: '',
    mainConcerns: [] as string[],
    goals: '',
    duration: '',
  });
  const [results, setResults] = useState<ResultsState | null>(null);
  const [suggestedArticles, setSuggestedArticles] = useState<
    { title: string; slug: string; teaser: string }[]
  >([]);
  const [emailSending, setEmailSending] = useState(false);

  useEffect(() => {
    const savedResults = localStorage.getItem('natura_last_bilan_results');
    const savedSuggestions = localStorage.getItem('natura_last_bilan_suggestions');
    if (savedResults) {
      const parsed = JSON.parse(savedResults);
      // Rebuild if old format (missing concerns detail)
      if (!parsed.personalized?.concerns?.length && parsed.mainConcerns) {
        parsed.personalized = buildBilanReport({
          ageRange: parsed.ageRange || '',
          duration: parsed.duration || '',
          goals: parsed.goals || '',
          mainConcerns: parsed.mainConcerns || [],
        });
      }
      setResults(parsed);
      setEmail(parsed.email || '');
      setCurrentStep(3);
      setStep('results');
      if (savedSuggestions) {
        setSuggestedArticles(JSON.parse(savedSuggestions));
      } else {
        setSuggestedArticles(getDynamicSuggestions(parsed.mainConcerns || []));
      }
    }
  }, []);

  const symptomsOptions = [
    'Stress et anxiété',
    'Insomnies / Troubles du sommeil',
    'Fatigue chronique',
    'Anxiété / Stress / Charge mentale',
    "Irritabilité / Sautes d'humeur",
    'Brouillard mental / Difficultés de concentration',
    'Problèmes de peau',
    "Baisse d'énergie",
    'Troubles digestifs',
    "Baisse d'immunité",
    'Douleurs articulaires ou musculaires',
    'Cycle irrégulier ou SPM',
    'Prise de poids',
  ];

  const suggestionPool = [
    {
      title: 'Mieux dormir naturellement',
      slug: 'sommeil-hormones',
      teaser: 'Protocoles pour des nuits réparatrices.',
    },
    {
      title: 'Alléger la charge mentale sans culpabilité',
      slug: 'charge-mentale',
      teaser: 'Poser des limites avec douceur et efficacité.',
    },
    {
      title: "Respiration et nerf vague",
      slug: 'respiration-nerf-vague',
      teaser: 'Techniques pour calmer l’anxiété et l’inflammation.',
    },
    {
      title: 'Alimentation pour l’énergie',
      slug: 'alimentation-hormones',
      teaser: 'Nutrition pour plus d’énergie et clarté.',
    },
    {
      title: 'Alimentation anti-inflammatoire',
      slug: 'alimentation-inflammatoire',
      teaser: 'Ce qui calme vraiment l’inflammation.',
    },
    {
      title: 'Magnésium et nutriments clés',
      slug: 'magnesium-hormones',
      teaser: 'Le minéral qui change beaucoup de choses.',
    },
    {
      title: 'Énergie et fatigue',
      slug: 'thyroide-fatigue',
      teaser: 'Solutions naturelles pour retrouver vitalité.',
    },
    {
      title: 'Digestion et ballonnements',
      slug: 'digestion-hormones',
      teaser: 'Solutions pour un ventre plus léger.',
    },
  ];

  function getDynamicSuggestions(concerns: string[]) {
    let filtered = suggestionPool.filter((a) =>
      concerns.some(
        (c) =>
          (c.includes('Anxiété') ||
            c.includes('Stress') ||
            c.includes('Charge')) &&
            a.slug.includes('charge') ||
          (c.includes('Insomnies') || c.includes('Sommeil')) &&
            a.slug.includes('sommeil') ||
          (c.includes('Fatigue') || c.includes('Énergie') || c.includes('énergie')) &&
            (a.slug.includes('energie') || a.slug.includes('fatigue')) ||
          c.includes('Digest') && a.slug.includes('digestion') ||
          c.includes('poids') && a.slug.includes('alimentation')
      )
    );
    if (filtered.length === 0) filtered = [...suggestionPool];
    for (let i = filtered.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [filtered[i], filtered[j]] = [filtered[j], filtered[i]];
    }
    return filtered.slice(0, 2);
  }

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      alert("Merci d'entrer une adresse email valide.");
      return;
    }
    setCurrentStep(2);
    setStep('form');
  };

  const toggleConcern = (symptom: string) => {
    setBilanForm((prev) => ({
      ...prev,
      mainConcerns: prev.mainConcerns.includes(symptom)
        ? prev.mainConcerns.filter((s) => s !== symptom)
        : [...prev.mainConcerns, symptom],
    }));
  };

  const handleBilanSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bilanForm.ageRange || bilanForm.mainConcerns.length === 0) {
      alert("Merci de choisir une tranche d'âge et au moins un symptôme.");
      return;
    }

    const leads = JSON.parse(localStorage.getItem('natura_leads') || '[]');
    const lead = {
      email,
      ...bilanForm,
      date: new Date().toISOString(),
    };
    leads.unshift(lead);
    localStorage.setItem('natura_leads', JSON.stringify(leads.slice(0, 100)));

    const personalized = buildBilanReport({
      ageRange: bilanForm.ageRange,
      duration: bilanForm.duration,
      goals: bilanForm.goals,
      mainConcerns: bilanForm.mainConcerns,
    });

    const newSuggestions = getDynamicSuggestions(bilanForm.mainConcerns);
    setSuggestedArticles(newSuggestions);

    const fullResults: ResultsState = { ...lead, personalized };
    setResults(fullResults);
    localStorage.setItem('natura_last_bilan_results', JSON.stringify(fullResults));
    localStorage.setItem(
      'natura_last_bilan_suggestions',
      JSON.stringify(newSuggestions)
    );

    setCurrentStep(3);
    setStep('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startOver = () => {
    setStep('email');
    setCurrentStep(1);
    setEmail('');
    setBilanForm({ ageRange: '', mainConcerns: [], goals: '', duration: '' });
    setResults(null);
    localStorage.removeItem('natura_last_bilan_results');
  };

  const sendBilanEmail = async () => {
    if (!results) return;
    setEmailSending(true);
    try {
      const res = await fetch('/api/send-bilan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: results.email,
          ageRange: results.ageRange,
          mainConcerns: results.mainConcerns,
          goals: results.goals,
          duration: results.duration,
          personalized: results.personalized,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        alert(data.message || "L'email n'a pas pu être envoyé. Réessaie plus tard.");
        return;
      }
      alert(data.message || '✅ Ton bilan a été envoyé par email !');
    } catch {
      alert('Impossible de contacter le serveur. Vérifie ta connexion et réessaie.');
    } finally {
      setEmailSending(false);
    }
  };

  const progressSteps = [
    { num: 1, label: 'Email' },
    { num: 2, label: 'Questionnaire' },
    { num: 3, label: 'Ton bilan' },
  ];

  const p = results?.personalized;

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2A3A32]">
      <nav className="border-b border-[#E6EDE9] bg-white/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5B7B6E]">
              <span className="text-white text-sm">🌿</span>
            </div>
            <span className="font-semibold">natura&apos;bio by yas</span>
          </Link>
          <Link href="/espace" className="text-sm hover:text-[#5B7B6E]">
            Accéder à l&apos;espace membres
          </Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {step !== 'email' && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-[#5A6B62] mb-2">
              {progressSteps.map((s, idx) => (
                <span
                  key={idx}
                  className={
                    currentStep >= s.num ? 'font-medium text-[#5B7B6E]' : ''
                  }
                >
                  {s.label}
                </span>
              ))}
            </div>
            <div className="h-1.5 bg-[#E6EDE9] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#5B7B6E] transition-all"
                style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
              />
            </div>
          </div>
        )}

        {step === 'email' && (
          <div className="text-center">
            <div className="inline-block rounded-full bg-[#E6EDE9] px-4 py-1 text-xs font-medium tracking-[2px] text-[#5B7B6E] mb-4">
              GRATUIT • BILAN DÉTAILLÉ
            </div>

            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4">
              Ton bilan santé au naturel
              <br />
              personnalisé &amp; détaillé
            </h1>
            <p className="text-lg text-[#5A6B62] max-w-lg mx-auto mb-10">
              Réponds à quelques questions. Tu reçois une lecture de ton profil,
              des conseils concrets par symptôme, un plan sur 7 jours — pas une
              simple liste de liens.
            </p>

            <div className="max-w-md mx-auto">
              <form onSubmit={handleEmailSubmit} className="card rounded-3xl p-8">
                <p className="text-sm text-[#5A6B62] mb-4">
                  Pour t&apos;envoyer ton bilan et te tenir informée (newsletter)
                </p>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ton@email.com"
                  className="w-full border border-[#E6EDE9] rounded-2xl px-5 py-4 text-lg mb-4 focus:outline-none focus:border-[#5B7B6E]"
                  required
                />

                <button
                  type="submit"
                  className="btn-primary w-full py-4 rounded-2xl font-semibold text-lg"
                >
                  Commencer mon bilan gratuit →
                </button>

                <p className="text-[10px] text-[#5A6B62] mt-4">
                  Tes réponses restent confidentielles. Tu peux te désabonner à
                  tout moment.
                </p>
              </form>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div>
            <div className="text-center mb-8">
              <div className="text-[#5B7B6E] text-sm tracking-[2px]">
                ÉTAPE 2 / 2
              </div>
              <h2 className="text-3xl font-semibold tracking-tight mt-2">
                Questionnaire de bilan
              </h2>
              <p className="text-[#5A6B62] mt-1">Pour {email}</p>
              <p className="text-sm text-[#5A6B62] mt-2 max-w-md mx-auto">
                Plus tes réponses sont précises, plus le bilan est utile. Chaque
                choix influence les conseils.
              </p>
            </div>

            <form
              onSubmit={handleBilanSubmit}
              className="card rounded-3xl p-8 space-y-7 max-w-2xl mx-auto"
            >
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <span>🎂</span> Tranche d&apos;âge
                  </label>
                  <select
                    value={bilanForm.ageRange}
                    onChange={(e) =>
                      setBilanForm({ ...bilanForm, ageRange: e.target.value })
                    }
                    className="w-full border border-[#E6EDE9] rounded-2xl p-3.5 text-base focus:outline-none focus:border-[#5B7B6E]"
                    required
                  >
                    <option value="">Choisir...</option>
                    <option value="18-24">18-24 ans</option>
                    <option value="25-34">25-34 ans</option>
                    <option value="35-44">35-44 ans</option>
                    <option value="45-54">45-54 ans</option>
                    <option value="55+">55 ans et +</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3 flex items-center gap-2">
                    <span>🩺</span> Tes principaux symptômes / préoccupations
                  </label>
                  <p className="text-xs text-[#5A6B62] mb-2">
                    Coche ce qui te concerne vraiment (1 à 4 idéalement pour un
                    plan clair).
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 bg-[#F8F5F0] p-4 rounded-2xl">
                    {symptomsOptions.map((sym) => (
                      <label
                        key={sym}
                        className="flex items-center gap-2.5 text-sm cursor-pointer py-1 hover:text-[var(--sage-600)] transition"
                      >
                        <input
                          type="checkbox"
                          checked={bilanForm.mainConcerns.includes(sym)}
                          onChange={() => toggleConcern(sym)}
                          className="accent-[var(--mint)] w-4 h-4"
                        />
                        <span>{sym}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <span>📅</span> Depuis combien de temps ressens-tu cela ?
                  </label>
                  <select
                    value={bilanForm.duration}
                    onChange={(e) =>
                      setBilanForm({ ...bilanForm, duration: e.target.value })
                    }
                    className="w-full border border-[#E6EDE9] rounded-2xl p-3.5 text-base focus:outline-none focus:border-[#5B7B6E]"
                    required
                  >
                    <option value="">Choisir...</option>
                    <option value="< 6 mois">Moins de 6 mois</option>
                    <option value="6-18 mois">6 à 18 mois</option>
                    <option value="> 18 mois">Plus de 18 mois</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                    <span>🎯</span> Ton objectif principal en ce moment
                  </label>
                  <input
                    type="text"
                    value={bilanForm.goals}
                    onChange={(e) =>
                      setBilanForm({ ...bilanForm, goals: e.target.value })
                    }
                    placeholder="Ex : mieux dormir, retrouver de l'énergie, calmer le stress..."
                    className="w-full border border-[#E6EDE9] rounded-2xl p-3.5 text-base focus:outline-none focus:border-[#5B7B6E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-4 rounded-2xl font-semibold text-lg mt-4"
              >
                Voir mon bilan détaillé →
              </button>
            </form>
          </div>
        )}

        {step === 'results' && results && p && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-[#5B7B6E] text-sm">
                MERCI {email.split('@')[0].toUpperCase()} !
              </div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">
                Ton bilan détaillé est prêt
              </h2>
              <p className="text-[#5A6B62] mt-2 text-sm">
                Lis-le jusqu&apos;au bout — le plan sur 1 semaine est en bas.
              </p>
            </div>

            <div className="card rounded-3xl p-6 sm:p-8 mb-6 bg-white space-y-8">
              <div className="text-center border-b border-[#E6EDE9] pb-6">
                <div className="text-[var(--mint)] text-xs tracking-[2px] mb-1">
                  BILAN PERSONNALISÉ •{' '}
                  {new Date().toLocaleDateString('fr-FR')}
                </div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  {p.headline}
                </h2>
                <p className="text-[#5A6B62] mt-1 text-sm">Pour {results.email}</p>
              </div>

              {/* Synthèse */}
              <section>
                <div className="text-xs uppercase tracking-widest text-[var(--mint)] mb-2">
                  Synthèse
                </div>
                <p className="text-[15px] leading-relaxed">{p.synthesis}</p>
              </section>

              {/* Profil */}
              <section className="bg-[#F8F5F0] rounded-2xl p-5">
                <div className="text-xs uppercase tracking-widest text-[var(--mint)] mb-3">
                  Lecture de ton profil
                </div>
                <p className="text-sm leading-relaxed mb-3">
                  Âge : <strong>{results.ageRange}</strong> • Depuis :{' '}
                  <strong>{results.duration || 'non précisé'}</strong>
                </p>
                <p className="text-sm leading-relaxed mb-3">
                  Objectif :{' '}
                  <strong>
                    {results.goals ||
                      'mieux te comprendre et retrouver un équilibre naturel'}
                  </strong>
                </p>
                <p className="text-sm leading-relaxed mb-3">
                  Axes cochés :{' '}
                  <strong>{results.mainConcerns.join(' • ')}</strong>
                </p>
                <p className="text-sm leading-relaxed text-[#5A6B62]">
                  {p.profileReading}
                </p>
                <p className="text-sm leading-relaxed mt-3 border-t border-[#E6EDE9] pt-3">
                  {p.durationInsight}
                </p>
                {p.goalSection && (
                  <p className="text-sm leading-relaxed mt-3 bg-white rounded-xl p-4 border border-[#E6EDE9]">
                    {p.goalSection}
                  </p>
                )}
              </section>

              {/* Chaque symptôme en détail */}
              <section className="space-y-6">
                <div className="text-xs uppercase tracking-widest text-[var(--mint)]">
                  Analyse détaillée — axe par axe
                </div>
                {p.concerns.map((c, i) => (
                  <article
                    key={i}
                    className="border border-[#E6EDE9] rounded-2xl p-5 sm:p-6 space-y-4"
                  >
                    <h3 className="text-xl font-semibold text-[#2A3A32]">
                      {i + 1}. {c.title}
                    </h3>
                    <p className="text-[15px] leading-relaxed">{c.reading}</p>
                    <p className="text-sm text-[#5A6B62] leading-relaxed italic">
                      {c.whyNow}
                    </p>
                    <p className="text-sm leading-relaxed bg-[#F4F7F5] rounded-xl p-3">
                      <span className="font-medium text-[#5B7B6E]">
                        Selon ton âge :{' '}
                      </span>
                      {c.ageNote}
                    </p>

                    <div>
                      <h4 className="text-sm font-semibold text-[#5B7B6E] mb-2">
                        Protocole du jour
                      </h4>
                      <ul className="space-y-2 text-sm leading-relaxed">
                        {c.dailyProtocol.map((item, j) => (
                          <li key={j} className="flex gap-2">
                            <span className="text-[var(--mint)] shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#5B7B6E] mb-2">
                        Alimentation &amp; plantes
                      </h4>
                      <ul className="space-y-2 text-sm leading-relaxed">
                        {c.foodAndPlants.map((item, j) => (
                          <li key={j} className="flex gap-2">
                            <span className="text-[var(--mint)] shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#5B7B6E] mb-2">
                        Mode de vie
                      </h4>
                      <ul className="space-y-2 text-sm leading-relaxed">
                        {c.lifestyle.map((item, j) => (
                          <li key={j} className="flex gap-2">
                            <span className="text-[var(--mint)] shrink-0">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-semibold text-[#5B7B6E] mb-2">
                        À éviter
                      </h4>
                      <ul className="space-y-2 text-sm leading-relaxed text-[#5A6B62]">
                        {c.avoid.map((item, j) => (
                          <li key={j} className="flex gap-2">
                            <span className="shrink-0">—</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#5B7B6E]/[0.08] rounded-xl p-4 text-sm leading-relaxed">
                      <strong className="text-[#5B7B6E]">Test 7 jours : </strong>
                      {c.sevenDayTest}
                    </div>
                  </article>
                ))}
              </section>

              {/* Priorités */}
              <section>
                <div className="text-xs uppercase tracking-widest text-[var(--mint)] mb-3">
                  Comment prioriser (pour ne pas te disperser)
                </div>
                <ul className="space-y-3 text-sm leading-relaxed">
                  {p.priorityPlan.map((item, i) => (
                    <li
                      key={i}
                      className="pl-4 border-l-2 border-[var(--mint)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Plan 7 jours */}
              <section className="bg-[#F4F7F5] rounded-2xl p-5 sm:p-6">
                <div className="text-xs uppercase tracking-widest text-[var(--mint)] mb-4">
                  Ton plan sur 1 semaine (7 jours)
                </div>
                <div className="space-y-5">
                  {(p.weekPlan || (p as { fourteenDayPlan?: typeof p.weekPlan }).fourteenDayPlan || []).map((block, i) => (
                    <div key={i}>
                      <h4 className="font-semibold text-[#2A3A32]">
                        {block.day}
                        <span className="font-normal text-[#5A6B62]">
                          {' '}
                          — {block.focus}
                        </span>
                      </h4>
                      <ul className="mt-2 space-y-1.5 text-sm">
                        {block.actions.map((a, j) => (
                          <li key={j} className="flex gap-2">
                            <span className="text-[var(--mint)]">→</span>
                            <span>{a}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              <p className="text-sm leading-relaxed italic text-[#5A6B62]">
                {p.closingMessage}
              </p>
              <p className="text-xs text-[#5A6B62] leading-relaxed border-t border-[#E6EDE9] pt-4">
                {p.disclaimer}
              </p>

              {/* Articles secondaires */}
              <div className="pt-2 border-t border-[#E6EDE9]">
                <div className="flex justify-between items-center mb-3">
                  <div className="text-xs uppercase tracking-widest text-[var(--mint)]">
                    Pour aller plus loin (lecture)
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const newSugs = getDynamicSuggestions(
                        results.mainConcerns || []
                      );
                      setSuggestedArticles(newSugs);
                      localStorage.setItem(
                        'natura_last_bilan_suggestions',
                        JSON.stringify(newSugs)
                      );
                    }}
                    className="text-xs text-[var(--mint)] hover:underline"
                  >
                    Autres suggestions ↻
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  {suggestedArticles.map((art, idx) => (
                    <a
                      key={idx}
                      href={`/blog#${art.slug}`}
                      className="p-3 rounded-xl border border-[var(--border-soft)] hover:border-[var(--mint)] hover:bg-[#F4F7F5] transition block"
                    >
                      {art.title}
                      <br />
                      <span className="text-xs text-[#5A6B62]">{art.teaser}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Link
                href="/espace"
                className="flex-1 text-center btn-primary py-4 rounded-2xl font-semibold"
              >
                Continuer dans l&apos;espace membres
              </Link>
              <a
                href="https://shop.beacons.ai/yas_digital/44ca0203-408c-489d-b6d3-0a5c0af4fee2"
                target="_blank"
                rel="noreferrer"
                className="flex-1 text-center py-4 rounded-2xl font-semibold border border-[#5B7B6E] hover:bg-white"
              >
                Hormones Sereine 9,99€
              </a>
            </div>

            <div className="bg-white border border-[#E6EDE9] rounded-2xl p-5 mb-6">
              <p className="text-sm mb-3 font-medium">
                Recevoir ce bilan complet par email (tous les détails inclus) :
              </p>
              <button
                type="button"
                onClick={sendBilanEmail}
                disabled={emailSending}
                className="w-full py-3 rounded-2xl font-semibold border border-[#5B7B6E] hover:bg-[#F8F5F0] text-sm disabled:opacity-60"
              >
                {emailSending
                  ? 'Envoi en cours…'
                  : '📧 Envoyer mon bilan détaillé par email'}
              </button>
              <p className="text-[10px] text-center text-[#5A6B62] mt-2">
                Tu recevras aussi des tips (désabonnement possible à tout moment).
              </p>
            </div>

            <button
              type="button"
              onClick={startOver}
              className="block mx-auto mt-4 text-sm text-[#5B7B6E] hover:underline"
            >
              Recommencer le questionnaire
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
