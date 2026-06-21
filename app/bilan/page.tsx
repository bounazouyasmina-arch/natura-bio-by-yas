"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function BilanPage() {
  const [step, setStep] = useState<'email' | 'form' | 'results'>('email');
  const [currentStep, setCurrentStep] = useState(1);
  const [email, setEmail] = useState('');
  const [bilanForm, setBilanForm] = useState({
    ageRange: '',
    mainConcerns: [] as string[],
    goals: '',
    duration: ''
  });
  const [results, setResults] = useState<any>(null);

  const symptomsOptions = [
    "Bouffées de chaleur", "Insomnies / Troubles du sommeil", "Fatigue chronique",
    "Anxiété / Stress / Charge mentale", "Irritabilité / Sautes d'humeur",
    "Brouillard mental", "Douleurs articulaires", "Prise de poids",
    "Baisse d'énergie ou de libido", "Troubles digestifs", "Cycle irrégulier ou SPM"
  ];

  const agentRecommendations: Record<string, string> = {
    "Bouffées de chaleur": "hormones",
    "Insomnies / Troubles du sommeil": "respiration",
    "Fatigue chronique": "alimentation",
    "Anxiété / Stress / Charge mentale": "emotion",
    "Irritabilité / Sautes d'humeur": "hormones",
    "Brouillard mental": "alimentation",
    "Douleurs articulaires": "naturopathie",
    "Prise de poids": "alimentation",
    "Baisse d'énergie ou de libido": "hormones",
    "Troubles digestifs": "naturopathie",
    "Cycle irrégulier ou SPM": "hormones"
  };

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
    setBilanForm(prev => ({
      ...prev,
      mainConcerns: prev.mainConcerns.includes(symptom)
        ? prev.mainConcerns.filter(s => s !== symptom)
        : [...prev.mainConcerns, symptom]
    }));
  };

  const handleBilanSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bilanForm.ageRange || bilanForm.mainConcerns.length === 0) {
      alert("Merci de choisir une tranche d'âge et au moins un symptôme.");
      return;
    }

    // Collect lead
    const leads = JSON.parse(localStorage.getItem('natura_leads') || '[]');
    const lead = {
      email,
      ...bilanForm,
      date: new Date().toISOString()
    };
    leads.unshift(lead);
    localStorage.setItem('natura_leads', JSON.stringify(leads.slice(0, 100)));

    // Generate RICH personalized recommendations
    const recommendedAgents = Array.from(new Set(
      bilanForm.mainConcerns.map(c => agentRecommendations[c] || 'globale')
    )).slice(0, 3);

    // Detailed, actionable summary
    const detailedAdvice = bilanForm.mainConcerns.map(concern => {
      if (concern.includes("Bouffées")) {
        return "• **Bouffées de chaleur** : Sauge sclarée (2-3 gouttes sur le ventre matin et soir) + infusion de sauge + menthe. Évite les épices et l'alcool le soir.";
      }
      if (concern.includes("Insomnies")) {
        return "• **Sommeil** : Lavande + camomille romaine en diffusion + respiration 4-7-8 avant de dormir. Évite les écrans 1h avant.";
      }
      if (concern.includes("Fatigue")) {
        return "• **Fatigue** : Maca (½ c. à café le matin) + magnésium + repas riches en protéines. Teste aussi le point d'acupression Rate 6.";
      }
      if (concern.includes("Anxiété") || concern.includes("Charge mentale")) {
        return "• **Anxiété / Charge mentale** : Mélange d'huiles (lavande + bergamote + ylang-ylang) en roll-on + pratique de la respiration du nerf vague 2x/jour.";
      }
      if (concern.includes("Irritabilité")) {
        return "• **Irritabilité** : Huile de géranium + camomille romaine. Alimentation : augmente les oméga-3 et le magnésium. Évite le sucre raffiné.";
      }
      if (concern.includes("Brouillard")) {
        return "• **Brouillard mental** : Romarin + menthe poivrée en inhalation. Alimentation : oméga-3 + curcuma + baies. Hydratation importante.";
      }
      if (concern.includes("Douleurs")) {
        return "• **Douleurs** : Huile de gaulthérie + lavande en massage + gingembre et curcuma en infusion. Mouvements doux quotidiens.";
      }
      if (concern.includes("Prise de poids")) {
        return "• **Prise de poids** : Focus sur les protéines à chaque repas + marche après manger. Réduis les glucides raffinés le soir.";
      }
      if (concern.includes("libido")) {
        return "• **Énergie / Libido** : Maca + shatavari + ylang-ylang. Travaille aussi le nerf vague et la détente.";
      }
      if (concern.includes("digestifs")) {
        return "• **Digestion** : Menthe poivrée + gingembre + fenouil. Mange lentement et teste l'élimination des produits laitiers.";
      }
      if (concern.includes("Cycle")) {
        return "• **Cycle / SPM** : Huile d'onagre + sauge sclarée + magnésium. Suivi du cycle et réduction du stress.";
      }
      return "• Adapte tes protocoles avec l'agent correspondant.";
    });

    const personalized = {
      summary: `D'après tes réponses, voici ce qui ressort le plus fort chez toi :`,
      detailedAdvice,
      recommendations: recommendedAgents,
      message: bilanForm.mainConcerns.length > 3 
        ? "Tu as plusieurs symptômes qui s'entrecroisent. Priorise 1-2 axes les 3 prochaines semaines."
        : "Tu peux obtenir des résultats rapides en étant constante avec 2-3 outils naturels."
    };

    setResults({ ...lead, personalized });
    setCurrentStep(3);
    setStep('results');
  };

  const startOver = () => {
    setStep('email');
    setCurrentStep(1);
    setEmail('');
    setBilanForm({ ageRange: '', mainConcerns: [], goals: '', duration: '' });
    setResults(null);
  };

  const progressSteps = [
    { num: 1, label: 'Email' },
    { num: 2, label: 'Questionnaire' },
    { num: 3, label: 'Ton bilan' },
  ];

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2A3A32]">
      {/* Simple Nav */}
      <nav className="border-b border-[#E6EDE9] bg-white/80 backdrop-blur">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5B7B6E]">
              <span className="text-white text-sm">🌿</span>
            </div>
            <span className="font-semibold">natura'bio by yas</span>
          </Link>
          <Link href="/espace" className="text-sm hover:text-[#5B7B6E]">Accéder à l'espace membres</Link>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Progress like Tally */}
        {step !== 'email' && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-[#5A6B62] mb-2">
              {progressSteps.map((s, idx) => (
                <span key={idx} className={currentStep >= s.num ? 'font-medium text-[#5B7B6E]' : ''}>
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
              GRATUIT • SANS ENGAGEMENT
            </div>

            <h1 className="text-5xl font-semibold tracking-tight mb-4">
              Ton bilan santé au naturel<br />personnalisé en 90 secondes
            </h1>
            <p className="text-xl text-[#5A6B62] max-w-md mx-auto mb-10">
              Réponds à quelques questions et reçois des recommandations adaptées (aromathérapie, hormones, nerf vague...).
            </p>

            <div className="max-w-md mx-auto">
              <form onSubmit={handleEmailSubmit} className="card rounded-3xl p-8">
                <p className="text-sm text-[#5A6B62] mb-4">Pour t'envoyer ton bilan et te tenir informée (newsletter)</p>
                
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
                  Tes réponses restent confidentielles. Tu peux te désabonner à tout moment.
                </p>
              </form>
            </div>
          </div>
        )}

        {step === 'form' && (
          <div>
            <div className="text-center mb-8">
              <div className="text-[#5B7B6E] text-sm tracking-[2px]">ÉTAPE 2 / 2</div>
              <h2 className="text-3xl font-semibold tracking-tight mt-2">Questionnaire de bilan</h2>
              <p className="text-[#5A6B62] mt-1">Pour {email}</p>
            </div>

            <form onSubmit={handleBilanSubmit} className="card rounded-3xl p-8 space-y-7 max-w-2xl mx-auto">
              <div className="space-y-6">
                {/* Âge */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2"><span>🎂</span> Tranche d'âge</label>
                  <select 
                    value={bilanForm.ageRange} 
                    onChange={(e) => setBilanForm({...bilanForm, ageRange: e.target.value})}
                    className="w-full border border-[#E6EDE9] rounded-2xl p-3.5 text-base focus:outline-none focus:border-[#5B7B6E] hover:border-[var(--mint)] transition" 
                    required
                  >
                    <option value="">Choisir...</option>
                    <option value="35-44">35-44 ans</option>
                    <option value="45-54">45-54 ans</option>
                    <option value="55+">55 ans et +</option>
                  </select>
                </div>

                {/* Symptômes - grouped nicely like Tally */}
                <div>
                  <label className="block text-sm font-medium mb-3 flex items-center gap-2"><span>🩺</span> Tes principaux symptômes / préoccupations</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 bg-[#F8F5F0] p-4 rounded-2xl">
                    {symptomsOptions.map(sym => (
                      <label key={sym} className="flex items-center gap-2.5 text-sm cursor-pointer py-1 hover:text-[var(--sage-600)] transition interactive">
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

                {/* Durée */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2"><span>📅</span> Depuis combien de temps ressens-tu cela ?</label>
                  <select 
                    value={bilanForm.duration} 
                    onChange={(e) => setBilanForm({...bilanForm, duration: e.target.value})}
                    className="w-full border border-[#E6EDE9] rounded-2xl p-3.5 text-base focus:outline-none focus:border-[#5B7B6E] hover:border-[var(--mint)] transition" 
                    required
                  >
                    <option value="">Choisir...</option>
                    <option value="< 6 mois">Moins de 6 mois</option>
                    <option value="6-18 mois">6 à 18 mois</option>
                    <option value="> 18 mois">Plus de 18 mois</option>
                  </select>
                </div>

                {/* Objectif */}
                <div>
                  <label className="block text-sm font-medium mb-2 flex items-center gap-2"><span>🎯</span> Ton objectif principal en ce moment</label>
                  <input 
                    type="text" 
                    value={bilanForm.goals}
                    onChange={(e) => setBilanForm({...bilanForm, goals: e.target.value})}
                    placeholder="Ex : mieux dormir, retrouver de l'énergie, calmer les bouffées..."
                    className="w-full border border-[#E6EDE9] rounded-2xl p-3.5 text-base focus:outline-none focus:border-[#5B7B6E] hover:border-[var(--mint)] transition"
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary w-full py-4 rounded-2xl font-semibold text-lg mt-4">
                Voir mon bilan personnalisé →
              </button>
            </form>
          </div>
        )}

        {step === 'results' && results && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <div className="text-[#5B7B6E] text-sm">MERCI {email.split('@')[0].toUpperCase()} !</div>
              <h2 className="text-4xl font-semibold tracking-tight mt-2">Ton bilan est prêt</h2>
            </div>

            <div className="card rounded-3xl p-8 mb-6 bg-white">
              <div className="text-center mb-6 border-b pb-6">
                <div className="text-[var(--mint)] text-xs tracking-[2px] mb-1">BILAN PERSONNALISÉ • {new Date().toLocaleDateString('fr-FR')}</div>
                <h2 className="text-3xl font-semibold tracking-tight">Ton bilan santé au naturel</h2>
                <p className="text-[#5A6B62] mt-1">Pour {results.email}</p>
              </div>

              <div className="mb-6 interactive">
                <div className="text-xs uppercase tracking-widest text-[var(--mint)] mb-2">Ton profil</div>
                <p className="text-[#2A3A32]">
                  Âge : <strong>{results.ageRange}</strong> • Depuis : <strong>{results.duration || "non précisé"}</strong><br />
                  Objectif principal : <strong>{results.goals || "mieux te comprendre et t'accompagner naturellement"}</strong>
                </p>
                <p className="mt-2 text-sm">Principaux axes : <strong>{results.mainConcerns.join(" • ")}</strong></p>
              </div>

              <div className="mb-8">
                <div className="text-xs uppercase tracking-widest text-[var(--mint)] mb-3">Conseils concrets adaptés à tes symptômes</div>
                <div className="space-y-4">
                  {results.personalized.detailedAdvice.map((advice: string, i: number) => (
                    <div key={i} className="pl-4 border-l-2 border-[var(--mint)] text-[15px] leading-relaxed interactive hover:pl-5 transition-all">
                      {advice}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#F4F7F5] rounded-2xl p-6 mb-6 interactive">
                <div className="font-semibold mb-2">Recommandations précises pour le chat IA</div>
                <ul className="space-y-2 text-sm">
                  {results.personalized.recommendations.map((agent: string, i: number) => {
                    const example = 
                      agent === 'hormones' ? "Exemple : « Quelles huiles et plantes pour mes bouffées de chaleur en période de ménopause ? »" :
                      agent === 'respiration' ? "Exemple : « Donne-moi un protocole respiration + nerf vague pour mieux dormir »" :
                      agent === 'emotion' ? "Exemple : « Comment gérer la charge mentale et l'irritabilité avec des outils naturels ? »" :
                      agent === 'alimentation' ? "Exemple : « Que manger pour réduire la fatigue et le brouillard mental ? »" :
                      "Pose des questions très précises sur tes symptômes.";
                    return <li key={i} className="text-[#5A6B62] hover:text-[var(--mint)] transition">→ <strong>Agent {agent}</strong><br /><span className="text-xs">{example}</span></li>;
                  })}
                </ul>
              </div>

              <div className="text-sm text-[#5A6B62] italic">
                {results.personalized.message} Sois constante 7 à 14 jours et note tes symptômes.
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <Link 
                href="/espace" 
                className="flex-1 text-center btn-primary py-4 rounded-2xl font-semibold"
              >
                Accéder à l'espace membres (gratuit)
              </Link>
              <a 
                href="https://shop.beacons.ai/yas_digital/44ca0203-408c-489d-b6d3-0a5c0af4fee2" 
                target="_blank"
                className="flex-1 text-center py-4 rounded-2xl font-semibold border border-[#5B7B6E] hover:bg-white"
              >
                Télécharger l'ebook 9,99€
              </a>
            </div>

            {/* Envoi email réel */}
            <div className="bg-white border border-[#E6EDE9] rounded-2xl p-5 mb-6">
              <p className="text-sm mb-3 font-medium">Recevoir ce bilan détaillé + les conseils par email :</p>
              <button 
                onClick={async () => {
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
                        personalized: results.personalized
                      })
                    });
                    const data = await res.json();
                    alert(data.message || "✅ Ton bilan a été enregistré. L'envoi email sera activé dès que la config est terminée.");
                  } catch (err) {
                    alert("Bilan enregistré localement. Nous t'enverrons le résumé détaillé sous peu.");
                  }
                }}
                className="w-full py-3 rounded-2xl font-semibold border border-[#5B7B6E] hover:bg-[#F8F5F0] text-sm"
              >
                📧 Envoyer mon bilan détaillé par email
              </button>
              <p className="text-[10px] text-center text-[#5A6B62] mt-2">
                Tu recevras aussi des tips et mises à jour (désabonnement possible à tout moment).
              </p>
            </div>

            <button onClick={startOver} className="block mx-auto mt-4 text-sm text-[#5B7B6E] hover:underline">
              Recommencer le questionnaire
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
