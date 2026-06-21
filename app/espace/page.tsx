"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Leaf, MessageCircle, Users, FileText, User, 
  Send, ArrowLeft, Lock, BookOpen 
} from 'lucide-react';
import { toast } from 'sonner';

// Lien du groupe WhatsApp que tu as mis sur ton offre Beacons (coaching)
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/IdGLaitmNJFFBtoduhDMdi";

// Liens Beacons (hardcodés pour l'instant - on les mettra en variables d'env plus tard)
const BEACONS_EBOOK_LINK = "https://shop.beacons.ai/yas_digital/44ca0203-408c-489d-b6d3-0a5c0af4fee2";
const BEACONS_COACHING_LINK = "https://shop.beacons.ai/yas_digital/d3e9837a-e734-4b80-8243-479d6c1f0213";
// Plus d'abonnement mensuel : l'ebook à 9.99€ donne l'accès illimité au chat + forum
// Le coaching est l'offre principale d'accompagnement

// Agents disponibles - avec couleurs précises et visuels parlants (alignés landing)
const agents = [
  { id: 'globale', name: 'La Sage Globale', emoji: '🌿', desc: 'Toutes les approches combinées', color: '#4F6B5F', iconBg: '#E8F0EC' },
  { id: 'aromatherapie', name: 'Aromathérapeute', emoji: '🌸', desc: 'Huiles essentielles & synergies', color: '#7C6B9C', iconBg: '#F0E9F8' },
  { id: 'naturopathie', name: 'Naturopathe', emoji: '🌱', desc: 'Terrain & vitalité', color: '#4A6B55', iconBg: '#E8F0E9' },
  { id: 'respiration', name: 'Respiration & Nerf Vague', emoji: '💨', desc: 'Régulation nerveuse', color: '#5A7E7E', iconBg: '#E6F0F0' },
  { id: 'hormones', name: 'Hormones & Ménopause', emoji: '🌙', desc: 'Cycle et équilibre hormonal', color: '#B37E8F', iconBg: '#F8ECF1' },
  { id: 'mtc', name: 'Médecine Chinoise', emoji: '☯️', desc: 'Qi, méridiens, diététique', color: '#B36B5E', iconBg: '#F8EDE9' },
  { id: 'prophetique', name: 'Médecine Prophétique', emoji: '📖', desc: 'Remèdes du Prophète ﷺ', color: '#B38B5E', iconBg: '#F7F0E6' },
  { id: 'alimentation', name: 'Nutrition Thérapeutique', emoji: '🍎', desc: 'Alimentation & micronutrition', color: '#C68E6B', iconBg: '#F9ECE4' },
  { id: 'emotion', name: 'Santé Mentale & Charge Invisible', emoji: '🧠', desc: 'Émotions, burnout, charge mentale', color: '#6C6B9A', iconBg: '#F1EFF8' },
];

// Forum mock (on branchera Supabase plus tard)
const initialPosts = [
  { id: 1, author: "Amina", title: "Huile essentielle pour les bouffées de chaleur ?", content: "Quelles huiles sont les plus adaptées en période de ménopause sans risque ?", replies: 4, agent: "aromatherapie" },
  { id: 2, author: "Fatima", title: "Respiration pour calmer les insomnies", content: "Je cherche des exercices simples à faire le soir qui agissent vraiment sur le nerf vague.", replies: 7, agent: "respiration" },
];

function EspaceContent() {
  const searchParams = useSearchParams();
  const unlocked = searchParams.get('unlocked'); // ebook | coaching | null

  const [activeTab, setActiveTab] = useState<'accueil' | 'chat' | 'forum' | 'protocoles' | 'compte'>('accueil');
  const [selectedAgent, setSelectedAgent] = useState('globale');
  const [posts, setPosts] = useState(initialPosts);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);

  const hasEbook = unlocked === 'ebook' || unlocked === 'coaching';
  const isCoaching = unlocked === 'coaching';
  const justPaid = searchParams.get('paid') === 'true';

  // Limite gratuite : 10 questions. L'ebook à 9,99 € donne l'accès illimité.
  const FREE_QUESTION_LIMIT = 10;
  const [freeQuestionsUsed, setFreeQuestionsUsed] = useState(0);
  const isPremium = unlocked === 'premium' || isCoaching || hasEbook;

  useEffect(() => {
    const saved = localStorage.getItem('sv_free_questions') || '0';
    setFreeQuestionsUsed(parseInt(saved, 10));
  }, []);

  // === NOUVEAUTÉS : Bilan initial, Tips, Articles, Suivi symptômes ===
  const [bilanInitial, setBilanInitial] = useState<any>(null);
  const [symptomLogs, setSymptomLogs] = useState<any[]>([]);
  const [bilanForm, setBilanForm] = useState<{
    ageRange: string;
    mainConcerns: string[];
    goals: string;
    duration: string;
  }>({
    ageRange: '',
    mainConcerns: [],
    goals: '',
    duration: ''
  });
  const [symptomForm, setSymptomForm] = useState<{
    selectedSymptoms: string[];
    intensity: number;
    note: string;
  }>({
    selectedSymptoms: [],
    intensity: 3,
    note: ''
  });
  const [showBilanSuccess, setShowBilanSuccess] = useState(false);

  const symptomsOptions = [
    "Bouffées de chaleur", "Insomnies / Troubles du sommeil", "Fatigue chronique",
    "Anxiété / Stress / Charge mentale", "Irritabilité / Sautes d'humeur",
    "Brouillard mental", "Douleurs articulaires", "Prise de poids",
    "Baisse d'énergie ou de libido", "Troubles digestifs", "Cycle irrégulier ou SPM"
  ];

  const dailyTips = [
    "Aujourd'hui : 3 gouttes de sauge sclarée dans un inhalateur pour équilibrer les hormones.",
    "Astuce : Bois une infusion de sauge + menthe poivrée l'après-midi pour réduire les bouffées.",
    "Pour le nerf vague : 5 min de respiration 4-6 (4 sec inspire, 6 sec expire) avant de dormir.",
    "Nutrition : Ajoute des graines de lin moulues à tes yaourts pour les oméga-3 et phyto-œstrogènes.",
    "Émotionnel : Note 3 choses positives de ta journée avant de te coucher – ça réduit la charge mentale.",
    "Huile essentielle : Mélange lavande + ylang-ylang dans un roll-on pour les nuits agitées.",
    "Mouvement doux : 10 min de marche consciente après manger aide la régulation glycémique.",
    "Plante : Le maca en poudre (1/2 c à c) dans un smoothie pour soutenir l'énergie et les hormones."
  ];

  const miniArticles = [
    { id: 1, title: "Les 5 huiles essentielles pour la ménopause", cat: "Aromathérapie", text: "La lavande apaise, la sauge sclarée équilibre, le géranium régule. Découvre les synergies sûres." },
    { id: 2, title: "Pourquoi le nerf vague est ton meilleur ami", cat: "Régulation nerveuse", text: "80% des signaux corps-cerveau passent par lui. Une respiration lente = moins d'inflammation et meilleur sommeil." },
    { id: 3, title: "Alimentation cycle & ménopause : les bases", cat: "Alimentation", text: "Protéines à chaque repas, oméga-3, fibres et magnésium. Évite les pics de sucre qui aggravent les symptômes." },
    { id: 4, title: "Comment poser des limites sans culpabilité", cat: "Charge mentale", text: "La charge invisible commence par des micro-décisions. Commence par une phrase simple : « Je ne peux pas ce jour-là »." }
  ];

  useEffect(() => {
    const savedBilan = localStorage.getItem('natura_bilan_initial');
    if (savedBilan) setBilanInitial(JSON.parse(savedBilan));

    const savedLogs = localStorage.getItem('natura_symptom_logs');
    if (savedLogs) setSymptomLogs(JSON.parse(savedLogs));
  }, []);

  const getDailyTip = () => {
    const day = new Date().getDate();
    return dailyTips[day % dailyTips.length];
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
    localStorage.setItem('natura_bilan_initial', JSON.stringify(bilanForm));
    setBilanInitial(bilanForm);
    setShowBilanSuccess(true);
    setTimeout(() => setShowBilanSuccess(false), 2500);
  };

  const toggleSymptom = (symptom: string) => {
    setSymptomForm(prev => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.includes(symptom)
        ? prev.selectedSymptoms.filter(s => s !== symptom)
        : [...prev.selectedSymptoms, symptom]
    }));
  };

  const handleLogSymptom = () => {
    if (symptomForm.selectedSymptoms.length === 0) {
      alert("Sélectionne au moins un symptôme.");
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    const newLog = {
      date: today,
      symptoms: [...symptomForm.selectedSymptoms],
      intensity: symptomForm.intensity,
      note: symptomForm.note.trim()
    };
    const updatedLogs = [newLog, ...symptomLogs.filter(l => l.date !== today)].slice(0, 14);
    localStorage.setItem('natura_symptom_logs', JSON.stringify(updatedLogs));
    setSymptomLogs(updatedLogs);
    // Reset form
    setSymptomForm({ selectedSymptoms: [], intensity: 3, note: '' });
  };

  // === Chat IA manuel (fonctionne sans hook externe) ===
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAgentChange = (agentId: string) => {
    setSelectedAgent(agentId);
    setMessages([]); // reset à chaque changement d'experte
    setInput('');
    toast.info(`Tu parles maintenant avec : ${agents.find(a => a.id === agentId)?.name}`);
  };

  const sendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const userMessage = input.trim();
    if (!userMessage || isLoading) return;

    if (freeQuestionsUsed >= FREE_QUESTION_LIMIT && !isPremium) {
      toast.error("Limite de 10 questions gratuites atteinte", {
        description: "Passe à l'ebook pour avoir un accès illimité au chat IA (9,99 € une fois).",
      });
      return;
    }

    const newMessages = [...messages, { role: 'user' as const, content: userMessage }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, agent: selectedAgent }),
      });

      if (!res.ok) throw new Error('Erreur serveur IA');

      // Lecture du stream texte simple (toTextStreamResponse)
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          fullText += decoder.decode(value, { stream: true });
        }
      }

      const aiMessage = fullText.trim() || "Désolé, je n'ai pas pu générer de réponse. Vérifie ta clé XAI_API_KEY.";
      setMessages([...newMessages, { role: 'assistant' as const, content: aiMessage }]);

      // Incrémente le compteur gratuit seulement si pas premium
      if (!isPremium) {
        const newCount = freeQuestionsUsed + 1;
        setFreeQuestionsUsed(newCount);
        localStorage.setItem('sv_free_questions', newCount.toString());
      }
    } catch (err: any) {
      toast.error("Erreur IA", { 
        description: "Vérifie que XAI_API_KEY est configurée dans .env.local ou ajoute un message de test." 
      });
      // Fallback démo
      setMessages([...newMessages, { 
        role: 'assistant', 
        content: `[Mode démo] Merci pour ta question sur ${selectedAgent}. En conditions réelles, la Sage te répondrait avec des conseils précis en ${agents.find(a => a.id === selectedAgent)?.name}. N'oublie pas le disclaimer : ceci n'est pas un avis médical.` 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Simulation d'ajout de post forum
  const handleCreatePost = () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;
    
    const newPost = {
      id: Date.now(),
      author: "Vous",
      title: newPostTitle,
      content: newPostContent,
      replies: 0,
      agent: selectedAgent,
    };
    
    setPosts([newPost, ...posts]);
    setNewPostTitle('');
    setNewPostContent('');
    setShowNewPost(false);
    
    toast.success("Question publiée !", {
      description: "L'IA et la communauté pourront y répondre.",
    });
  };

  // Note : 10 questions gratuites + forum.
  // L'ebook à 9,99 € donne l'accès illimité.
  // Le coaching est l'accompagnement complet.

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar membre */}
      <div className="border-b border-[#E6EDE9] bg-white">
        <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-[#5B7B6E] hover:text-[#2A3A32]">
              <ArrowLeft className="h-4 w-4" /> Retour au site
            </a>
            <div className="h-5 w-px bg-[#E6EDE9]" />
            <div className="flex flex-col items-start">
              <img 
                src="/natura-bio-logo.jpg" 
                alt="natura'bio" 
                className="h-16 md:h-20 w-auto" 
              />
              <div className="text-xs font-medium tracking-tight text-[#5B7B6E] mt-0.5">by yas</div>
            </div>
            <div className="hidden sm:block text-sm text-[#5A6B62] ml-1">Espace Membres</div>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            {isCoaching && (
              <div className="rounded-full bg-[#C5A46E] text-white px-3 py-1 text-xs font-semibold">COACHING ACTIF • 4 semaines</div>
            )}
            <div className="text-[#5A6B62]">Bonjour, chère sœur</div>
            <button 
              onClick={() => {
                // Simulation déconnexion
                window.location.href = "/";
              }}
              className="text-xs px-4 py-1.5 rounded-full border border-[#A8BDB5] hover:bg-[#F8F5F0]"
            >
              Se déconnecter
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-[#E6EDE9]">
          <div className="mx-auto max-w-7xl px-6 flex gap-1 text-sm">
            {[
              { id: 'accueil', label: 'Accueil', icon: Leaf },
              { id: 'chat', label: 'Chat IA', icon: MessageCircle },
              { id: 'forum', label: 'Forum', icon: Users },
              { id: 'protocoles', label: 'Mes Protocoles', icon: FileText },
              { id: 'compte', label: 'Mon Compte', icon: User },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium transition ${activeTab === tab.id 
                    ? 'border-[#5B7B6E] text-[#2A3A32]' 
                    : 'border-transparent text-[#5A6B62] hover:text-[#2A3A32]'}`}
                >
                  <Icon className="h-4 w-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl w-full px-6 py-8 flex-1">
        {justPaid && (
          <div className="mb-6 rounded-2xl bg-[#5B7B6E] text-white p-4 text-center text-sm font-medium">
            Paiement reçu avec succès via PayPal 🎉 Bienvenue dans ton espace. Ton ebook est prêt à être téléchargé.
          </div>
        )}

        {/* ACCUEIL */}
        {activeTab === 'accueil' && (
          <div className="max-w-4xl">
            <h1 className="text-4xl font-semibold tracking-tight mb-3">Bienvenue dans l&apos;Espace Membres</h1>
            <p className="text-xl text-[#5A6B62] mb-4">
              10 questions gratuites + forum. L&apos;ebook à 9,99 € donne l&apos;accès illimité au chat. Le coaching est l&apos;accompagnement complet.
            </p>

            {/* Lien vers le bilan public (email collection) + perso */}
            <div className="mb-8">
              <a href="/bilan" className="inline-flex items-center gap-2 text-sm font-medium text-[#5B7B6E] hover:underline">
                → Faire ou refaire ton bilan initial (avec email pour la newsletter)
              </a>
              {(() => {
                const leads = JSON.parse(localStorage.getItem('natura_leads') || '[]');
                if (leads.length > 0) {
                  const last = leads[0];
                  return (
                    <div className="mt-3 text-sm bg-[#F4F7F5] p-3 rounded-2xl">
                      <strong>Ton dernier bilan :</strong> {last.mainConcerns?.slice(0,2).join(", ")}... 
                      <span className="text-[#5B7B6E]"> Recommandation : commence par l'agent le plus pertinent dans le chat.</span>
                    </div>
                  );
                }
                return null;
              })()}
            </div>

            {/* DAILY TIP - style Cara interactions, adapté à ton univers */}
            <div className="card rounded-3xl p-6 mb-8 border border-[#E6EDE9] bg-gradient-to-br from-[#F4F7F5] to-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="uppercase tracking-[2px] text-xs font-medium text-[#5B7B6E]">TIP DU JOUR</div>
                  <div className="font-semibold text-lg">Conseil naturel pour aujourd'hui</div>
                </div>
                <span className="text-3xl">🌿</span>
              </div>
              <p className="text-[#2A3A32] mb-4 leading-relaxed">{getDailyTip()}</p>
              <button 
                onClick={() => {
                  // Simple interaction: "mark as done" for today
                  const today = new Date().toISOString().slice(0,10);
                  localStorage.setItem('natura_tip_done_' + today, 'true');
                  alert("Merci ! Tip notée. Tu peux la retrouver dans tes protocoles.");
                }}
                className="text-xs px-4 py-1.5 rounded-full border border-[#5B7B6E]/30 hover:bg-[#5B7B6E] hover:text-white transition"
              >
                J'utilise ce tip aujourd'hui
              </button>
            </div>

            {/* BILAN INITIAL - premier accès */}
            {!bilanInitial ? (
              <div className="card rounded-3xl p-8 mb-8 border-2 border-[#5B7B6E]">
                <div className="text-[#5B7B6E] text-sm font-medium tracking-[2px] mb-1">PREMIER PAS</div>
                <h2 className="text-2xl font-semibold tracking-tight mb-2">Questionnaire de bilan initial</h2>
                <p className="text-[#5A6B62] mb-6">Pour t&apos;accompagner au mieux, dis-nous où tu en es. Ça prend 1 minute.</p>

                <form onSubmit={handleBilanSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tranche d&apos;âge</label>
                    <select 
                      value={bilanForm.ageRange} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBilanForm({...bilanForm, ageRange: e.target.value})}
                      className="w-full border border-[#E6EDE9] rounded-xl p-3 text-sm"
                      required
                    >
                      <option value="">Choisir...</option>
                      <option value="35-44">35-44 ans</option>
                      <option value="45-54">45-54 ans</option>
                      <option value="55+">55 ans et +</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Tes principaux symptômes / préoccupations (plusieurs choix possibles)</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {symptomsOptions.map(sym => (
                        <label key={sym} className="flex items-center gap-2 text-sm cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={bilanForm.mainConcerns.includes(sym)}
                            onChange={() => toggleConcern(sym)}
                            className="accent-[#5B7B6E]"
                          />
                          {sym}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Depuis combien de temps ressens-tu cela ?</label>
                    <select 
                      value={bilanForm.duration} 
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setBilanForm({...bilanForm, duration: e.target.value})}
                      className="w-full border border-[#E6EDE9] rounded-xl p-3 text-sm"
                    >
                      <option value="">Choisir...</option>
                      <option value="< 6 mois">Moins de 6 mois</option>
                      <option value="6-18 mois">6 à 18 mois</option>
                      <option value="> 18 mois">Plus de 18 mois</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Ton objectif principal en ce moment</label>
                    <input 
                      type="text" 
                      value={bilanForm.goals}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBilanForm({...bilanForm, goals: e.target.value})}
                      placeholder="Ex: mieux dormir, retrouver de l'énergie, comprendre mes bouffées..."
                      className="w-full border border-[#E6EDE9] rounded-xl p-3 text-sm"
                    />
                  </div>

                  <button type="submit" className="btn-primary w-full py-3 rounded-2xl font-semibold mt-2">
                    Enregistrer mon bilan
                  </button>
                </form>
              </div>
            ) : (
              <div className="card rounded-3xl p-6 mb-6 bg-[#F4F7F5]">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[#5B7B6E]">✓</span> 
                  <span className="font-medium">Bilan initial enregistré</span>
                </div>
                <p className="text-sm text-[#5A6B62]">
                  Merci ! Tu peux maintenant explorer le chat en commençant par les agents qui correspondent à tes préoccupations.
                </p>
                {showBilanSuccess && <p className="text-[#5B7B6E] text-sm mt-2">Merci, ton bilan est sauvegardé localement.</p>}
              </div>
            )}

            {/* TIP DU JOUR */}
            <div className="card rounded-3xl p-6 mb-8 border border-[#E6EDE9]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">💡</span>
                <span className="uppercase tracking-[2px] text-xs font-medium text-[#5B7B6E]">TIP DU JOUR</span>
              </div>
              <p className="text-[#2A3A32] font-medium leading-relaxed">{getDailyTip()}</p>
            </div>

            {/* MINI ARTICLES */}
            <div className="mb-10">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-semibold text-xl tracking-tight">Mini-articles &amp; ressources</h3>
                <span className="text-xs text-[#5A6B62]">Pour aller plus loin</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {miniArticles.map(article => (
                  <div key={article.id} className="card rounded-2xl p-5 border border-[#E6EDE9]">
                    <div className="text-[10px] uppercase tracking-widest text-[#5B7B6E] mb-1">{article.cat}</div>
                    <div className="font-semibold mb-2 leading-tight">{article.title}</div>
                    <p className="text-sm text-[#5A6B62]">{article.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* GRILLE EXISTANTE */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              <div className="card rounded-3xl p-7 cursor-pointer" onClick={() => setActiveTab('chat')}>
                <MessageCircle className="h-7 w-7 text-[#5B7B6E] mb-4" />
                <div className="font-semibold text-xl">Parler avec les agents IA</div>
                <p className="mt-2 text-[#5A6B62]">9 expertes spécialisées dont une dédiée à la charge mentale et aux émotions. Gratuit (10 questions).</p>
              </div>

              <div className="card rounded-3xl p-7 cursor-pointer" onClick={() => setActiveTab('forum')}>
                <Users className="h-7 w-7 text-[#5B7B6E] mb-4" />
                <div className="font-semibold text-xl">Rejoindre la communauté</div>
                <p className="mt-2 text-[#5A6B62]">Pose tes questions et partage tes expériences avec d&apos;autres femmes. Gratuit.</p>
              </div>

              <div 
                className="card rounded-3xl p-7 cursor-pointer" 
                style={{ borderColor: '#D9D4EC' }}
                onClick={() => {
                  setActiveTab('chat');
                  setSelectedAgent('emotion');
                }}
              >
                <div 
                  className="inline-flex h-12 w-12 items-center justify-center rounded-2xl text-3xl mb-4"
                  style={{ backgroundColor: '#F1EFF8' }}
                >
                  🧠
                </div>
                <div className="font-semibold text-xl">Santé Mentale &amp; Charge Invisible</div>
                <p className="mt-2 text-[#5A6B62]">Inventaires concrets, protocoles pour poser des limites, travail émotionnel et régulation nerveuse. Section dédiée.</p>
                <div className="mt-3 text-sm font-medium" style={{ color: '#6C6B9A' }}>Accéder à l&apos;agent dédié →</div>
              </div>

              {hasEbook && (
                <a 
                  href="/api/download/ebook?paid=true" 
                  className="card rounded-3xl p-7 flex flex-col hover:border-[#5B7B6E] border-2 border-[#5B7B6E]/30"
                  download
                >
                  <div className="mb-4 text-[#5B7B6E]">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <div className="font-semibold text-xl">Télécharger mon ebook</div>
                  <p className="mt-2 text-[#5A6B62] text-sm">Menopause au Naturel – PDF complet</p>
                  <div className="mt-auto pt-3 text-xs text-[#C5A46E]">Clique pour télécharger →</div>
                </a>
              )}

              <a 
                href={WHATSAPP_GROUP_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="card rounded-3xl p-7 flex flex-col hover:border-[#5B7B6E] border-2 border-[#5B7B6E]/30"
              >
                <div className="mb-4 text-[#5B7B6E] text-3xl">💬</div>
                <div className="font-semibold text-xl">Groupe WhatsApp</div>
                <p className="mt-2 text-[#5A6B62] text-sm">Le groupe inclus avec l&apos;offre coaching sur Beacons.</p>
                <div className="mt-auto pt-3 text-xs text-[#C5A46E]">Ouvrir le groupe →</div>
              </a>
            </div>

            {/* SUIVI SYMPTÔMES */}
            <div className="mb-10">
              <h3 className="font-semibold text-xl tracking-tight mb-1">Suivi de tes symptômes</h3>
              <p className="text-sm text-[#5A6B62] mb-4">Note tes ressentis au fil des jours pour voir les tendances et ajuster tes protocoles.</p>

              <div className="card rounded-3xl p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Symptômes */}
                  <div>
                    <div className="text-sm font-medium mb-2">Symptômes du jour</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm mb-3">
                      {symptomsOptions.map(sym => (
                        <label key={sym} className="flex items-center gap-2 cursor-pointer py-0.5 interactive">
                          <input 
                            type="checkbox" 
                            checked={symptomForm.selectedSymptoms.includes(sym)}
                            onChange={() => toggleSymptom(sym)}
                            className="accent-[var(--mint)]"
                          />
                          {sym}
                        </label>
                      ))}
                    </div>
                    {/* Live summary - interaction style Cara */}
                    {symptomForm.selectedSymptoms.length > 0 && (
                      <div className="text-xs bg-[#F4F7F5] p-2 rounded-lg">
                        Aujourd'hui : {symptomForm.selectedSymptoms.length} symptôme(s) • Intensité {symptomForm.intensity}/5
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1">Intensité globale (1 = léger, 5 = très fort)</div>
                      <input 
                        type="range" 
                        min="1" max="5" step="1"
                        value={symptomForm.intensity}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSymptomForm({...symptomForm, intensity: parseInt(e.target.value)})}
                        className="w-full accent-[#5B7B6E]"
                      />
                      <div className="flex justify-between text-xs text-[#5A6B62] mt-0.5">
                        <span>1</span><span>2</span><span>3</span><span>4</span><span>5</span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1">Notes (optionnel)</div>
                      <textarea 
                        value={symptomForm.note}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSymptomForm({...symptomForm, note: e.target.value})}
                        placeholder="Ex: Nuit agitée après le repas du soir..."
                        className="w-full border border-[#E6EDE9] rounded-xl p-3 text-sm h-20 resize-y"
                      />
                    </div>

                    <button 
                      onClick={handleLogSymptom}
                      className="btn-primary w-full py-3 rounded-2xl font-semibold text-sm"
                    >
                      Enregistrer le suivi d&apos;aujourd&apos;hui
                    </button>
                  </div>
                </div>
              </div>

              {/* Historique récent + mini graphique */}
              {symptomLogs.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2 text-[#5A6B62]">Évolution récente</div>
                  
                  {/* Simple bar graph - style Cara interactions */}
                  <div className="flex gap-2 items-end h-16 mb-4 bg-[#F4F7F5] rounded-2xl p-3">
                    {symptomLogs.slice(0, 7).reverse().map((log, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center group">
                        <div 
                          className="w-full rounded-t transition-all group-hover:brightness-110" 
                          style={{ 
                            height: `${(log.intensity / 5) * 100}%`, 
                            minHeight: '6px',
                            backgroundColor: log.intensity > 3 ? 'var(--blush)' : 'var(--mint)'
                          }}
                        />
                        <div className="text-[9px] text-[#5A6B62] mt-1 font-mono">{log.date.slice(5)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    {symptomLogs.slice(0, 5).map((log, idx) => (
                      <div key={idx} className="text-sm flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 border-l-2 border-[#E6EDE9] pl-3">
                        <span className="font-mono text-xs text-[#5B7B6E] w-20 flex-shrink-0">{log.date}</span>
                        <span className="text-[#5A6B62]">
                          {log.symptoms.join(", ")} • Intensité {log.intensity}/5
                        </span>
                        {log.note && <span className="text-[#5A6B62] italic">— {log.note}</span>}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#5A6B62] mt-3">Graphique des 7 derniers jours (hauteur = intensité).</p>
                </div>
              )}
            </div>

            {/* OFFRES - Ebook pour illimité, Coaching pour l'accompagnement profond */}
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Passe à l&apos;illimité ou au coaching</h2>
              <p className="text-[#5A6B62] mb-6">L&apos;ebook te donne l&apos;accès illimité. Le coaching est l&apos;accompagnement complet et transformateur.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <a 
                href={BEACONS_EBOOK_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="card rounded-3xl p-7 hover:border-[#5B7B6E] border border-[#5B7B6E]/30 flex flex-col"
              >
                <div className="uppercase tracking-[2px] text-xs text-[#5B7B6E] mb-1">ACCÈS ILLIMITÉ</div>
                <div className="font-semibold text-xl mb-1">Ebook + Chat Illimité</div>
                <div className="text-3xl font-semibold tabular-nums mb-3">9,99 € <span className="text-base font-normal">une fois</span></div>
                <p className="text-[#5A6B62] mb-4">Accès illimité au chat IA + forum + l'ebook complet "Ménopause au Naturel &amp; Régulation Hormonale". Idéal pour avancer à ton rythme.</p>
                <div className="mt-auto text-[#5B7B6E] font-semibold">Accéder à l&apos;illimité →</div>
              </a>

              <a 
                href={BEACONS_COACHING_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="card rounded-3xl p-7 hover:border-[#C5A46E] border-2 border-[#C5A46E] flex flex-col relative"
              >
                <div className="absolute -top-3 right-8 bg-[#C5A46E] text-white text-xs font-semibold px-4 py-1 rounded-full tracking-widest">LE PLUS TRANSFORMATEUR</div>
                <div className="uppercase tracking-[2px] text-xs text-[#C5A46E] mb-1">ACCOMPAGNEMENT PERSONNALISÉ</div>
                <div className="font-semibold text-xl mb-1">Coaching 4 semaines sur mesure</div>
                <div className="text-3xl font-semibold tabular-nums mb-3">299,99 €</div>
                <p className="text-[#5A6B62] mb-4">Protocole complet + visio + suivi 4 semaines + groupe WhatsApp + chat privé avec moi.</p>
                <div className="mt-auto text-[#C5A46E] font-semibold">Réserver le coaching →</div>
              </a>
            </div>

            {isCoaching && (
              <div className="mt-8 p-6 rounded-3xl bg-[#2C3F36] text-white">
                <div className="font-semibold mb-1">Coaching actif</div>
                <div>Ton protocole personnalisé et ton suivi sont disponibles. Merci d&apos;être dans l&apos;accompagnement.</div>
              </div>
            )}
          </div>
        )}

        {/* CHAT IA — Le cœur du produit */}
        {activeTab === 'chat' && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex justify-between items-start">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">Chat avec les sages</h2>
                <p className="text-[#5A6B62]">Choisis l&apos;experte qui te parle aujourd&apos;hui. 9 agents dont un dédié à la charge mentale et aux émotions.</p>
              </div>
              <div className="text-right text-sm font-medium text-[#5B7B6E]">
                {isPremium 
                  ? "Accès illimité (via ebook)" 
                  : `Questions gratuites : ${freeQuestionsUsed} / ${FREE_QUESTION_LIMIT}`}
              </div>
            </div>

            {/* Sélecteur d'agents - couleurs précises + visuels parlants */}
            <div className="flex flex-wrap gap-2 mb-6">
              {agents.map(agent => {
                const isActive = selectedAgent === agent.id;
                return (
                  <button
                    key={agent.id}
                    onClick={() => handleAgentChange(agent.id)}
                    className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm transition ${isActive 
                      ? 'text-white border-transparent shadow-sm' 
                      : 'bg-white hover:bg-[#F8F5F0] border-[#E6EDE9]'}`}
                    style={isActive ? { backgroundColor: agent.color } : {}}
                  >
                    <span className="text-base">{agent.emoji}</span>
                    <span className="font-medium">{agent.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Zone de chat */}
            <div className="card rounded-3xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#F8F5F0]">
                {messages.length === 0 && (
                  <div className="text-center py-12 text-[#5A6B62]">
                    {(() => {
                      const current = agents.find(a => a.id === selectedAgent);
                      return (
                        <>
                          <div 
                            className="mx-auto mb-4 inline-flex h-20 w-20 items-center justify-center rounded-3xl text-4xl"
                            style={{ backgroundColor: current?.iconBg }}
                          >
                            {current?.emoji}
                          </div>
                          <p className="font-medium">Pose ta première question à {current?.name}.</p>
                          <p className="text-sm mt-2 max-w-xs mx-auto">Exemple : « Quelles huiles pour les bouffées de chaleur en période de ménopause ? »</p>
                        </>
                      );
                    })()}
                  </div>
                )}

                {messages.map((m, idx) => (
                  <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] px-5 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                      {m.content}
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="chat-bubble-ai px-5 py-3 text-sm text-[#5A6B62]">La Sage réfléchit...</div>
                  </div>
                )}
              </div>

              {freeQuestionsUsed >= FREE_QUESTION_LIMIT && !isPremium ? (
                <div className="border-t p-6 bg-white text-center">
                  <p className="font-medium mb-3">Tu as utilisé tes 10 questions gratuites.</p>
                  <a 
                    href={BEACONS_EBOOK_LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary inline-block px-8 py-3 rounded-2xl font-semibold"
                  >
                    Accéder à l&apos;illimité avec l&apos;ebook à 9,99 €
                  </a>
                  <p className="text-xs text-[#5A6B62] mt-3">Accès illimité au chat IA + forum + l'ebook complet.</p>
                </div>
              ) : (
                <form onSubmit={sendMessage} className="border-t p-4 bg-white flex gap-3">
                  <input
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    placeholder="Écris ta question sur la santé au naturel..."
                    className="flex-1 bg-[#F8F5F0] border border-[#E6EDE9] rounded-2xl px-5 py-3 focus:outline-none focus:border-[#A8BDB5]"
                    disabled={isLoading}
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading || !input.trim()}
                    className="btn-primary rounded-2xl px-6 disabled:opacity-60"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              )}

              <div className="px-6 py-2 text-[10px] text-center text-[#5A6B62] bg-white border-t">
                Ceci n’est pas un avis médical. Les réponses de l’IA sont éducatives. Consultez toujours un praticien qualifié.
              </div>
            </div>
          </div>
        )}

        {/* FORUM */}
        {activeTab === 'forum' && (
          <div className="max-w-3xl">
            <div className="flex justify-between items-end mb-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">Forum de la communauté</h2>
                <p className="text-[#5A6B62]">Partage, pose tes questions, bénéficie de l&apos;expérience collective + réponses IA.</p>
              </div>
              <button onClick={() => setShowNewPost(!showNewPost)} className="btn-primary px-5 py-2 rounded-2xl text-sm font-medium">
                Poser une question
              </button>
            </div>

            {showNewPost && (
              <div className="card rounded-3xl p-6 mb-8">
                <input 
                  value={newPostTitle} 
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPostTitle(e.target.value)} 
                  placeholder="Titre de ta question" 
                  className="w-full mb-3 rounded-xl border px-4 py-3" 
                />
                <textarea 
                  value={newPostContent} 
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewPostContent(e.target.value)} 
                  placeholder="Décris ta situation ou ta question en détail..." 
                  className="w-full h-28 rounded-xl border p-4 mb-3 resize-y" 
                />
                <div className="flex gap-3">
                  <button onClick={handleCreatePost} className="btn-primary px-6 py-2 rounded-2xl text-sm">Publier</button>
                  <button onClick={() => setShowNewPost(false)} className="btn-secondary px-6 py-2 rounded-2xl text-sm">Annuler</button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="forum-post card rounded-3xl p-6 border border-[#E6EDE9]">
                  <div className="font-semibold text-lg mb-1">{post.title}</div>
                  <div className="text-sm text-[#5A6B62] mb-3">Par {post.author} • {post.replies} réponses</div>
                  <p className="text-[15px]">{post.content}</p>
                  <div className="mt-4 text-xs px-3 py-1 inline-block rounded bg-[#E6EDE9] text-[#5B7B6E]">
                    {agents.find(a => a.id === post.agent)?.name || 'Discussion'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROTOCOLES */}
        {activeTab === 'protocoles' && (
          <div className="max-w-2xl">
            <h2 className="text-3xl font-semibold tracking-tight mb-2">Mes protocoles</h2>
            {!isCoaching ? (
              <div className="card rounded-3xl p-8 mt-4 text-[#5A6B62]">
                Les protocoles personnalisés sont réservés aux femmes en coaching 4 semaines.<br /><br />
                Tu peux déjà utiliser le Chat IA pour obtenir des pistes et les noter ici manuellement.
              </div>
            ) : (
              <div>
                <div className="card rounded-3xl p-8 mb-6">
                  <div className="font-semibold mb-2 text-lg">Ton protocole 4 semaines — Ménopause &amp; Énergie</div>
                  <div className="text-sm text-[#5A6B62] mb-4">Créé le 12 juin 2026 • À revoir lors du prochain point</div>
                  <ul className="space-y-2 text-[15px] list-disc pl-5">
                    <li>Matin : Tisane fenouil + gingembre + 2 gouttes d’huile essentielle de sauge sclarée (diffusion)</li>
                    <li>Exercice nerf vague : 3 × 5 min de respiration 4-7-8 avant les repas</li>
                    <li>Alimentation : Réduction des sucres rapides + graines de nigelle 1 c. à café le matin</li>
                    <li>Point d’acupression : Rate 6 (SP6) 2 min matin et soir</li>
                  </ul>
                </div>
                <p className="text-xs text-[#5A6B62]">Ce protocole a été établi lors de notre appel. Il sera ajusté selon tes retours dans le chat privé.</p>
              </div>
            )}
          </div>
        )}

        {/* COMPTE */}
        {activeTab === 'compte' && (
          <div className="max-w-md">
            <h2 className="text-3xl font-semibold tracking-tight mb-6">Mon compte</h2>
            <div className="card rounded-3xl p-8 space-y-4 text-sm">
              <div><span className="text-[#5A6B62]">Statut :</span> <span className="font-medium">{isCoaching ? 'Coaching 4 semaines actif' : 'Accès Ebook + Communauté'}</span></div>
              <div><span className="text-[#5A6B62]">Email :</span> demo@sagessevitale.fr (simulation)</div>
              <div><span className="text-[#5A6B62]">Membre depuis :</span> Aujourd’hui</div>
              {isCoaching && <div className="pt-2 text-[#C5A46E]">Chat privé avec la coach activé</div>}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER - Logo visible en bas */}
      <footer className="border-t border-[#E6EDE9] bg-white py-6 mt-auto">
        <div className="mx-auto max-w-7xl px-6 flex justify-center">
          <div className="flex flex-col items-center">
            <img 
              src="/natura-bio-logo.jpg" 
              alt="natura'bio" 
              className="h-14 w-auto mb-1" 
            />
            <div className="text-[10px] font-medium tracking-tight text-[#5B7B6E]">by yas</div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function EspaceMembres() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement de ton espace...</div>}>
      <EspaceContent />
    </Suspense>
  );
}
