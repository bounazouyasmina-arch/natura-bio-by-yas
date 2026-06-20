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
const BEACONS_PREMIUM_MONTHLY_LINK = "https://shop.beacons.ai/yas_digital/REMPLACE_PAR_TON_LIEN_MENSUEL"; // TODO: remplace par le vrai lien mensuel 9.99€ quand tu l'auras

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

  // Limite gratuite : 10 questions avant de passer en premium illimité
  const FREE_QUESTION_LIMIT = 10;
  const [freeQuestionsUsed, setFreeQuestionsUsed] = useState(0);
  const isPremium = unlocked === 'premium' || isCoaching || hasEbook;

  useEffect(() => {
    const saved = localStorage.getItem('sv_free_questions') || '0';
    setFreeQuestionsUsed(parseInt(saved, 10));
  }, []);

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
        description: "Passe en illimité à 9,99 €/mois pour continuer (ebook ménopause & hormones inclus).",
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

  // Note : L'espace Chat IA + Forum est maintenant gratuit pour tout le monde.
  // Les offres premium (ebook et coaching) sont proposées à l'intérieur via liens Beacons.

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
              <div className="text-base font-semibold tracking-tight text-[#5B7B6E] mt-0.5">by yas</div>
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
            <p className="text-xl text-[#5A6B62] mb-8">
              Accès gratuit au Chat IA + Forum communautaire. Explore les 8 piliers physiques + la section dédiée à la charge mentale et aux émotions.
            </p>

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

            {/* UPSELLS PREMIUM - visible pour tous */}
            <div className="mb-4">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">Passe à l&apos;offre Premium</h2>
              <p className="text-[#5A6B62] mb-6">Pour aller plus loin avec des protocoles détaillés et un accompagnement personnalisé.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <a 
                href={BEACONS_PREMIUM_MONTHLY_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="card rounded-3xl p-7 hover:border-[#5B7B6E] border-2 border-[#C5A46E]/40 flex flex-col"
              >
                <div className="font-semibold text-xl mb-1">Passer en Illimité</div>
                <div className="text-3xl font-semibold tabular-nums mb-3">9,99 € <span className="text-base font-normal">/ mois</span></div>
                <p className="text-[#5A6B62] mb-4">Questions illimitées dans le chat IA + Ebook complet "Ménopause au Naturel &amp; Régulation Hormonale" offert. Annule à tout moment.</p>
                <div className="mt-auto text-[#C5A46E] font-semibold">S&apos;abonner sur Beacons →</div>
              </a>

              <a 
                href={BEACONS_COACHING_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="card rounded-3xl p-7 hover:border-[#5B7B6E] border-2 border-[#C5A46E]/40 flex flex-col"
              >
                <div className="font-semibold text-xl mb-1">Approfondir : Coaching sur mesure</div>
                <div className="text-3xl font-semibold tabular-nums mb-3">299,99 €</div>
                <p className="text-[#5A6B62] mb-4">Protocole personnalisé pour une problématique spécifique + visio + suivi 4 semaines + groupe WhatsApp dédié.</p>
                <div className="mt-auto text-[#C5A46E] font-semibold">Réserver le coaching sur Beacons →</div>
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
                  ? "Illimité (Premium actif)" 
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
                    href={BEACONS_PREMIUM_MONTHLY_LINK} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn-primary inline-block px-8 py-3 rounded-2xl font-semibold"
                  >
                    Passer en illimité à 9,99 €/mois + ebook offert
                  </a>
                  <p className="text-xs text-[#5A6B62] mt-3">Questions illimitées + Ebook Ménopause &amp; Hormones inclus.</p>
                </div>
              ) : (
                <form onSubmit={sendMessage} className="border-t p-4 bg-white flex gap-3">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
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
                  onChange={e => setNewPostTitle(e.target.value)} 
                  placeholder="Titre de ta question" 
                  className="w-full mb-3 rounded-xl border px-4 py-3" 
                />
                <textarea 
                  value={newPostContent} 
                  onChange={e => setNewPostContent(e.target.value)} 
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
            <div className="text-[10px] font-medium text-[#5B7B6E]">by yas</div>
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
