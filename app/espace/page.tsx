"use client";

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Leaf, MessageCircle, Users, FileText, User, 
  Send, ArrowLeft, Lock, BookOpen 
} from 'lucide-react';
import { toast } from 'sonner';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import AuthPanel from '@/components/AuthPanel';
import {
  type AccessTier,
  getAccessLabel,
  hasCoachingAccess,
  hasEbookAccess,
  isPremiumAccess,
  clearStoredAccess,
  readAccessSince,
  readStoredAccessTier,
  resolveAccessTier,
  saveAccessTier,
} from '@/lib/member-access';
import { tryCreateClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';
import { toFriendlyNetworkError } from '@/lib/auth-errors';
import {
  type ForumPost,
  type ForumReply,
  type DbForumPost,
  type DbForumReply,
  mapDbPost,
} from '@/lib/forum-types';

// Lien du groupe WhatsApp que tu as mis sur ton offre Beacons (coaching)
const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/IdGLaitmNJFFBtoduhDMdi";

// Liens Beacons (hardcodés pour l'instant - on les mettra en variables d'env plus tard)
const BEACONS_EBOOK_LINK = "https://shop.beacons.ai/yas_digital/44ca0203-408c-489d-b6d3-0a5c0af4fee2";
const BEACONS_COACHING_LINK = "https://shop.beacons.ai/yas_digital/d3e9837a-e734-4b80-8243-479d6c1f0213";
const BEACONS_DISCOVERY_CALL_LINK =
  "https://shop.beacons.ai/yas_digital/bd259c7a-68ac-41c9-b9e4-6cb05237713c";

const COACHING_START_KEY = 'natura_coaching_started_at';
const COACHING_NOTES_KEY = 'natura_coaching_notes';
const COACHING_CHECKS_KEY = 'natura_coaching_checks';

const COACHING_WEEKS: Array<{ week: number; title: string; focus: string; items: string[] }> = [
  {
    week: 1,
    title: 'Semaine 1 — Poser le cadre',
    focus: 'Bilan, limites douces, une micro-habitude',
    items: [
      'Noter ta charge mentale (tâches / émotions / décisions / culpabilité)',
      'Choisir 1 limite à poser cette semaine (une phrase simple)',
      'Ancrage soir : 5 min respiration ou décharge mentale écrite',
      'Partager à Yas ce qui pèse le plus en ce moment',
    ],
  },
  {
    week: 2,
    title: 'Semaine 2 — Rythme & tête qui tourne',
    focus: 'Sommeil, rumination, organisation du quotidien',
    items: [
      'Rituel du soir fixe (même heure ±30 min, 3 soirs test)',
      'Sortir 3 décisions de ta tête (liste / batching)',
      'Une pause réelle de 10 min sans téléphone',
      'Ajuster avec Yas selon ton énergie et ton sommeil',
    ],
  },
  {
    week: 3,
    title: 'Semaine 3 — Corps & outils naturels',
    focus: 'Soutenir le terrain sans te surcharger',
    items: [
      'Appliquer 1–2 outils du protocole (plantes, souffle, huiles si adaptés)',
      'Observer ton corps : tension, digestion, cycle, fatigue',
      'Alléger une charge relationnelle (ce qui n’est pas ton job)',
      'Point d’étape avec Yas : ce qui marche / ce qui coince',
    ],
  },
  {
    week: 4,
    title: 'Semaine 4 — Ancrer & continuer',
    focus: 'Autonomie, rituels durables, suite éventuelle',
    items: [
      'Garder tes 2–3 rituels non négociables',
      'Écrire ce que tu ne veux plus reporter seule',
      'Préparer la suite (autonomie, ebook, ou prolongement si besoin)',
      'Célébrer ce qui a changé — même petit',
    ],
  },
];

function getCoachingWeekNumber(startedAt: string | null): number {
  if (!startedAt) return 0;
  const start = new Date(startedAt).getTime();
  if (Number.isNaN(start)) return 0;
  const days = Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24));
  if (days < 0) return 1;
  return Math.min(4, Math.floor(days / 7) + 1);
}

// Ebook Hormones Sereine (9,99 €) : accès illimité chat + forum + PDF
// Le coaching est l'offre principale d'accompagnement

// Agents disponibles - avec couleurs précises et visuels parlants (alignés landing)
const agents = [
  { id: 'globale', name: 'La Sage Globale', emoji: '🌿', desc: 'Toutes les approches combinées', color: '#4F6B5F', iconBg: '#E8F0EC' },
  { id: 'aromatherapie', name: 'Aromathérapeute', emoji: '🌸', desc: 'Huiles essentielles & usages concrets', color: '#7C6B9C', iconBg: '#F0E9F8' },
  { id: 'naturopathie', name: 'Naturopathe', emoji: '🌱', desc: 'Terrain, vitalité & immunité', color: '#4A6B55', iconBg: '#E8F0E9' },
  { id: 'respiration', name: 'Respiration & Nerf Vague', emoji: '💨', desc: 'Calme nerveux et exercices concrets', color: '#5A7E7E', iconBg: '#E6F0F0' },
  { id: 'hormones', name: 'Équilibre Hormonal', emoji: '🌙', desc: 'Cycle, énergie et bien-être hormonal', color: '#B37E8F', iconBg: '#F8ECF1' },
  { id: 'mtc', name: 'Médecine Chinoise', emoji: '☯️', desc: 'Qi, méridiens, diététique', color: '#B36B5E', iconBg: '#F8EDE9' },
  { id: 'prophetique', name: 'Médecine Prophétique', emoji: '📖', desc: 'Remèdes du Prophète ﷺ', color: '#B38B5E', iconBg: '#F7F0E6' },
  { id: 'alimentation', name: 'Nutrition Thérapeutique', emoji: '🍎', desc: 'Alimentation & micronutrition', color: '#C68E6B', iconBg: '#F9ECE4' },
  { id: 'emotion', name: 'Santé Mentale & Charge Invisible', emoji: '🧠', desc: 'Émotions, burnout, charge mentale', color: '#6C6B9A', iconBg: '#F1EFF8' },
];

// Fallback si Supabase n'est pas encore configuré
const seedPosts: ForumPost[] = [
  {
    id: 'local-1',
    author: 'Amina',
    title: "Huiles pour l'anxiété et le stress ?",
    content:
      "Quelles huiles sont les plus adaptées pour calmer l'anxiété au quotidien sans risque ? J'ai 32 ans, stress de travail, je veux quelque chose de simple.",
    agent: 'aromatherapie',
    date: '10 juil. 2026',
    replies: [
      {
        id: 'local-11',
        author: 'Sara',
        content:
          "Pour moi, un roll-on dilué avec de l’huile essentielle de lavande sur les poignets, associé à deux ou trois respirations lentes, a vraiment aidé.",
        date: '10 juil. 2026',
        isExample: true,
      },
    ],
  },
  {
    id: 'local-2',
    author: 'Fatima',
    title: 'Respiration pour calmer les insomnies',
    content:
      'Je cherche des exercices simples à faire le soir qui agissent vraiment sur le nerf vague. Je me réveille souvent vers 3h.',
    agent: 'respiration',
    date: '12 juil. 2026',
    replies: [
      {
        id: 'local-21',
        author: 'Leila',
        content:
          "La 4-7-8 m'a aidée : inspire 4, retiens 7, expire 8, ×4. Dans le noir, sans regarder l'heure si je me réveille.",
        date: '12 juil. 2026',
        isExample: true,
      },
    ],
  },
];

function EspaceContent() {
  const searchParams = useSearchParams();
  const unlockedParam = searchParams.get('unlocked');
  const fromBeacons = searchParams.get('from') === 'beacons';
  const showWelcome = searchParams.get('welcome') === '1';
  const linkedParam = searchParams.get('linked') === '1';
  const tabParam = searchParams.get('tab');
  const agentParam = searchParams.get('agent');

  // Exemples variés et adaptés à TOUT public (jeunes, adultes, tous âges) - pas que hormones/ménopause
  const agentExamples: Record<string, string> = {
    globale: 'Comment combiner plusieurs approches naturelles pour mieux gérer le stress, le sommeil et l\'énergie au quotidien ?',
    aromatherapie: 'Quelles huiles essentielles me conseilles-tu pour apaiser l\'anxiété, améliorer mon sommeil ou soulager des maux de tête, et comment les utiliser concrètement ?',
    naturopathie: 'Quels remèdes naturels et plantes pour booster l\'immunité, l\'énergie ou améliorer la digestion ?',
    respiration: 'Quels exercices de respiration et techniques du nerf vague pour réduire le stress et améliorer la concentration ?',
    hormones: 'Comment soutenir naturellement mon équilibre hormonal pour plus d\'énergie, une meilleure peau et un cycle régulier ?',
    mtc: 'Quels points d\'acupression ou conseils de diététique chinoise pour la digestion, l\'énergie ou le stress ?',
    prophetique: 'Comment utiliser nigelle, miel et autres remèdes ancestraux pour l\'immunité, l\'énergie et le bien-être général ?',
    alimentation: 'Quels aliments et micronutriments pour plus d\'énergie, une meilleure concentration et une peau éclatante ?',
    emotion: 'Comment alléger la charge mentale, gérer l\'anxiété et retrouver un meilleur équilibre émotionnel ?',
  };

  // Versions courtes pour le placeholder de l'input (variées pour tous)
  const agentPrompts: Record<string, string> = {
    globale: 'Gérer stress, sommeil et énergie naturellement ?',
    aromatherapie: 'Huiles pour anxiété, sommeil ou maux de tête ?',
    naturopathie: 'Plantes pour immunité, énergie ou digestion ?',
    respiration: 'Respiration pour stress et concentration ?',
    hormones: 'Équilibre hormonal pour énergie et peau ?',
    mtc: 'Acupression et diététique pour digestion/stress ?',
    prophetique: 'Nigelle et remèdes pour immunité et énergie ?',
    alimentation: 'Aliments pour énergie, concentration et peau ?',
    emotion: 'Alléger charge mentale et anxiété ?',
  };

  const [activeTab, setActiveTab] = useState<'accueil' | 'chat' | 'forum' | 'protocoles' | 'compte'>('accueil');
  const [selectedAgent, setSelectedAgent] = useState('globale');
  const [posts, setPosts] = useState<ForumPost[]>(seedPosts);
  const [openPostId, setOpenPostId] = useState<string | null>(null);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPost, setShowNewPost] = useState(false);
  const [forumLoading, setForumLoading] = useState(false);
  const [forumOnline, setForumOnline] = useState(false);
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [displayName, setDisplayName] = useState('Membre');
  const [forumBusy, setForumBusy] = useState(false);

  const refreshAuth = useCallback(async () => {
    const supabase = tryCreateClient();
    if (!supabase) {
      setAuthUser(null);
      setDisplayName('Membre');
      return;
    }
    const { data: { user } } = await supabase.auth.getUser();
    setAuthUser(user);
    if (user) {
      const fallback =
        (user.user_metadata?.display_name as string | undefined) ||
        user.email?.split('@')[0] ||
        'Membre';
      const { data: profile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle();
      if (!profile) {
        await supabase.from('profiles').upsert({
          id: user.id,
          display_name: fallback,
        });
        setDisplayName(fallback);
      } else {
        setDisplayName(profile.display_name || fallback);
      }
    } else {
      setDisplayName('Membre');
    }
  }, []);

  const loadForumFromSupabase = useCallback(async () => {
    const supabase = tryCreateClient();
    if (!supabase) {
      setForumOnline(false);
      setPosts(seedPosts);
      return;
    }
    setForumLoading(true);
    try {
      const { data: dbPosts, error: postsError } = await supabase
        .from('forum_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (postsError) throw postsError;

      const { data: dbReplies, error: repliesError } = await supabase
        .from('forum_replies')
        .select('*')
        .order('created_at', { ascending: true });
      if (repliesError) throw repliesError;

      const mapped = (dbPosts as DbForumPost[]).map((p) =>
        mapDbPost(p, (dbReplies as DbForumReply[]) || [])
      );
      setPosts(mapped.length > 0 ? mapped : seedPosts);
      setForumOnline(true);
    } catch (err) {
      console.error('Forum Supabase:', err);
      setForumOnline(false);
      setPosts(seedPosts);
      toast.error('Forum temporairement indisponible', {
        description:
          'Réessaie dans une minute. Si ça continue, le service est peut‑être en pause.',
      });
    } finally {
      setForumLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshAuth();
    void loadForumFromSupabase();
    const supabase = tryCreateClient();
    if (!supabase) return;
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      void refreshAuth();
    });
    return () => subscription.unsubscribe();
  }, [refreshAuth, loadForumFromSupabase]);

  const justPaid = searchParams.get('paid') === 'true';

  // Limite gratuite : 10 questions. Hormones Sereine (9,99 €) donne l'accès illimité.
  const FREE_QUESTION_LIMIT = 10;
  const [freeQuestionsUsed, setFreeQuestionsUsed] = useState(0);
  const [accessTier, setAccessTier] = useState<AccessTier>('free');
  const [accessSince, setAccessSince] = useState<string | null>(null);
  const [accessCode, setAccessCode] = useState('');
  const [activatingCode, setActivatingCode] = useState(false);
  const [accessOnAccount, setAccessOnAccount] = useState(false);
  const [bindingAccess, setBindingAccess] = useState(false);
  const [coachingStartedAt, setCoachingStartedAt] = useState<string | null>(null);
  const [coachingNotes, setCoachingNotes] = useState('');
  const [coachingChecks, setCoachingChecks] = useState<Record<string, boolean>>({});
  const [openCoachingWeek, setOpenCoachingWeek] = useState<number | null>(1);

  const hasEbook = hasEbookAccess(accessTier);
  const isCoaching = hasCoachingAccess(accessTier);
  const isPremium = isPremiumAccess(accessTier);

  const syncAccessFromProfile = useCallback(async () => {
    try {
      const res = await fetch('/api/access/me');
      if (!res.ok) return;
      const data = await res.json();
      if (!data.authenticated) {
        setAccessOnAccount(false);
        return;
      }
      const profileTier = data.tier as AccessTier;
      if (profileTier && profileTier !== 'free') {
        const saved = saveAccessTier(profileTier);
        setAccessTier((prev) => resolveAccessTier(prev, saved));
        setAccessSince(readAccessSince());
        setAccessOnAccount(true);
      } else {
        // Compte gratuit : ne pas garder un ancien illimité de test sur cet appareil
        clearStoredAccess();
        setAccessTier('free');
        setAccessSince(null);
        setAccessOnAccount(false);
        try {
          await fetch('/api/access/clear', { method: 'POST' });
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  /** Lie le premium (cookie httpOnly validé Beacons) au compte connecté */
  const bindAccessToAccount = useCallback(
    async (opts?: { silent?: boolean }) => {
      if (!isSupabaseConfigured()) return false;
      setBindingAccess(true);
      try {
        const res = await fetch('/api/access/bind', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        });
        const data = await res.json();
        if (!res.ok) {
          if (!opts?.silent && data.needsAuth) {
            toast.message('Connecte-toi pour sauver ton accès sur ton compte', {
              description: 'Onglet Compte → créer un compte ou se connecter.',
            });
          }
          return false;
        }
        const saved = saveAccessTier(data.plan as AccessTier);
        setAccessTier(saved);
        setAccessSince(readAccessSince());
        setAccessOnAccount(true);
        if (!opts?.silent) {
          toast.success(data.message || 'Accès lié à ton compte');
        }
        return true;
      } catch {
        return false;
      } finally {
        setBindingAccess(false);
      }
    },
    []
  );

  const activateWithCode = async () => {
    const raw = accessCode.trim();
    if (!raw) {
      toast.error('Entre ton code d’accès');
      return;
    }

    // Accepte le code seul OU l’URL complète collée depuis l’email Beacons
    let token = raw;
    const urlMatch = raw.match(/\/acces\/(ebook|coaching)\/([A-Za-z0-9_-]+)/);
    if (urlMatch) {
      token = urlMatch[2];
    } else if (raw.includes('token=')) {
      try {
        const u = new URL(raw.startsWith('http') ? raw : `https://x.local/?${raw}`);
        token = u.searchParams.get('token') || token;
      } catch {
        /* ignore */
      }
    }

    setActivatingCode(true);
    try {
      const res = await fetch('/api/access/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Code invalide');
        return;
      }
      const saved = saveAccessTier(data.plan as AccessTier);
      setAccessTier(saved);
      setAccessSince(readAccessSince());
      setAccessCode('');
      if (data.linked) {
        setAccessOnAccount(true);
        toast.success(data.message || 'Accès activé sur ton compte');
      } else if (authUser) {
        const ok = await bindAccessToAccount({ silent: false });
        if (!ok) {
          toast.message(data.message || 'Accès activé sur cet appareil', {
            description:
              'Pas encore sur le compte cloud. Vérifie que tu es bien connectée, puis réessaie.',
          });
        }
      } else {
        toast.success(data.message || 'Accès activé', {
          description:
            'Connecte-toi puis réactive le même lien pour l’enregistrer sur ton compte (sinon Supabase reste free).',
        });
      }
    } catch {
      toast.error(
        'Impossible d’activer le code pour le moment. Vérifie ta connexion et réessaie.'
      );
    } finally {
      setActivatingCode(false);
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem('sv_free_questions') || '0';
    setFreeQuestionsUsed(parseInt(saved, 10));
    setCoachingStartedAt(localStorage.getItem(COACHING_START_KEY));
    setCoachingNotes(localStorage.getItem(COACHING_NOTES_KEY) || '');
    try {
      const raw = localStorage.getItem(COACHING_CHECKS_KEY);
      if (raw) setCoachingChecks(JSON.parse(raw) as Record<string, boolean>);
    } catch {
      /* ignore */
    }

    const showWelcomeToast = Boolean(showWelcome || fromBeacons || justPaid);

    void (async () => {
      // Source de vérité appareil = cookie httpOnly (posé seulement après vrai lien/code)
      let deviceTier: AccessTier = 'free';
      try {
        const res = await fetch('/api/access/status');
        if (res.ok) {
          const data = await res.json();
          if (data.tier === 'ebook' || data.tier === 'coaching') {
            deviceTier = data.tier;
          }
        }
      } catch {
        /* ignore */
      }

      if (deviceTier !== 'free') {
        const savedTier = saveAccessTier(deviceTier);
        setAccessTier(savedTier);
        setAccessSince(readAccessSince());

        if (showWelcomeToast || unlockedParam === deviceTier || unlockedParam === 'premium') {
          toast.success(
            savedTier === 'coaching'
              ? 'Coaching activé — bienvenue dans ton espace !'
              : 'Accès illimité activé — bienvenue dans ton espace !',
            {
              description: linkedParam
                ? 'Accès aussi enregistré sur ton compte connecté.'
                : 'Connecte-toi (Compte) pour le retrouver sur tous tes appareils.',
            }
          );
        }

        if (linkedParam) {
          setAccessOnAccount(true);
        } else {
          void bindAccessToAccount({ silent: true }).then((ok) => {
            if (ok) setAccessOnAccount(true);
          });
        }
        return;
      }

      // Pas de cookie premium : on garde seulement le localStorage (sans croire l’URL ?unlocked=)
      const storedTier = readStoredAccessTier();
      setAccessTier(storedTier);
      setAccessSince(readAccessSince());
    })();
  }, [unlockedParam, fromBeacons, showWelcome, justPaid, linkedParam, bindAccessToAccount]);

  // Au login : le profil Supabase prime ; on ne « s’auto-offre » plus l’illimité via localStorage
  useEffect(() => {
    if (!authUser) {
      setAccessOnAccount(false);
      return;
    }
    void (async () => {
      await syncAccessFromProfile();
      // Lie uniquement si un cookie Beacons valide existe (pas le localStorage seul)
      const ok = await bindAccessToAccount({ silent: true });
      if (ok) setAccessOnAccount(true);
    })();
  }, [authUser, syncAccessFromProfile, bindAccessToAccount]);

  // Liens depuis la landing : /espace?tab=chat&agent=aromatherapie
  useEffect(() => {
    const validTabs = ['accueil', 'chat', 'forum', 'protocoles', 'compte'] as const;
    if (tabParam && (validTabs as readonly string[]).includes(tabParam)) {
      setActiveTab(tabParam as (typeof validTabs)[number]);
    } else if (agentParam) {
      setActiveTab('chat');
    }

    if (agentParam && agents.some((a) => a.id === agentParam)) {
      setSelectedAgent(agentParam);
    }
  }, [tabParam, agentParam]);

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
  const [lastLead, setLastLead] = useState<{ mainConcerns?: string[] } | null>(null);

  const symptomsOptions = [
    "Stress et anxiété", "Insomnies / Troubles du sommeil", "Fatigue chronique",
    "Anxiété / Stress / Charge mentale", "Irritabilité / Sautes d'humeur",
    "Brouillard mental / Difficultés de concentration", "Problèmes de peau",
    "Baisse d'énergie", "Troubles digestifs", "Baisse d'immunité",
    "Douleurs articulaires ou musculaires", "Cycle irrégulier ou SPM", "Prise de poids"
  ];

  const dailyTips = [
    "Diffuse trois gouttes d’huile essentielle de lavande en fin de journée pour favoriser le calme avant le sommeil.",
    "Avant de dormir, pratique cinq minutes de respiration lente : inspire pendant quatre secondes, expire pendant six secondes.",
    "Ajoute une cuillère de graines de lin moulues à ton yaourt ou ta salade pour soutenir tes apports en oméga-3.",
    "Chaque soir, note trois points positifs de ta journée : ce simple rituel allège souvent la charge mentale.",
    "Pour les nuits agitées, prépare un roll-on dilué avec de la lavande (huile végétale + quelques gouttes) et applique-le sur les poignets.",
    "Après le repas, marche calmement dix minutes : cela soutient la digestion et l’énergie de l’après-midi.",
    "Si ton terrain le permet, une demi-cuillère à café de maca dans un smoothie peut soutenir l’énergie du matin.",
    "Masse une minute le point situé entre le gros orteil et le second orteil pour relancer une sensation de vitalité.",
    "Le matin, une petite cuillère de nigelle avec un peu de miel peut accompagner ton rituel d’immunité et de bien-être.",
    "La respiration 4-7-8 avant le coucher (quatre cycles) aide souvent à s’endormir plus sereinement en quelques soirs.",
    "Intègre des bons lipides (avocat, noix, huile d’olive) pour soutenir la satiété et la clarté mentale.",
    "L’après-midi, une infusion de menthe et de gingembre peut alléger la digestion et le coup de barre.",
  ];

  const miniArticles = [
    {
      id: 1,
      title: "Cinq huiles essentielles à connaître",
      cat: "Aromathérapie",
      text: "La lavande apaise, la sauge sclarée soutient l’équilibre, le géranium harmonise, les agrumes recentrent et les notes boisées préparent au repos. Demande au chat un protocole d’usage adapté à ta situation.",
    },
    {
      id: 2,
      title: "Pourquoi le nerf vague compte tant",
      cat: "Régulation nerveuse",
      text: "Une grande partie des échanges entre le corps et le cerveau passe par le nerf vague. Une respiration lente et régulière aide souvent à apaiser le stress et à préparer un sommeil plus réparateur.",
    },
    {
      id: 3,
      title: "Alimentation anti-inflammatoire : les bases",
      cat: "Alimentation",
      text: "Privilégie des protéines à chaque repas, des oméga-3, des fibres et des aliments riches en magnésium pour soutenir ton énergie et ta clarté mentale.",
    },
    {
      id: 4,
      title: "Poser des limites sans culpabilité",
      cat: "Charge mentale",
      text: "La charge invisible se nourrit de micro-décisions. Commence par une phrase simple et claire : « Je ne peux pas ce jour-là. »",
    },
  ];

  useEffect(() => {
    const savedBilan = localStorage.getItem('natura_bilan_initial');
    if (savedBilan) setBilanInitial(JSON.parse(savedBilan));

    const savedLogs = localStorage.getItem('natura_symptom_logs');
    if (savedLogs) setSymptomLogs(JSON.parse(savedLogs));

    const leads = JSON.parse(localStorage.getItem('natura_leads') || '[]');
    if (leads.length > 0) setLastLead(leads[0]);
  }, []);

  // Tip vraiment aléatoire à chaque visite / clic (plus de date-based répétitif)
  const [currentTip, setCurrentTip] = useState("");

  const getNewDailyTip = () => {
    // Pick random, but avoid the exact same one as currently shown (for real variety)
    let tip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
    if (dailyTips.length > 1 && tip === currentTip) {
      const idx = dailyTips.indexOf(tip);
      tip = dailyTips[(idx + 1) % dailyTips.length];
    }
    setCurrentTip(tip);
    return tip;
  };

  // Always pick a fresh random tip on mount / page load for variety
  useEffect(() => {
    getNewDailyTip();
  }, []);

  // Pool TRÈS VARIÉ pour TOUT public (suggestions générales pour tous âges)
  const espaceSuggestionPool = [
    { title: "Mieux dormir naturellement", slug: "sommeil-hormones" },
    { title: "Alléger la charge mentale", slug: "charge-mentale" },
    { title: "Approche holistique", slug: "approche-holistique" },
    { title: "Science & traditions", slug: "racines-traditionnelles" },
    { title: "Huiles contre l'anxiété", slug: "aromatherapie-anxiete" },
    { title: "Points MTC pour l'énergie", slug: "mtc-bouffees" },
    { title: "Nigelle & remèdes prophétiques", slug: "prophetique-nigelle" },
    { title: "Alimentation anti-inflammatoire", slug: "alimentation-inflammatoire" },
    { title: "Booster l'énergie vitale", slug: "libido-hormones" },
    { title: "Gérer le poids naturellement", slug: "poids-menopause" },
    { title: "Magnésium & nutriments clés", slug: "magnesium-hormones" },
    { title: "Respiration pour les émotions", slug: "respiration-emotions" },
    { title: "Énergie et fatigue", slug: "thyroide-fatigue" },
    { title: "Digestion & confort intestinal", slug: "digestion-hormones" },
  ];

  const [espaceSuggestions, setEspaceSuggestions] = useState<any[]>([]);

  const refreshEspaceSuggestions = () => {
    // Full random shuffle + pick 3 different each time
    let shuffled = [...espaceSuggestionPool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    setEspaceSuggestions(shuffled.slice(0, 3));
  };

  useEffect(() => {
    refreshEspaceSuggestions();
  }, []);

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
        description: "Passe à Hormones Sereine pour le chat illimité + l'ebook (9,99 € une fois).",
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

      const aiMessage = fullText.trim() || `[Mode démo] Merci pour ta question. En conditions réelles, ${agents.find(a => a.id === selectedAgent)?.name} te proposerait un protocole naturel détaillé et actionnable.`;
      setMessages([...newMessages, { role: 'assistant' as const, content: aiMessage }]);

      // Incrémente le compteur gratuit seulement si pas premium
      if (!isPremium) {
        const newCount = freeQuestionsUsed + 1;
        setFreeQuestionsUsed(newCount);
        localStorage.setItem('sv_free_questions', newCount.toString());
      }
    } catch (err: unknown) {
      const friendly = toFriendlyNetworkError(
        err,
        'La réponse n’a pas pu être chargée. Réessaie dans un instant.'
      );
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `Désolée, un souci technique est survenu.\n\n${friendly}\n\n— La Sage de natura'bio by yas`,
        },
      ]);
      toast.error(friendly);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostTitle.trim() || !newPostContent.trim()) return;

    if (!isSupabaseConfigured() || !forumOnline) {
      toast.error('Forum en ligne non disponible', {
        description: 'Configure Supabase pour publier dans la communauté.',
      });
      setActiveTab('compte');
      return;
    }
    if (!authUser) {
      toast.error('Connecte-toi pour publier', {
        description: 'Crée un compte gratuit dans l’onglet Compte.',
      });
      setActiveTab('compte');
      return;
    }

    const supabase = tryCreateClient();
    if (!supabase) return;
    setForumBusy(true);
    try {
      const { data, error } = await supabase
        .from('forum_posts')
        .insert({
          user_id: authUser.id,
          author_name: displayName,
          title: newPostTitle.trim(),
          content: newPostContent.trim(),
          agent: selectedAgent,
        })
        .select('*')
        .single();
      if (error) throw error;

      const mapped = mapDbPost(data as DbForumPost, []);
      setPosts((prev) => [mapped, ...prev.filter((p) => !p.id.startsWith('local-'))]);
      setNewPostTitle('');
      setNewPostContent('');
      setShowNewPost(false);
      setOpenPostId(mapped.id);
      toast.success('Question publiée pour toute la communauté !');
    } catch (err: unknown) {
      toast.error(toFriendlyNetworkError(err, 'Impossible de publier pour le moment.'));
    } finally {
      setForumBusy(false);
    }
  };

  const handleAddReply = async (postId: string) => {
    const text = (replyDrafts[postId] || '').trim();
    if (!text) return;

    if (!isSupabaseConfigured() || !forumOnline) {
      toast.error('Forum en ligne non disponible');
      setActiveTab('compte');
      return;
    }
    if (!authUser) {
      toast.error('Connecte-toi pour répondre', {
        description: 'Crée un compte gratuit dans l’onglet Compte.',
      });
      setActiveTab('compte');
      return;
    }

    const supabase = tryCreateClient();
    if (!supabase) return;
    setForumBusy(true);
    try {
      const { data, error } = await supabase
        .from('forum_replies')
        .insert({
          post_id: postId,
          user_id: authUser.id,
          author_name: displayName,
          content: text,
        })
        .select('*')
        .single();
      if (error) throw error;

      const r = data as DbForumReply;
      const reply: ForumReply = {
        id: r.id,
        author: r.author_name,
        content: r.content,
        date: new Date(r.created_at).toLocaleDateString('fr-FR', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        userId: r.user_id,
      };

      setPosts((prev) =>
        prev.map((p) =>
          p.id === postId ? { ...p, replies: [...p.replies, reply] } : p
        )
      );
      setReplyDrafts((d) => ({ ...d, [postId]: '' }));
      toast.success('Réponse publiée');
    } catch (err: unknown) {
      toast.error(toFriendlyNetworkError(err, 'Impossible de répondre pour le moment.'));
    } finally {
      setForumBusy(false);
    }
  };

  // Note : 10 questions gratuites + forum.
  // L'ebook à 9,99 € donne l'accès illimité.
  // Le coaching est l'accompagnement complet.

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top bar membre */}
      <div className="border-b border-[#E6EDE9] bg-white sticky top-0 z-30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <a href="/" className="flex items-center gap-1.5 text-[var(--sage-600)] hover:text-[#2A3A32] shrink-0 text-sm">
              <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">Retour au site</span>
            </a>
            <div className="hidden sm:block h-5 w-px bg-[#E6EDE9]" />
            <div className="flex flex-col items-start min-w-0">
              <img 
                src="/natura-bio-logo.jpg" 
                alt="natura'bio" 
                className="h-10 sm:h-16 md:h-20 w-auto" 
              />
              <div className="text-[10px] sm:text-xs font-medium tracking-tight text-[var(--sage-600)] mt-0.5">by yas · Espace</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 text-sm shrink-0">
            {isPremium && (
              <div className={`rounded-full text-white px-2.5 sm:px-3 py-1 text-[10px] sm:text-xs font-semibold ${isCoaching ? 'bg-[#C5A46E]' : 'bg-[var(--sage-600)]'}`}>
                {isCoaching ? 'COACHING' : 'ILLIMITÉ'}
              </div>
            )}
            <div className="hidden md:block text-[#5A6B62]">Bonjour, chère sœur</div>
            <button 
              onClick={() => {
                window.location.href = "/";
              }}
              className="text-xs px-3 sm:px-4 py-1.5 rounded-full border border-[#A8BDB5] hover:bg-[#F8F5F0]"
            >
              Quitter
            </button>
          </div>
        </div>

        {/* Tabs — scroll horizontal sur mobile */}
        <div className="border-t border-[#E6EDE9]">
          <div className="mx-auto max-w-7xl px-2 sm:px-6 flex gap-0.5 sm:gap-1 text-sm overflow-x-auto scrollbar-hide">
            {[
              { id: 'accueil', label: 'Accueil', icon: Leaf },
              { id: 'chat', label: 'Chat IA', icon: MessageCircle },
              { id: 'forum', label: 'Forum', icon: Users },
              { id: 'protocoles', label: isCoaching ? 'Coaching' : 'Coaching', icon: FileText },
              { id: 'compte', label: 'Compte', icon: User },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-3 border-b-2 font-medium transition whitespace-nowrap shrink-0 ${activeTab === tab.id 
                    ? 'border-[var(--sage-600)] text-[#2A3A32]' 
                    : 'border-transparent text-[#5A6B62] hover:text-[var(--mint)]'}`}
                >
                  <Icon className="h-4 w-4" /> {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl w-full px-6 py-8 flex-1">
        {(justPaid || (showWelcome && isPremium)) && (
          <div className="mb-6 rounded-2xl bg-[#5B7B6E] text-white p-4 text-center text-sm font-medium">
            {isCoaching
              ? 'Bienvenue ! Ton coaching est actif — ouvre l’onglet Coaching pour ton parcours 4 semaines, WhatsApp et notes de protocole.'
              : 'Bienvenue ! Ton accès illimité est actif — chat IA, forum et ebook Hormones Sereine te sont ouverts.'}
          </div>
        )}

        {/* ACCUEIL */}
        {activeTab === 'accueil' && (
          <div className="max-w-4xl">
            <h1 className="text-4xl font-semibold tracking-tight mb-3">Bienvenue dans l&apos;Espace Membres</h1>
            <p className="text-xl text-[#5A6B62] mb-4">
              10 questions gratuites + forum. L&apos;ebook Hormones Sereine (9,99 €) donne le chat illimité + le PDF (cycle, SOPK, thyroïde, ménopause…). Le coaching est l&apos;accompagnement complet.
            </p>

            {/* Lien vers le bilan public (email collection) + perso */}
            <div className="mb-8">
              <a href="/bilan" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--sage-600)] hover:underline">
                → Faire ou refaire ton bilan initial (avec email pour la newsletter)
              </a>
              {lastLead && (
                <div className="mt-3 text-sm bg-[#F4F7F5] p-3 rounded-2xl">
                  <strong>Ton dernier bilan :</strong> {lastLead.mainConcerns?.slice(0, 2).join(", ")}...
                  <span className="text-[var(--sage-600)]"> Recommandation : commence par l&apos;agent le plus pertinent dans le chat.</span>
                </div>
              )}
            </div>

            {/* DAILY TIP - style Cara : clean, modern, interaction */}
            <div className="feature-card card rounded-3xl p-6 mb-8 border border-[var(--border-soft)] bg-white">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="uppercase tracking-[2px] text-xs font-medium text-[var(--mint)]">TIP DU JOUR</div>
                  <div className="font-semibold text-lg tracking-tight">Conseil naturel pour aujourd'hui</div>
                </div>
                <span className="text-3xl">🌿</span>
              </div>
              <p className="text-[#2A3A32] mb-4 leading-relaxed">{currentTip}</p>
              <div className="flex gap-2">
                <button 
                  onClick={getNewDailyTip}
                  className="text-xs px-4 py-1.5 rounded-full border border-[var(--mint)] hover:bg-[var(--mint)] hover:text-white transition"
                >
                  ↻ Nouveau tip
                </button>
                <button 
                  onClick={() => {
                    const today = new Date().toISOString().slice(0,10);
                    localStorage.setItem('natura_tip_done_' + today, 'true');
                    alert("Merci ! Tip notée. Tu peux la retrouver dans tes protocoles.");
                  }}
                  className="text-xs px-4 py-1.5 rounded-full border border-[var(--border-soft)] hover:border-[var(--mint)] transition"
                >
                  J'utilise ce tip aujourd'hui
                </button>
              </div>
            </div>

            {/* ARTICLES DYNAMIQUES - vraiment variés (pool large + shuffle) */}
            {espaceSuggestions.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-1">
                  <div className="text-xs text-[var(--mint)]">SUGGESTIONS VARIÉES POUR TOI</div>
                  <button 
                    onClick={refreshEspaceSuggestions}
                    className="text-xs text-[var(--mint)] hover:underline"
                  >
                    ↻ Autres sujets
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {espaceSuggestions.map((art, idx) => (
                    <a key={idx} href={`/blog#${art.slug}`} className="text-xs px-3 py-1 rounded-full border border-[var(--border-soft)] hover:border-[var(--mint)] hover:bg-white transition">
                      {art.title}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* BILAN INITIAL - premier accès */}
            {!bilanInitial ? (
              <div className="card rounded-3xl p-8 mb-8 border-2 border-[#5B7B6E]">
                <div className="text-[var(--sage-600)] text-sm font-medium tracking-[2px] mb-1">PREMIER PAS</div>
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
                      <option value="18-24">18-24 ans</option>
                      <option value="25-34">25-34 ans</option>
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
                  <span className="text-[var(--sage-600)]">✓</span> 
                  <span className="font-medium">Bilan initial enregistré</span>
                </div>
                <p className="text-sm text-[#5A6B62]">
                  Merci ! Tu peux maintenant explorer le chat en commençant par les agents qui correspondent à tes préoccupations.
                </p>
                {showBilanSuccess && <p className="text-[var(--sage-600)] text-sm mt-2">Merci, ton bilan est sauvegardé localement.</p>}
              </div>
            )}

            {/* MINI ARTICLES */}
            <div className="mb-10">
              <div className="flex items-baseline justify-between mb-4">
                <h3 className="font-semibold text-xl tracking-tight">Mini-articles &amp; ressources</h3>
                <span className="text-xs text-[#5A6B62]">Pour aller plus loin</span>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {miniArticles.map(article => (
                  <div key={article.id} className="card rounded-2xl p-5 border border-[#E6EDE9]">
                    <div className="text-[10px] uppercase tracking-widest text-[var(--sage-600)] mb-1">{article.cat}</div>
                    <div className="font-semibold mb-2 leading-tight">{article.title}</div>
                    <p className="text-sm text-[#5A6B62]">{article.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* GRILLE EXISTANTE */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              <div className="card rounded-3xl p-7 cursor-pointer" onClick={() => setActiveTab('chat')}>
                <MessageCircle className="h-7 w-7 text-[var(--sage-600)] mb-4" />
                <div className="font-semibold text-xl">Parler avec les agents IA</div>
                <p className="mt-2 text-[#5A6B62]">9 expertes spécialisées dont une dédiée à la charge mentale et aux émotions. Gratuit (10 questions).</p>
              </div>

              <div className="card rounded-3xl p-7 cursor-pointer" onClick={() => setActiveTab('forum')}>
                <Users className="h-7 w-7 text-[var(--sage-600)] mb-4" />
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
                <p className="mt-2 text-[#5A6B62]">
                  Cartographie, protocoles, outils émotionnels et travail intérieur.
                  L’IA t’ouvre la voie — le coaching 4 semaines l’ancre avec Yas, semaine après semaine.
                </p>
                <div className="mt-3 text-sm font-medium" style={{ color: '#6C6B9A' }}>Parler à l&apos;agent dédié →</div>
              </div>

              {hasEbook && (
                <a 
                  href="/api/download/ebook?paid=true" 
                  className="card rounded-3xl p-7 flex flex-col hover:border-[#5B7B6E] border-2 border-[#5B7B6E]/30"
                  download
                >
                  <div className="mb-4 text-[var(--sage-600)]">
                    <BookOpen className="h-7 w-7" />
                  </div>
                  <div className="font-semibold text-xl">Télécharger Hormones Sereine</div>
                  <p className="mt-2 text-[#5A6B62] text-sm">PDF complet — cycle, SOPK, thyroïde, ménopause…</p>
                  <div className="mt-auto pt-3 text-xs text-[#C5A46E]">Clique pour télécharger →</div>
                </a>
              )}

              {isCoaching && (
                <div
                  className="card rounded-3xl p-7 flex flex-col cursor-pointer hover:border-[#C5A46E] border-2 border-[#C5A46E]/40"
                  onClick={() => setActiveTab('protocoles')}
                >
                  <div className="mb-4 text-[#C5A46E] text-3xl">✨</div>
                  <div className="font-semibold text-xl">Mon coaching</div>
                  <p className="mt-2 text-[#5A6B62] text-sm">
                    Semaines 1–4, notes de protocole, WhatsApp et contact Yas.
                  </p>
                  <div className="mt-auto pt-3 text-xs text-[#C5A46E]">Ouvrir mon espace coaching →</div>
                </div>
              )}

              {isCoaching && (
                <a 
                  href={WHATSAPP_GROUP_LINK} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="card rounded-3xl p-7 flex flex-col hover:border-[#5B7B6E] border-2 border-[#5B7B6E]/30"
                >
                  <div className="mb-4 text-[var(--sage-600)] text-3xl">💬</div>
                  <div className="font-semibold text-xl">Groupe WhatsApp</div>
                  <p className="mt-2 text-[#5A6B62] text-sm">Réservé à ton coaching — échanges et suivi avec la communauté.</p>
                  <div className="mt-auto pt-3 text-xs text-[#C5A46E]">Ouvrir le groupe →</div>
                </a>
              )}
            </div>

            {/* SUIVI SYMPTÔMES */}
            <div className="mb-10">
              <h3 className="font-semibold text-xl tracking-tight mb-1">Suivi de tes symptômes</h3>
              <p className="text-sm text-[#5A6B62] mb-4">Note tes ressentis au fil des jours pour voir les tendances et ajuster tes protocoles.</p>

              <div className="card rounded-3xl p-6 mb-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Symptômes - style Cara tracking */}
                  <div>
                    <div className="text-sm font-medium mb-2 flex items-center gap-2">
                      <span>📋</span> Symptômes du jour
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {symptomsOptions.map(sym => {
                        const isSelected = symptomForm.selectedSymptoms.includes(sym);
                        return (
                          <button
                            key={sym}
                            type="button"
                            onClick={() => toggleSymptom(sym)}
                            className={`px-3 py-1 text-xs rounded-full border transition-all interactive ${
                              isSelected 
                                ? 'bg-[var(--mint)] text-white border-[var(--mint)]' 
                                : 'bg-white border-[var(--border-soft)] hover:border-[var(--mint)] hover:bg-[#F4F7F5]'
                            }`}
                          >
                            {sym}
                          </button>
                        );
                      })}
                    </div>
                    {/* Live summary - app style */}
                    {symptomForm.selectedSymptoms.length > 0 && (
                      <div className="text-xs bg-[var(--mint)]/10 p-2 rounded-lg border border-[var(--mint)]/30">
                        <strong>Aujourd'hui :</strong> {symptomForm.selectedSymptoms.length} symptôme(s) • Intensité {symptomForm.intensity}/5
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-1 flex items-center gap-2">
                        <span>📊</span> Intensité globale
                      </div>
                      <div className="flex gap-2 mb-1">
                        {[1,2,3,4,5].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setSymptomForm({...symptomForm, intensity: val})}
                            className={`flex-1 py-1 text-sm rounded-lg border transition interactive ${symptomForm.intensity === val ? 'bg-[var(--mint)] text-white border-[var(--mint)]' : 'bg-white border-[var(--border-soft)] hover:border-[var(--mint)]'}`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      <div className="text-xs text-[#5A6B62]">1 = très léger • 5 = très fort</div>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-1 flex items-center gap-2">
                        <span>📝</span> Notes (optionnel)
                      </div>
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
                  
                  {/* Bar graph - app style with hover tooltips */}
                  <div className="flex gap-1.5 items-end h-16 mb-4 bg-[#F4F7F5] rounded-2xl p-3">
                    {symptomLogs.slice(0, 7).reverse().map((log, idx) => (
                      <div 
                        key={idx} 
                        className="flex-1 flex flex-col items-center group relative cursor-default"
                        title={`${log.date} — Intensité ${log.intensity}/5`}
                      >
                        <div 
                          className="w-full rounded-t transition-all group-hover:brightness-110" 
                          style={{ 
                            height: `${(log.intensity / 5) * 100}%`, 
                            minHeight: '8px',
                            backgroundColor: log.intensity > 3 ? 'var(--blush)' : 'var(--mint)'
                          }}
                        />
                        <div className="text-[8px] text-[#5A6B62] mt-0.5 font-mono">{log.date.slice(8)}</div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    {symptomLogs.slice(0, 5).map((log, idx) => (
                      <div 
                        key={idx} 
                        className="text-sm p-2 rounded-lg border border-[var(--border-soft)] hover:border-[var(--mint)] hover:bg-[#F4F7F5] transition cursor-default"
                      >
                        <div className="flex justify-between text-xs text-[var(--sage-600)] mb-0.5">
                          <span className="font-mono">{log.date}</span>
                          <span>Intensité {log.intensity}/5</span>
                        </div>
                        <div className="text-[#5A6B62]">
                          {log.symptoms.join(", ")}
                        </div>
                        {log.note && <div className="text-xs italic mt-1 text-[#5A6B62]">“{log.note}”</div>}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-[#5A6B62] mt-3">Graphique des 7 derniers jours (hauteur = intensité).</p>
                </div>
              )}
            </div>

            {/* OFFRES - Ebook pour illimité, Coaching pour l'accompagnement profond */}
            <div className="mb-4 px-0.5">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-2 leading-snug">Passe à l&apos;illimité ou au coaching</h2>
              <p className="text-[#5A6B62] mb-6 text-sm sm:text-base leading-relaxed">
                Hormones Sereine te donne l&apos;illimité + le PDF pour toutes les étapes hormonales.
                Le coaching est l&apos;accompagnement complet.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <a 
                href={BEACONS_EBOOK_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="card rounded-3xl p-5 sm:p-7 hover:border-[#5B7B6E] border border-[#5B7B6E]/30 flex flex-col"
              >
                <div className="uppercase tracking-[1.2px] sm:tracking-[2px] text-[10px] sm:text-xs text-[var(--sage-600)] mb-1">Accès illimité</div>
                <div className="font-semibold text-lg sm:text-xl mb-1 leading-snug">Hormones Sereine + chat illimité</div>
                <div className="flex flex-wrap items-baseline gap-x-2 mb-3">
                  <span className="text-3xl font-semibold tabular-nums">9,99 €</span>
                  <span className="text-sm font-normal text-[#5A6B62]">une fois</span>
                </div>
                <p className="text-[#5A6B62] mb-4 text-sm leading-relaxed">
                  PDF + chat IA illimité + forum. Cycle, SOPK, endométriose, thyroïde, pré-ménopause et ménopause — pour toutes les femmes.
                </p>
                <div className="mt-auto text-[var(--sage-600)] font-semibold text-sm sm:text-base">Accéder à l&apos;illimité →</div>
              </a>

              <a 
                href={BEACONS_COACHING_LINK} 
                target="_blank" 
                rel="noopener noreferrer"
                className="card rounded-3xl p-5 sm:p-7 hover:border-[#C5A46E] border-2 border-[#C5A46E] flex flex-col relative"
              >
                <div className="absolute -top-3 right-4 sm:right-8 bg-[#C5A46E] text-white text-[10px] sm:text-xs font-semibold px-3 sm:px-4 py-1 rounded-full tracking-wide">
                  Transformateur
                </div>
                <div className="uppercase tracking-[1.2px] sm:tracking-[2px] text-[10px] sm:text-xs text-[#C5A46E] mb-1 pr-16 sm:pr-0">Accompagnement</div>
                <div className="font-semibold text-lg sm:text-xl mb-1 leading-snug">Coaching 4 semaines</div>
                <div className="text-3xl font-semibold tabular-nums mb-3">167 €</div>
                <p className="text-[#5A6B62] mb-4 text-sm leading-relaxed">
                  Protocole + visio + suivi 4 semaines + WhatsApp + chat privé avec moi.
                </p>
                <div className="mt-auto text-[#C5A46E] font-semibold text-sm sm:text-base">Réserver le coaching →</div>
              </a>
            </div>

            {!isCoaching && (
              <a
                href={BEACONS_DISCOVERY_CALL_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 block card rounded-3xl p-5 border border-[#E8D9B8] bg-[#FBF7F0] hover:border-[#C5A46E] transition"
              >
                <div className="text-[10px] sm:text-xs font-semibold tracking-[1.5px] text-[#8A6E3A] uppercase mb-1">
                  Gratuit · sans engagement
                </div>
                <div className="font-semibold text-lg text-[#2A3A32]">Appel découverte avec Yas</div>
                <p className="text-sm text-[#5A6B62] mt-1 leading-relaxed">
                  On fait le point ensemble : est-ce que le coaching 4 semaines est fait pour toi ?
                </p>
                <div className="mt-3 text-sm font-semibold text-[#8A6E3A]">Réserver mon appel gratuit →</div>
              </a>
            )}

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
              <div className="text-right text-sm font-medium text-[var(--sage-600)]">
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
                          <p className="text-sm mt-2 max-w-xs mx-auto">
                            Exemple : « {agentExamples[current?.id || 'globale']} »
                          </p>
                        </>
                      );
                    })()}
                  </div>
                )}

                {messages.map((m, idx) => (
                  <div key={idx} className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'} gap-2`}>
                    <div className={`max-w-[80%] px-5 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${m.role === 'user' ? 'chat-bubble-user' : 'chat-bubble-ai'}`}>
                      {m.content}
                    </div>
                    {m.role === 'assistant' &&
                      !isCoaching &&
                      !isLoading &&
                      idx === messages.length - 1 && (
                        <div className="max-w-[90%] sm:max-w-[80%] rounded-2xl border border-[#E8D9B8] bg-[#FBF7F0] px-4 py-3 text-sm text-[#5A6B62]">
                          <p className="leading-relaxed">
                            <strong className="text-[#2A3A32]">Envie d&apos;aller plus loin avec Yas ?</strong>
                            {' '}
                            Le coaching 4 semaines : protocole sur-mesure, suivi humain, charge mentale et rythme de vie — pas seulement une réponse.
                          </p>
                          <div className="mt-2.5 flex flex-col sm:flex-row sm:flex-wrap gap-x-4 gap-y-1">
                            <a
                              href={BEACONS_DISCOVERY_CALL_LINK}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[#6C6B9A] hover:underline"
                            >
                              Appel découverte gratuit →
                            </a>
                            <a
                              href={BEACONS_COACHING_LINK}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="font-semibold text-[#8A6E3A] hover:underline"
                            >
                              Coaching 4 semaines — 167 € →
                            </a>
                          </div>
                        </div>
                      )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="chat-bubble-ai px-5 py-3 text-sm text-[#5A6B62]">La Sage réfléchit...</div>
                  </div>
                )}
              </div>

              {freeQuestionsUsed >= FREE_QUESTION_LIMIT && !isPremium ? (
                <div className="border-t p-6 bg-white text-center space-y-4">
                  <p className="font-medium">Tu as utilisé tes 10 questions gratuites.</p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center items-stretch sm:items-center">
                    <a 
                      href={BEACONS_EBOOK_LINK} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-primary inline-block px-6 py-3 rounded-2xl font-semibold text-sm"
                    >
                      Illimité — Hormones Sereine 9,99 €
                    </a>
                    <a
                      href={BEACONS_COACHING_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block px-6 py-3 rounded-2xl font-semibold text-sm border-2 border-[#C5A46E] text-[#8A6E3A] bg-[#FBF7F0]"
                    >
                      Coaching 4 semaines — 167 €
                    </a>
                  </div>
                  <p className="text-xs text-[#5A6B62]">
                    Ebook + chat illimité, ou accompagnement humain avec Yas (protocole + suivi).
                  </p>
                </div>
              ) : (
                <form onSubmit={sendMessage} className="border-t p-4 bg-white flex gap-3">
                  <input
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    placeholder={`Ex: ${agentPrompts[selectedAgent] || 'Ta question sur la santé au naturel...'}`}
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
                Conseils naturels éducatifs — en cas de symptômes graves ou de traitement en cours, un professionnel de santé reste le bon interlocuteur.
              </div>
            </div>
          </div>
        )}

        {/* FORUM */}
        {activeTab === 'forum' && (
          <div className="max-w-3xl">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 mb-6">
              <div>
                <h2 className="text-3xl font-semibold tracking-tight">Forum de la communauté</h2>
                <p className="text-[#5A6B62] mt-1">
                  Clique sur une discussion pour lire les réponses et répondre.
                </p>
              </div>
              <button
                onClick={() => setShowNewPost(!showNewPost)}
                className="btn-primary px-5 py-2 rounded-2xl text-sm font-medium shrink-0"
              >
                Poser une question
              </button>
            </div>

            <div className="mb-6 rounded-2xl border border-[#E6EDE9] bg-[#F8F5F0] px-4 py-3 text-sm text-[#5A6B62]">
              {forumOnline ? (
                <>
                  <strong className="text-[#2A3A32]">Communauté en ligne :</strong> tout le monde
                  voit les discussions. {authUser ? (
                    <>Tu es connectée en tant que <strong>{displayName}</strong>.</>
                  ) : (
                    <>
                      {' '}
                      <button
                        type="button"
                        className="underline text-[var(--sage-600)] font-medium"
                        onClick={() => setActiveTab('compte')}
                      >
                        Connecte-toi
                      </button>{' '}
                      pour publier ou répondre.
                    </>
                  )}
                </>
              ) : (
                <>
                  <strong className="text-[#2A3A32]">Mode démo :</strong> Supabase n&apos;est pas
                  encore branché. Configure-le (voir Compte) pour la vraie communauté multi-membres.
                </>
              )}
            </div>

            {forumLoading && (
              <p className="text-sm text-[#5A6B62] mb-4">Chargement des discussions…</p>
            )}

            {showNewPost && (
              <div className="card rounded-3xl p-6 mb-8">
                {!authUser && forumOnline && (
                  <p className="text-sm text-amber-800 bg-amber-50 rounded-xl px-3 py-2 mb-3">
                    Connecte-toi dans l&apos;onglet Compte pour publier.
                  </p>
                )}
                <input
                  value={newPostTitle}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewPostTitle(e.target.value)
                  }
                  placeholder="Titre de ta question"
                  className="w-full mb-3 rounded-xl border px-4 py-3"
                />
                <textarea
                  value={newPostContent}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewPostContent(e.target.value)
                  }
                  placeholder="Décris ta situation ou ta question en détail..."
                  className="w-full h-28 rounded-xl border p-4 mb-3 resize-y"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => void handleCreatePost()}
                    disabled={forumBusy}
                    className="btn-primary px-6 py-2 rounded-2xl text-sm disabled:opacity-60"
                  >
                    {forumBusy ? 'Publication…' : 'Publier'}
                  </button>
                  <button
                    onClick={() => setShowNewPost(false)}
                    className="btn-secondary px-6 py-2 rounded-2xl text-sm"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {posts.map((post) => {
                const isOpen = openPostId === post.id;
                const replyCount = post.replies?.length || 0;
                return (
                  <div
                    key={post.id}
                    className="forum-post card rounded-3xl border border-[#E6EDE9] overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenPostId(isOpen ? null : post.id)}
                      className="w-full text-left p-6 hover:bg-[#F8F5F0]/60 transition"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-lg mb-1">{post.title}</div>
                          <div className="text-sm text-[#5A6B62] mb-3">
                            Par {post.author}
                            {post.date ? ` • ${post.date}` : ''} • {replyCount} réponse
                            {replyCount !== 1 ? 's' : ''}
                          </div>
                          <p className="text-[15px] text-[#2A3A32] line-clamp-2">{post.content}</p>
                          <div className="mt-4 text-xs px-3 py-1 inline-block rounded bg-[#E6EDE9] text-[var(--sage-600)]">
                            {agents.find((a) => a.id === post.agent)?.name || 'Discussion'}
                          </div>
                        </div>
                        <span className="text-[var(--sage-600)] text-sm shrink-0 mt-1">
                          {isOpen ? '▲' : '▼'} Voir
                        </span>
                      </div>
                    </button>

                    {isOpen && (
                      <div className="border-t border-[#E6EDE9] bg-[#FCFBF9] px-6 py-5 space-y-4">
                        <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
                          {post.content}
                        </p>

                        <div>
                          <div className="text-xs uppercase tracking-widest text-[var(--mint)] mb-3">
                            Réponses ({replyCount})
                          </div>
                          {replyCount === 0 ? (
                            <p className="text-sm text-[#5A6B62] mb-4">
                              Pas encore de réponse — sois la première à aider 🌿
                            </p>
                          ) : (
                            <ul className="space-y-3 mb-4">
                              {post.replies.map((r) => (
                                <li
                                  key={r.id}
                                  className="rounded-2xl border border-[#E6EDE9] bg-white p-4"
                                >
                                  <div className="text-xs text-[#5A6B62] mb-1">
                                    <strong className="text-[#2A3A32]">{r.author}</strong>
                                    {r.isExample ? ' · exemple' : ''}
                                    {r.date ? ` · ${r.date}` : ''}
                                  </div>
                                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                    {r.content}
                                  </p>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="rounded-2xl border border-[#E6EDE9] bg-white p-4">
                            <label className="block text-sm font-medium mb-2">
                              Ta réponse
                            </label>
                            <textarea
                              value={replyDrafts[post.id] || ''}
                              onChange={(e) =>
                                setReplyDrafts((d) => ({
                                  ...d,
                                  [post.id]: e.target.value,
                                }))
                              }
                              placeholder="Partage ton expérience ou une piste bienveillante..."
                              className="w-full h-24 rounded-xl border p-3 text-sm resize-y mb-3"
                            />
                            <button
                              type="button"
                              onClick={() => void handleAddReply(post.id)}
                              disabled={forumBusy}
                              className="btn-primary px-5 py-2 rounded-2xl text-sm disabled:opacity-60"
                            >
                              {forumBusy ? '…' : 'Publier la réponse'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* COACHING / PROTOCOLES */}
        {activeTab === 'protocoles' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight mb-2">Mon coaching 4 semaines</h2>
              <p className="text-sm text-[#5A6B62]">
                Ton espace d&apos;accompagnement avec Yas — WhatsApp, notes de protocole et parcours semaine par semaine.
              </p>
            </div>

            {!isCoaching ? (
              <div className="card rounded-3xl p-6 sm:p-8 space-y-4">
                <p className="text-[#5A6B62] text-sm leading-relaxed">
                  Cet espace est réservé aux femmes en <strong className="text-[#2A3A32]">coaching 4 semaines</strong>.
                  Tu peux déjà utiliser le chat IA, puis passer à un suivi humain quand tu es prête.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={BEACONS_DISCOVERY_CALL_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary px-5 py-3 rounded-2xl text-sm font-semibold text-center"
                  >
                    Appel découverte gratuit
                  </a>
                  <a
                    href={BEACONS_COACHING_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-3 rounded-2xl text-sm font-semibold text-center bg-[#C5A46E] hover:bg-[#B38C55] text-white transition"
                  >
                    Coaching 167 €
                  </a>
                </div>
              </div>
            ) : (
              <>
                <div className="card rounded-3xl p-6 sm:p-8 border-2 border-[#C5A46E]/50 space-y-4">
                  <div className="inline-flex rounded-full bg-[#C5A46E] text-white text-[10px] font-semibold px-3 py-1 tracking-wide">
                    COACHING ACTIF
                  </div>
                  <h3 className="font-semibold text-xl text-[#2A3A32]">Bienvenue dans ton accompagnement avec Yas</h3>
                  {(() => {
                    const weekNum = getCoachingWeekNumber(coachingStartedAt);
                    return (
                      <p className="text-sm text-[#5A6B62] leading-relaxed">
                        {weekNum === 0
                          ? 'Quand tu es prête (idéalement après ton appel), démarre le suivi pour afficher ta semaine en cours.'
                          : (
                            <>
                              Tu es en <strong className="text-[#2A3A32]">semaine {weekNum} sur 4</strong>
                              {coachingStartedAt
                                ? ` · démarré le ${new Date(coachingStartedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`
                                : ''}
                              .
                            </>
                          )}
                      </p>
                    );
                  })()}
                  <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                    {!coachingStartedAt ? (
                      <button
                        type="button"
                        onClick={() => {
                          const now = new Date().toISOString();
                          localStorage.setItem(COACHING_START_KEY, now);
                          setCoachingStartedAt(now);
                          setOpenCoachingWeek(1);
                          toast.success('Suivi démarré — semaine 1');
                        }}
                        className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold"
                      >
                        Démarrer mon suivi 4 semaines
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          localStorage.removeItem(COACHING_START_KEY);
                          setCoachingStartedAt(null);
                          toast.message('Suivi réinitialisé');
                        }}
                        className="text-xs text-[#5A6B62] underline px-1 py-2"
                      >
                        Réinitialiser la date de début
                      </button>
                    )}
                    <a
                      href={WHATSAPP_GROUP_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary px-4 py-2.5 rounded-xl text-sm font-semibold text-center"
                    >
                      Groupe WhatsApp
                    </a>
                    <a
                      href="mailto:contact@naturabioyas.fr?subject=Coaching%204%20semaines"
                      className="btn-secondary px-4 py-2.5 rounded-xl text-sm font-semibold text-center"
                    >
                      Contacter Yas
                    </a>
                    <button
                      type="button"
                      onClick={() => setActiveTab('chat')}
                      className="btn-secondary px-4 py-2.5 rounded-xl text-sm font-semibold"
                    >
                      Chat IA
                    </button>
                  </div>
                </div>

                <div className="card rounded-3xl p-6 sm:p-8 space-y-3">
                  <h3 className="font-semibold text-lg">Ton protocole personnalisé</h3>
                  <p className="text-sm text-[#5A6B62] leading-relaxed">
                    Ton protocole est établi et ajusté avec Yas (appel + suivi). Colle ici ce qu&apos;elle
                    t&apos;envoie (WhatsApp / mail) pour le retrouver facilement.
                  </p>
                  <textarea
                    value={coachingNotes}
                    onChange={(e) => {
                      const v = e.target.value;
                      setCoachingNotes(v);
                      localStorage.setItem(COACHING_NOTES_KEY, v);
                    }}
                    placeholder="Ex. : matin… soir… limites… huiles / plantes… points d’étape…"
                    className="w-full min-h-[140px] rounded-2xl border border-[#E6EDE9] bg-[#FCFBF9] p-4 text-sm leading-relaxed resize-y"
                  />
                  <p className="text-[11px] text-[#5A6B62]">Sauvegardé automatiquement sur cet appareil.</p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg">Parcours des 4 semaines</h3>
                  <p className="text-sm text-[#5A6B62]">
                    Cadre type — Yas l&apos;adapte à toi. Coche ce que tu as avancé.
                  </p>
                  {COACHING_WEEKS.map((w) => {
                    const isOpen = openCoachingWeek === w.week;
                    const current = getCoachingWeekNumber(coachingStartedAt) === w.week;
                    return (
                      <div
                        key={w.week}
                        className={`card rounded-3xl overflow-hidden border ${
                          current ? 'border-[#C5A46E] border-2' : 'border-[#E6EDE9]'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => setOpenCoachingWeek(isOpen ? null : w.week)}
                          className="w-full text-left px-5 py-4 flex items-start justify-between gap-3 hover:bg-[#F8F5F0]/80"
                        >
                          <div>
                            <div className="font-semibold text-[#2A3A32]">
                              {w.title}
                              {current && (
                                <span className="ml-2 text-[10px] font-semibold uppercase tracking-wide text-[#C5A46E]">
                                  En cours
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-[#5A6B62] mt-0.5">{w.focus}</div>
                          </div>
                          <span className="text-[var(--sage-600)] text-sm shrink-0">{isOpen ? '▲' : '▼'}</span>
                        </button>
                        {isOpen && (
                          <ul className="px-5 pb-5 space-y-2.5 border-t border-[#E6EDE9] pt-4">
                            {w.items.map((item, idx) => {
                              const key = `w${w.week}-${idx}`;
                              const done = Boolean(coachingChecks[key]);
                              return (
                                <li key={key}>
                                  <label className="flex items-start gap-3 text-sm text-[#2A3A32] cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={done}
                                      onChange={() => {
                                        const next = { ...coachingChecks, [key]: !done };
                                        setCoachingChecks(next);
                                        localStorage.setItem(COACHING_CHECKS_KEY, JSON.stringify(next));
                                      }}
                                      className="mt-1 rounded border-[#C5A46E] text-[#C5A46E] focus:ring-[#C5A46E]"
                                    />
                                    <span className={done ? 'line-through text-[#5A6B62]' : ''}>{item}</span>
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* COMPTE */}
        {activeTab === 'compte' && (
          <div className="max-w-lg space-y-6">
            <h2 className="text-3xl font-semibold tracking-tight mb-2">Mon compte</h2>
            <p className="text-sm text-[#5A6B62] -mt-1 mb-1">
              {authUser
                ? 'Ton espace personnel : profil, accès et raccourcis.'
                : 'Connecte-toi pour le forum et pour sauver ton accès premium partout.'}
            </p>

            <AuthPanel
              user={authUser}
              displayName={displayName}
              onAuthChange={() => {
                void refreshAuth();
                void loadForumFromSupabase();
              }}
              onDisplayNameChange={setDisplayName}
            />

            {authUser && (
              <div className="card rounded-3xl p-6 sm:p-8 space-y-4 border border-[#E6EDE9]">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold text-white ${
                      isCoaching
                        ? 'bg-[#C5A46E]'
                        : isPremium
                          ? 'bg-[var(--sage-600)]'
                          : 'bg-[#8A9A92]'
                    }`}
                  >
                    {isCoaching ? 'COACHING' : isPremium ? 'ILLIMITÉ' : 'GRATUIT'}
                  </span>
                  <span className="text-sm font-medium text-[#2A3A32]">
                    {getAccessLabel(accessTier)}
                  </span>
                </div>
                <ul className="space-y-2 text-sm text-[#5A6B62]">
                  {isCoaching ? (
                    <>
                      <li>• Chat IA illimité + ebook Hormones Sereine</li>
                      <li>• Suivi coaching 4 semaines avec Yas</li>
                      <li>• Forum, protocoles et chat privé</li>
                    </>
                  ) : isPremium ? (
                    <>
                      <li>• Chat IA illimité (9 expertes)</li>
                      <li>• Ebook Hormones Sereine à télécharger</li>
                      <li>• Forum communauté</li>
                    </>
                  ) : (
                    <>
                      <li>• 10 questions au chat IA</li>
                      <li>• Forum (lecture + publication une fois connectée)</li>
                      <li>• Bilan & tip du jour</li>
                    </>
                  )}
                </ul>
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setActiveTab('chat')}
                    className="btn-primary px-4 py-2.5 rounded-xl text-sm font-semibold"
                  >
                    Aller au chat
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forum')}
                    className="btn-secondary px-4 py-2.5 rounded-xl text-sm font-semibold"
                  >
                    Forum
                  </button>
                  {hasEbook && (
                    <a
                      href="/api/download/ebook?paid=true"
                      download
                      className="btn-secondary px-4 py-2.5 rounded-xl text-sm font-semibold text-center"
                    >
                      Télécharger l&apos;ebook
                    </a>
                  )}
                </div>
                {!isCoaching && (
                  <div className="pt-1 space-y-1.5">
                    <a
                      href={BEACONS_DISCOVERY_CALL_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-[#6C6B9A] font-medium hover:underline"
                    >
                      Appel découverte gratuit avec Yas →
                    </a>
                    <a
                      href={BEACONS_COACHING_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-[#8A6E3A] font-medium hover:underline"
                    >
                      {isPremium
                        ? 'Passer au coaching 4 semaines (167 €) →'
                        : 'Accompagnement humain 4 semaines — 167 € →'}
                    </a>
                  </div>
                )}
              </div>
            )}

            <div className="card rounded-3xl p-6 sm:p-8 space-y-4 text-sm">
              <div>
                <span className="text-[#5A6B62]">Statut :</span>{' '}
                <span className="font-medium">{getAccessLabel(accessTier)}</span>
              </div>
              <div>
                <span className="text-[#5A6B62]">Sur le compte :</span>{' '}
                <span className="font-medium">
                  {!authUser
                    ? 'Non connectée'
                    : accessOnAccount && isPremium
                      ? 'Premium enregistré ✓'
                      : isPremium
                        ? 'Premium sur cet appareil seulement'
                        : 'Accès gratuit'}
                </span>
              </div>
              <div>
                <span className="text-[#5A6B62]">Depuis :</span>{' '}
                <span className="font-medium">
                  {accessSince
                    ? new Date(accessSince).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })
                    : isPremium
                      ? "Aujourd'hui"
                      : '—'}
                </span>
              </div>
              {isPremium && accessOnAccount && authUser && (
                <div className="text-[#5A6B62]">
                  Ton accès est lié à ton compte : il te suit sur téléphone, ordi, etc. dès que tu es connectée.
                </div>
              )}
              {isPremium && authUser && !accessOnAccount && (
                <div className="space-y-2">
                  <p className="text-[#5A6B62]">
                    Premium actif sur cet appareil, pas encore sur le compte cloud.
                  </p>
                  <button
                    type="button"
                    disabled={bindingAccess}
                    onClick={() => void bindAccessToAccount()}
                    className="btn-primary px-4 py-2 rounded-xl text-sm disabled:opacity-60"
                  >
                    {bindingAccess ? 'Liaison…' : 'Enregistrer sur mon compte'}
                  </button>
                </div>
              )}
              {isPremium && !authUser && (
                <div className="text-[#5A6B62]">
                  Crée un compte (ci-dessus) pour retrouver ton accès sur tous tes appareils après un achat Beacons.
                </div>
              )}
              {hasEbook && (
                <a
                  href="/api/download/ebook?paid=true"
                  className="inline-flex items-center gap-2 text-[var(--sage-600)] font-medium hover:underline"
                  download
                >
                  <BookOpen className="h-4 w-4" /> Télécharger Hormones Sereine (PDF)
                </a>
              )}
              {!isPremium && (
                <a
                  href={BEACONS_EBOOK_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-[var(--sage-600)] font-medium hover:underline"
                >
                  Hormones Sereine + chat illimité (9,99 €) →
                </a>
              )}
              {isCoaching && <div className="pt-2 text-[#C5A46E]">Chat privé avec la coach activé</div>}

              {isPremium && (
                <div className="pt-3 border-t border-[#E6EDE9] space-y-2">
                  <p className="text-xs text-[#5A6B62]">
                    Accès de test ou à réinitialiser ? Tu peux repasser en gratuit sur cet appareil
                    et sur ton compte (n&apos;utilise pas ça si tu as vraiment acheté).
                  </p>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await fetch('/api/access/reset-to-free', { method: 'POST' });
                        const data = await res.json();
                        clearStoredAccess();
                        localStorage.removeItem(COACHING_START_KEY);
                        setCoachingStartedAt(null);
                        setAccessTier('free');
                        setAccessSince(null);
                        setAccessOnAccount(false);
                        toast.success(data.message || 'Accès remis en gratuit');
                      } catch {
                        toast.error('Impossible de réinitialiser pour le moment');
                      }
                    }}
                    className="text-sm font-medium text-[#8A6E3A] underline hover:text-[#2A3A32]"
                  >
                    Repasser en accès gratuit
                  </button>
                </div>
              )}
            </div>

            <div className="card rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="font-semibold text-lg">Activer mon accès Beacons</h3>
              <p className="text-sm text-[#5A6B62]">
                Tu as acheté sur Beacons ? Suis ces 4 étapes pour débloquer ton accès ici.
              </p>

              <ol className="space-y-3 text-sm text-[#5A6B62]">
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--sage-600)] text-white text-xs font-semibold">
                    1
                  </span>
                  <span>
                    <strong className="text-[#2A3A32]">Achète</strong> l&apos;ebook ou le coaching sur Beacons
                    (paiement sécurisé).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--sage-600)] text-white text-xs font-semibold">
                    2
                  </span>
                  <span>
                    <strong className="text-[#2A3A32]">Reçois</strong> ton lien ou ton code par email
                    (regarde aussi les spams).
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--sage-600)] text-white text-xs font-semibold">
                    3
                  </span>
                  <span>
                    <strong className="text-[#2A3A32]">Connecte-toi</strong> sur cette page (compte ci-dessus)
                    pour que le premium te suive sur tous tes appareils.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--sage-600)] text-white text-xs font-semibold">
                    4
                  </span>
                  <span>
                    <strong className="text-[#2A3A32]">Colle</strong> le lien ou le code ci-dessous, puis
                    appuie sur Activer.
                  </span>
                </li>
              </ol>

              {!authUser && (
                <p className="text-xs text-amber-800 bg-amber-50 rounded-xl px-3 py-2">
                  Conseil : fais l&apos;étape 3 avant l&apos;étape 4 — sinon l&apos;accès reste seulement sur
                  cet appareil.
                </p>
              )}

              <div className="rounded-2xl bg-[#F7FAF8] border border-[#E6EDE9] px-3 py-2.5 text-xs text-[#5A6B62]">
                <span className="font-medium text-[#2A3A32]">Exemple :</span> un code ressemble à{' '}
                <code className="bg-white px-1.5 py-0.5 rounded border border-[#E6EDE9]">
                  nb-ebook-····
                </code>{' '}
                ou un lien vers naturabioyas.fr/acces/…
              </div>

              <input
                type="text"
                value={accessCode}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAccessCode(e.target.value)}
                placeholder="Colle ici ton lien ou ton code"
                className="w-full border border-[#E6EDE9] rounded-xl px-4 py-3 text-sm"
              />
              <button
                type="button"
                onClick={activateWithCode}
                disabled={activatingCode}
                className="btn-primary w-full py-3 rounded-2xl font-semibold text-sm disabled:opacity-60"
              >
                {activatingCode ? 'Activation…' : 'Activer mon accès'}
              </button>

              <p className="text-xs text-[#5A6B62] leading-relaxed">
                Tu n&apos;as pas reçu ton accès ?{' '}
                <a
                  href="mailto:contact@naturabioyas.fr?subject=Acc%C3%A8s%20Beacons%20non%20re%C3%A7u"
                  className="text-[var(--sage-600)] font-medium hover:underline"
                >
                  Écris-moi à contact@naturabioyas.fr
                </a>
                {' '}avec l&apos;email utilisé sur Beacons — je t&apos;aide.
              </p>
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
            <div className="text-[10px] font-medium tracking-tight text-[var(--sage-600)]">by yas</div>
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
