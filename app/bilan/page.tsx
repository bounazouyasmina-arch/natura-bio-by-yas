"use client";

import React, { useState } from 'react';
import Link from 'next/link';

export default function BilanPage() {
  const [step, setStep] = useState<'email' | 'form' | 'results'>('email');
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
    localStorage.setItem('natura_leads', JSON.stringify(leads.slice(0, 100))); // keep last 100

    // Generate personalized recommendations
    const recommendedAgents = Array.from(new Set(
      bilanForm.mainConcerns.map(c => agentRecommendations[c] || 'globale')
    )).slice(0, 3);

    const personalized = {
      summary: `D'après tes réponses (${bilanForm.mainConcerns.length} préoccupations principales), voici ce qui ressort le plus :`,
      recommendations: recommendedAgents,
      message: bilanForm.mainConcerns.length > 2 
        ? "Tu sembles avoir plusieurs axes à travailler. Commence par l'agent Émotion ou Hormones."
        : "Excellent point de départ ! Utilise l'agent correspondant pour des réponses précises."
    };

    setResults({ ...lead, personalized });
    setStep('results');
  };

  const startOver = () => {
    setStep('email');
    setEmail('');
    setBilanForm({ ageRange: '', mainConcerns: [], goals: '', duration: '' });
    setResults(null);
  };

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
              <div>
                <label className="block text-sm font-medium mb-2">Tranche d'âge</label>
                <select 
                  value={bilanForm.ageRange} 
                  onChange={(e) => setBilanForm({...bilanForm, ageRange: e.target.value})}
                  className="w-full border border-[#E6EDE9] rounded-2xl p-3.5 text-base" 
                  required
                >
                  <option value="">Choisir...</option>
                  <option value="35-44">35-44 ans</option>
                  <option value="45-54">45-54 ans</option>
                  <option value="55+">55 ans et +</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Tes principaux symptômes / préoccupations</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {symptomsOptions.map(sym => (
                    <label key={sym} className="flex items-center gap-3 bg-white border border-[#E6EDE9] rounded-2xl px-4 py-3 text-sm cursor-pointer hover:border-[#5B7B6E]">
                      <input 
                        type="checkbox" 
                        checked={bilanForm.mainConcerns.includes(sym)}
                        onChange={() => toggleConcern(sym)}
                      />
                      {sym}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Depuis combien de temps ?</label>
                <select 
                  value={bilanForm.duration} 
                  onChange={(e) => setBilanForm({...bilanForm, duration: e.target.value})}
                  className="w-full border border-[#E6EDE9] rounded-2xl p-3.5 text-base" 
                  required
                >
                  <option value="">Choisir...</option>
                  <option value="< 6 mois">Moins de 6 mois</option>
                  <option value="6-18 mois">6 à 18 mois</option>
                  <option value="> 18 mois">Plus de 18 mois</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Ton objectif principal</label>
                <input 
                  type="text" 
                  value={bilanForm.goals}
                  onChange={(e) => setBilanForm({...bilanForm, goals: e.target.value})}
                  placeholder="Ex : mieux dormir, retrouver de l'énergie..."
                  className="w-full border border-[#E6EDE9] rounded-2xl p-3.5 text-base"
                />
              </div>

              <button type="submit" className="btn-primary w-full py-4 rounded-2xl font-semibold text-lg mt-2">
                Voir mon bilan personnalisé
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

            <div className="card rounded-3xl p-8 mb-6">
              <h3 className="font-semibold mb-3">Résumé de tes réponses</h3>
              <p className="text-[#5A6B62] mb-4">
                Âge : {results.ageRange} • Principaux axes : {results.mainConcerns.join(", ")}
              </p>

              <div className="bg-[#F4F7F5] rounded-2xl p-5">
                <div className="font-medium mb-2">Recommandations personnalisées :</div>
                <ul className="space-y-1 text-[#5A6B62]">
                  {results.personalized.recommendations.map((agent: string, i: number) => (
                    <li key={i}>→ Commence par l'agent <strong>{agent}</strong> dans le chat</li>
                  ))}
                </ul>
                <p className="mt-3 text-sm">{results.personalized.message}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
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

            <p className="text-center text-xs text-[#5A6B62] mt-6">
              Tes réponses ont été enregistrées. Tu recevras des conseils par email de temps en temps.
            </p>

            <button onClick={startOver} className="block mx-auto mt-4 text-sm text-[#5B7B6E] hover:underline">
              Recommencer le questionnaire
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
