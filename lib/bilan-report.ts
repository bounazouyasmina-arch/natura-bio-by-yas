export type BilanInput = {
  ageRange: string;
  duration: string;
  goals: string;
  mainConcerns: string[];
};

export type ConcernReport = {
  concern: string;
  title: string;
  reading: string;
  whyNow: string;
  ageNote: string;
  dailyProtocol: string[];
  foodAndPlants: string[];
  lifestyle: string[];
  avoid: string[];
  sevenDayTest: string;
};

export type BilanReport = {
  headline: string;
  synthesis: string;
  profileReading: string;
  durationInsight: string;
  goalSection: string | null;
  concerns: ConcernReport[];
  priorityPlan: string[];
  weekPlan: { day: string; focus: string; actions: string[] }[];
  closingMessage: string;
  disclaimer: string;
  /** plain text blocks for email / simple render */
  detailedAdvice: string[];
  summary: string;
  message: string;
  recommendations: string[];
};

type ConcernContent = {
  title: string;
  reading: string;
  mechanisms: string;
  dailyProtocol: string[];
  foodAndPlants: string[];
  lifestyle: string[];
  avoid: string[];
  sevenDayTest: string;
  keywords: string[];
};

const CONCERNS: ConcernContent[] = [
  {
    keywords: ['stress', 'anxiété', 'charge mentale'],
    title: 'Stress, anxiété & charge mentale',
    reading:
      'Ton système nerveux semble en mode alerte prolongée. Ce n’est pas « dans ta tête » : le corps garde la tension (respiration haute, mâchoire, digestion, sommeil léger).',
    mechanisms:
      'Quand le stress dure, le corps sécrète plus de cortisol. Résultat : fatigue paradoxale, irritabilité, envies de sucre, et difficulté à « débrancher ».',
    dailyProtocol: [
      'Matin (2 min) : 6 respirations lentes (inspire 4 s, expire 6 s) avant le téléphone.',
      'Midi : pause réelle de 8–10 min sans écran (marche, eau, air).',
      'Soir (5 min) : « brain dump » — écris tout ce qui tourne en tête, puis ferme le carnet.',
      'Ancre anti-pic : applique sur les poignets un roll-on dilué à base d’huile essentielle de lavande (éventuellement associée à une note d’agrumes doux), et prends trois respirations lentes.',
    ],
    foodAndPlants: [
      'Magnésium le soir (alimentation : cacao, amandes, graines de courge ; ou complément selon avis pro).',
      'Infusions : mélisse, camomille, verveine (1 tasse en fin d’après-midi + 1 le soir).',
      'Oméga-3 (petits poissons gras, noix, graines de lin moulues) pour soutenir le système nerveux.',
      'Réduis caféine après 14h : elle amplifie l’anxiété latente.',
    ],
    lifestyle: [
      'Coupe les notifications non essentielles 1h le soir.',
      '1 limite claire par jour (ex. : « je ne regarde pas les mails après 19h »).',
      'Mouvement doux 15–20 min (marche, yoga, étirements) plutôt qu’un effort extrême si tu es déjà à bout.',
    ],
    avoid: [
      'Empiler 5 solutions d’un coup (trop de plantes + 3 routines = surcharge).',
      'Se juger (« je devrais gérer ») : la charge mentale se calme avec des rituels simples, pas avec la culpabilité.',
    ],
    sevenDayTest:
      '7 jours : cohérence cardiaque 5 min, 2×/jour (matin + soir) + 1 tasse mélisse le soir. Note chaque soir ton niveau de tension /10.',
  },
  {
    keywords: ['insomnie', 'sommeil', 'troubles du sommeil'],
    title: 'Sommeil & nuits fragmentées',
    reading:
      'Ton sommeil demande un cadre plus prévisible. Le corps s’endort mieux quand la lumière, la température et le rythme du soir sont stables.',
    mechanisms:
      'Écrans, caféine, stress non digéré et horaires irréguliers retardent la mélatonine et fragmentent le sommeil profond.',
    dailyProtocol: [
      'Heure de coucher cible fixe (±30 min max).',
      '90 min avant le lit : lumière plus basse, téléphone hors chambre si possible.',
      'Rituel 15 min : douche tiède ou étirements + lecture papier + respiration 4-7-8 (4 cycles).',
      'Si réveil nocturne : ne regarde pas l’heure ; respiration abdominale + phrase simple (« je suis en sécurité, je peux me reposer »).',
    ],
    foodAndPlants: [
      'Magnésium le soir + collation légère si faim (yaourt nature / poignée d’amandes) — pas de gros repas tardif.',
      'Infusions : camomille, passiflore, tilleul, mélisse (teste 1 seule 5 soirs d’affilée).',
      'Diffuse l’huile essentielle de lavande le soir, ou place une goutte diluée près de l’oreiller si ta peau le tolère bien.',
      'Évite alcool « pour dormir » : il fragmente la 2ᵉ partie de nuit.',
    ],
    lifestyle: [
      'Exposition lumière du jour 10–15 min le matin (balcon, marche) pour caler l’horloge interne.',
      'Si tu fais la sieste : max 20 min avant 15h.',
      'Chambre fraîche, obscure, silencieuse autant que possible.',
    ],
    avoid: [
      'Scroll au lit « juste 5 minutes ».',
      'Changer 4 plantes chaque nuit : choisis un protocole simple et tiens-le 7–10 jours.',
    ],
    sevenDayTest:
      '7 soirs : même heure de coucher + 0 écran 45 min avant + 4 cycles de respiration 4-7-8. Note le temps d’endormissement et le nombre de réveils.',
  },
  {
    keywords: ['fatigue chronique', 'baisse d\'énergie', 'énergie', 'fatigue'],
    title: 'Fatigue & manque d’énergie',
    reading:
      'Ta fatigue n’est pas qu’un manque de « motivation » : elle signale souvent un rythme nerveux trop tendu, un sommeil non réparateur, une glycémie en yoyo, ou une récupération insuffisante.',
    mechanisms:
      'Lorsque le stress, le sommeil fragmenté et les repas irréguliers s’additionnent, l’énergie devient souvent irrégulière : le corps se met en mode survie plutôt qu’en mode vitalité.',
    dailyProtocol: [
      'Matin : hydratation (grand verre d’eau) + petit-déjeuner avec protéines (œufs, yaourt, amandes, restes salés).',
      'Lumière naturelle 10 min dans l’heure qui suit le réveil.',
      '1 micro-pause énergie à 15h : 5 min marche + respiration, plutôt qu’un 2ᵉ café.',
      'Coucher plus tôt de 30 min pendant 10 jours (souvent plus efficace qu’un stimulant).',
    ],
    foodAndPlants: [
      'Protéines à chaque repas + fibres (légumes, légumineuses) pour stabiliser l’énergie.',
      'Fer + vitamine C si alimentation peu variée (légumineuses + agrumes) ; consulte un pro si fatigue lourde.',
      'Adaptogènes doux possibles selon terrain : maca ½ c.c. le matin, ou rhodiole (sauf si anxiété forte / avis pro).',
      'Réduis sucres rapides l’après-midi (rebond puis crash).',
    ],
    lifestyle: [
      'Mouvement court quotidien > sport extrême 1×/semaine si tu es déjà épuisée.',
      '1 « non » par jour pour protéger ton énergie.',
      'Vérifie hydratation (urine claire) et sommeil avant d’empiler les compléments.',
    ],
    avoid: [
      'Multiplier café + energy drinks : ça masque la fatigue et aggrave le crash.',
      'Se comparer aux routines Instagram : ton corps a besoin de récupération, pas de performance.',
    ],
    sevenDayTest:
      '7 jours : protéines le matin + 10 min de marche dehors + coucher 30 min plus tôt. Note ton énergie /10 à 10h, 15h et 20h.',
  },
  {
    keywords: ['irritabilité', 'sautes d\'humeur', 'humeur'],
    title: 'Irritabilité & sautes d’humeur',
    reading:
      'L’irritabilité est souvent un signal de surcharge : système nerveux tendu, glycémie instable, sommeil léger, cycle hormonal, ou trop de stimuli.',
    mechanisms:
      'Quand le corps n’a plus de marge, le moindre grain de sable devient un pic émotionnel. Ce n’est pas un défaut de caractère.',
    dailyProtocol: [
      'Dès le pic : 6 respirations expire plus longue (inspire 4, expire 6–8).',
      'Repas réguliers : ne saute pas le déjeuner (souvent déclencheur d’irritabilité).',
      'Soir : 10 min sans écran pour « descendre » avant le lit.',
      'Phrase d’ancrage : « Je peux ralentir 60 secondes avant de répondre ».',
    ],
    foodAndPlants: [
      'Magnésium + oméga-3 + réduction sucre raffiné.',
      'Infusions camomille / verveine en fin de journée.',
      'Si ta peau le permet : un roll-on dilué avec de l’huile essentielle de géranium ou de lavande, en application locale légère.',
      'Hydratation + sel minéral léger si tu bois beaucoup de café.',
    ],
    lifestyle: [
      'Identifie 2 déclencheurs récurrents (faim, bruit, surcharge de messages).',
      'Prépare une réponse type pour les demandes urgentes (« je te réponds ce soir »).',
      'Mouvement pour évacuer (marche rapide 12 min) plutôt que ruminer.',
    ],
    avoid: [
      'Café à jeun + scroll anxiogène le matin.',
      'Se critiquer après un pic : observe le pattern, ajuste le terrain.',
    ],
    sevenDayTest:
      '7 jours : 3 repas stables + 0 café après 14h + respiration 4/6 à chaque pic. Note les moments où l’irritabilité monte.',
  },
  {
    keywords: ['brouillard', 'concentration', 'mental'],
    title: 'Brouillard mental & concentration',
    reading:
      'Le brouillard mental vient souvent du trio sommeil / stress / glycémie, parfois d’une surcharge cognitive (trop d’onglets mentaux).',
    mechanisms:
      'Le cerveau a besoin de sommeil profond, de glucose stable et de pauses. Sans ça, la clarté chute même si tu « forces ».',
    dailyProtocol: [
      'Blocs de focus 25 min + pause 5 min (une seule tâche).',
      'Le matin, inhales pendant une trentaine de secondes l’huile essentielle de romarin ou de citron, si tu les tolères bien.',
      'Hydratation dès le réveil + petit-déjeuner protéiné.',
      'Après le déjeuner : marche 8–10 min pour éviter le « down » mental.',
    ],
    foodAndPlants: [
      'Oméga-3, baies, légumes verts, curcuma + poivre (anti-inflammatoire doux).',
      'Réduis ultra-transformés et sucre en fin de matinée.',
      'Thé vert ou matcha en début de journée (modéré) plutôt que multi-cafés.',
      'Si tu grignotes : noix / yaourt plutôt que biscuits.',
    ],
    lifestyle: [
      'Coupe le multitasking : une notification = un coût mental.',
      'Note 3 priorités max par jour (pas 12).',
      'Sommeil : priorité n°1 si le brouillard est fort.',
    ],
    avoid: [
      'Écrans dès le réveil (charge cognitive immédiate).',
      'Surcharger en nootropiques sans stabiliser sommeil et repas.',
    ],
    sevenDayTest:
      '7 jours : 2 blocs focus 25 min/jour + protéines le matin + 0 téléphone pendant le 1er bloc. Note ta clarté /10 à 11h.',
  },
  {
    keywords: ['peau', 'problèmes de peau'],
    title: 'Peau & terrain',
    reading:
      'La peau reflète souvent le stress, le sommeil, l’inflammation et la digestion. Traiter uniquement « en surface » aide peu si le terrain reste tendu.',
    mechanisms:
      'Cortisol, sucre, manque de sommeil et barrière cutanée fragilisée entretiennent rougeurs, imperfections ou inconfort.',
    dailyProtocol: [
      'Routine courte : nettoyage doux + hydratation + SPF le jour (simplicité > 8 produits).',
      'Draps / taie propres 1–2×/semaine ; mains propres avant de toucher le visage.',
      'Soir : 5 min de respiration avant le lit si stress fort (la peau « digère » aussi le mental).',
      'Journal 7 jours : lien stress / cycle / alimentation / poussées.',
    ],
    foodAndPlants: [
      'Oméga-3, zinc alimentaire (graines, légumineuses), légumes colorés.',
      'Hydratation régulière ; limite alcool et sucre en pic.',
      'Probiotiques alimentaires (kéfir, choucroute si tolérée) pour le lien intestin-peau.',
      'Tisane douce (camomille) si stress associé.',
    ],
    lifestyle: [
      'Sommeil prioritaire : 7h+ autant que possible.',
      'Évite le sur-nettoyage et les gommages agressifs quotidiens.',
      'Gère la charge mentale : les poussées suivent souvent les pics de stress.',
    ],
    avoid: [
      'Multiplier les actifs forts en même temps (rétinol, acides, etc.).',
      'Appliquer une huile essentielle pure sur le visage sans dilution ni conseil professionnel.',
    ],
    sevenDayTest:
      '7 jours : routine 3 étapes max + sucre réduit + 7h de sommeil visées. Photo + notes (stress, cycle, repas).',
  },
  {
    keywords: ['digestif', 'digestion', 'ballonnement'],
    title: 'Digestion & confort intestinal',
    reading:
      'Un ventre tendu change l’énergie, l’humeur et même la peau. La digestion s’améliore souvent avec le rythme des repas, le stress et la mastication — pas seulement avec une plante miracle.',
    mechanisms:
      'Sous stress, le nerf vague se met souvent en retrait et la digestion ralentit. Manger trop vite, trop froid ou certains aliments sensibles selon ton terrain peut amplifier les ballonnements.',
    dailyProtocol: [
      'Mâche 15–20 fois les premières bouchées ; pose les couverts entre deux.',
      'Repas dans le calme 10 min (même au bureau : hors écran si possible).',
      'Après repas : 5–8 min de marche douce.',
      'Soir : repas plus léger, 2–3h avant le coucher.',
    ],
    foodAndPlants: [
      'Gingembre, menthe, fenouil en infusion après repas.',
      'Cuisine simple 7–10 jours : moins d’assemblages ultra-transformés.',
      'Teste 5 jours sans boisson gazeuse / chewing-gum (air avalé).',
      'Fibres douces (courgettes, carottes cuites, flocons) si transit fragile ; augmente progressivement.',
    ],
    lifestyle: [
      'Respiration ventrale 3 min avant de manger si tu es stressée.',
      'Hydratation entre les repas plutôt que grands volumes pendant.',
      'Note les aliments déclencheurs (journal simple).',
    ],
    avoid: [
      'Grignotage constant (le système digestif a besoin de pauses).',
      'Empiler 4 compléments digestifs d’un coup sans observer.',
    ],
    sevenDayTest:
      '7 jours : mastication + marche post-repas + 1 infusion gingembre/fenouil. Note ballonnements /10 après déjeuner et dîner.',
  },
  {
    keywords: ['immunité', 'immunitaire'],
    title: 'Immunité & terrain',
    reading:
      'L’immunité se construit sur le sommeil, le stress, l’alimentation et le mouvement — plus que sur un « boost » ponctuel.',
    mechanisms:
      'Manque de sommeil et stress chronique baissent les défenses. Le sucre en excès et la sédentarité n’aident pas.',
    dailyProtocol: [
      'Sommeil : priorité absolue cette semaine.',
      'Lavage des mains + aération 10 min 2×/jour.',
      'Marche dehors 15–20 min (lumière + mouvement).',
      'Si fatigue : repos sans culpabilité (récupérer = stratégique).',
    ],
    foodAndPlants: [
      'Repas colorés (vitamines), protéines, zinc alimentaire, vitamine C (agrumes, kiwi, poivrons).',
      'Ail, oignon, gingembre, bouillons si tu aimes.',
      'Miel + citron en boisson tiède si gorge sensible (pas de miel chez les tout-petits).',
      'Hydratation continue.',
    ],
    lifestyle: [
      'Réduis les dettes de sommeil le week-end (idéalement ±1h).',
      'Gère la charge mentale : le stress « mange » l’immunité.',
      'Mouvement doux > épuisement sportif si déjà fatiguée.',
    ],
    avoid: [
      'Enchaîner 5 « boosters » sans dormir assez.',
      'Se priver de repas par stress (le corps a besoin de carburant).',
    ],
    sevenDayTest:
      '7 jours : 7h de sommeil visées + 1 repas ultra-coloré/jour + 15 min dehors. Note ton niveau d’énergie et de récupération.',
  },
  {
    keywords: ['articul', 'musculaire', 'douleurs'],
    title: 'Douleurs articulaires ou musculaires',
    reading:
      'La douleur demande douceur et régularité : mobilité légère, chaleur, anti-inflammatoire alimentaire et récupération. Forcer aggrave souvent.',
    mechanisms:
      'Inflammation basse grade, tension musculaire liée au stress, manque de mouvement ou au contraire surcharge.',
    dailyProtocol: [
      'Mobilité douce 8–12 min/jour (cercles d’épaules, hanches, marche).',
      'Chaleur locale 10–15 min sur zone tendue (bouillotte).',
      'Respiration 3 min pour baisser le tonus musculaire global.',
      'Étirements yin le soir si raideur matinale.',
    ],
    foodAndPlants: [
      'Curcuma + poivre, gingembre, oméga-3, légumes verts.',
      'Hydratation + magnésium (crampes / tension).',
      'Bain tiède sel d’Epsom 1–2×/semaine si tu aimes.',
      'Massage avec une huile végétale et une dilution d’huile essentielle adaptée aux tensions musculaires, uniquement si ta peau le tolère.',
    ],
    lifestyle: [
      'Alterne positions (assis/debout) si travail de bureau.',
      'Chaussures confortables ; évite les pics d’effort brutal.',
      'Sommeil : la réparation tissulaire se fait la nuit.',
    ],
    avoid: [
      'Immobilité totale « par peur » (le mouvement doux aide souvent).',
      'Anti-inflammatoires en automédication prolongée sans avis médical.',
    ],
    sevenDayTest:
      '7 jours : 10 min mobilité/jour + chaleur le soir + oméga-3 alimentaires. Note douleur /10 matin et soir.',
  },
  {
    keywords: ['cycle', 'spm', 'irrégulier'],
    title: 'Cycle, SPM & rythme hormonal',
    reading:
      'Le cycle est un baromètre : stress, sommeil, glycémie et charge mentale se lisent souvent dans le SPM ou les irrégularités.',
    mechanisms:
      'Les variations d’œstrogènes et de progestérone, associées au stress (cortisol), peuvent se traduire par des seins sensibles, de l’irritabilité, des fringales ou un sommeil altéré selon la phase du cycle.',
    dailyProtocol: [
      'Tiens un mini-journal de cycle 2 mois (humeur, énergie, sommeil, douleurs).',
      'Phase prémenstruelle : allège le planning si possible, priorise sommeil.',
      'Magnésium le soir en 2ᵉ partie de cycle (souvent aidant pour SPM).',
      'Chaleur bas-ventre + respiration si crampes.',
    ],
    foodAndPlants: [
      'Oméga-3, légumes verts, fer si règles abondantes (avec avis pro si besoin).',
      'Réduis sel / alcool / café en pic SPM si seins ou ballonnements.',
      'En soutien aromatique, la sauge sclarée ou la lavande en diffusion douce peuvent accompagner le confort du cycle, selon ton terrain.',
      'Plantes de terrain (agnus-castus etc.) : uniquement avec suivi si tu es sous contraception / pathologie.',
    ],
    lifestyle: [
      'Le sommeil et la gestion du stress restent les leviers prioritaires avant d’empiler des protocoles complexes.',
      'Mouvement doux (marche, yoga) plutôt que HIIT extrême en phase sensible.',
      'Parle de ton rythme à ton entourage pour ajuster les attentes ces jours-là.',
    ],
    avoid: [
      'Comparer ton cycle à celui des autres.',
      'Ignorer des saignements très anormaux : consulte un professionnel de santé.',
    ],
    sevenDayTest:
      'Sur un cycle : journal quotidien énergie/humeur + magnésium le soir en phase prémenstruelle + 0 alcool ces 5 jours. Observe les écarts.',
  },
  {
    keywords: ['poids', 'prise de poids'],
    title: 'Poids & métabolisme doux',
    reading:
      'La prise de poids liée au stress, au sommeil ou aux hormones se gère rarement par la restriction pure. Le corps lâche mieux quand il se sent en sécurité métabolique.',
    mechanisms:
      'Cortisol, dettes de sommeil et yoyo glycémique favorisent le stockage et les fringales. La culpabilité alimentaire empire le cycle.',
    dailyProtocol: [
      'Protéines à chaque repas + légumes + féculent de qualité (assiette stable).',
      'Marche 10 min après le repas principal.',
      'Dîner plus léger, petit-déjeuner digne (stop café seul à jeun si fringales).',
      '1 plaisir alimentaire conscient/jour (sans compensation).',
    ],
    foodAndPlants: [
      'Fibres + protéines pour la satiété ; limite boissons sucrées.',
      'Cannelle / repas équilibrés pour la glycémie ; hydratation avant de grignoter.',
      'Évite les régimes extrêmes 7 jours « detox » qui rebondissent.',
      'Cuisiner simple 80 % du temps > perfection 20 %.',
    ],
    lifestyle: [
      'Sommeil : levier sous-estimé du poids.',
      'Force douce ou marche inclinée 2–3×/semaine plutôt que punition cardio.',
      'Mesure le bien-être (énergie, digestion, humeur) pas seulement la balance.',
    ],
    avoid: [
      'Compter chaque calorie dans l’angoisse.',
      'Sauter des repas puis grignoter le soir.',
    ],
    sevenDayTest:
      '7 jours : protéines à chaque repas + marche post-déjeuner + 7h de sommeil visées. Note faim, énergie, humeur (pas seulement le poids).',
  },
];

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function findConcernContent(label: string): ConcernContent {
  const n = normalize(label);
  const found = CONCERNS.find((c) =>
    c.keywords.some((k) => n.includes(normalize(k)))
  );
  if (found) return found;

  return {
    keywords: [],
    title: label,
    reading: `Tu as signalé « ${label} ». On va le traiter comme un axe de terrain : sommeil, stress, alimentation et rythme de vie en premier, puis des outils naturels ciblés.`,
    mechanisms:
      'Les symptômes isolés sont rares : ils s’inscrivent souvent dans un terrain (nervosité, inflammation, récupération).',
    dailyProtocol: [
      'Choisis 1 levier sommeil OU stress OU repas — pas les trois d’un coup.',
      'Note 7 jours : intensité /10 matin et soir.',
      'Hydratation + 10 min de marche quotidienne.',
      'Rituel du soir court (écran off, respiration, tisane).',
    ],
    foodAndPlants: [
      'Assiette colorée, protéines, oméga-3, moins d’ultra-transformés.',
      'Tisane adaptée (mélisse si stress, gingembre si digestion, camomille si soir).',
      'Magnésium alimentaire (graines, cacao, légumes verts).',
    ],
    lifestyle: [
      'Sommeil régulier, lumière du matin, pauses réelles.',
      'Réduis la charge mentale d’1 chose cette semaine.',
    ],
    avoid: [
      'Accumuler 10 conseils trouvés sur les réseaux.',
      'Ignorer un symptôme brutal / inhabituel : consulte un professionnel.',
    ],
    sevenDayTest:
      '7 jours : 1 habitude ancrée (sommeil ou marche ou repas stable) + carnet simple. Observe ce qui bouge vraiment.',
  };
}

function ageInsight(ageRange: string): string {
  switch (ageRange) {
    case '18-24':
      return 'À ton âge, le terrain réagit souvent vite : stress d’études/début de carrière, écrans, rythme social. Les résultats viennent surtout de la régularité (sommeil, repas, pauses), pas de protocoles ultra-complexes.';
    case '25-34':
      return 'Entre 25 et 34 ans, charge mentale et rythme pro/perso pèsent souvent sur le sommeil, la digestion et l’énergie. Priorise la récupération et la stabilité glycémique avant d’empiler les compléments.';
    case '35-44':
      return 'Entre 35 et 44 ans, le corps tolère moins le « tout donner sans récupérer ». Stress chronique, cycle, sommeil et digestion demandent un rythme plus intelligent : moins de force brute, plus de constance.';
    case '45-54':
      return 'Entre 45 et 54 ans, les variations hormonales, le sommeil et la composition corporelle évoluent. Les approches douces (sommeil, force légère, protéines, gestion du stress) sont souvent plus puissantes que les extrêmes.';
    case '55+':
      return 'Après 55 ans, on mise sur la douceur efficace : mobilité quotidienne, protéines, sommeil, anti-inflammatoire alimentaire, et écoute fine du corps. La constance bat l’intensité.';
    default:
      return 'Quel que soit ton âge, le corps répond mieux à des rituels simples tenus 7 jours d’affilée qu’à une révolution d’un week-end.';
  }
}

function durationInsight(duration: string): string {
  switch (duration) {
    case '< 6 mois':
      return 'C’est encore un signal récent : plus tu agis tôt avec des bases solides (sommeil, stress, repas), plus tu évites l’installation du schéma. Vise des premiers ressentis en 7 jours sur 1–2 axes.';
    case '6-18 mois':
      return 'Ça dure depuis un moment : ton corps a pris des habitudes de compensation. Tiens un protocole simple toute la semaine sans changer de méthode tous les 2 jours.';
    case '> 18 mois':
      return 'C’est un terrain installé. On ne « casse » pas ça en 48h : commence par une semaine solide (sommeil → système nerveux → alimentation), puis on prolonge. Consulte un pro si symptômes invalidants.';
    default:
      return 'Tiens un protocole simple au moins 7 jours avant de juger s’il te convient.';
  }
}

function goalSection(goals: string, concerns: string[]): string | null {
  const g = goals?.trim();
  if (!g) return null;
  return `Tu as formulé comme objectif : « ${g} ». On aligne le plan là-dessus : chaque conseil ci-dessous doit servir cet objectif, pas l’inverse. Tes axes (${concerns.slice(0, 3).join(', ')}${concerns.length > 3 ? '…' : ''}) sont les leviers concrets pour y arriver. Pendant 7 jours, pose-toi chaque soir : « Est-ce que j’ai fait 1 action qui rapproche de mon objectif ? ».`;
}

function buildPriorityPlan(concerns: string[], duration: string): string[] {
  const n = concerns.length;
  const long = duration === '> 18 mois' || duration === '6-18 mois';
  const plan = [
    'Semaine 1 : 1 axe prioritaire seulement (celui qui gâche le plus ton quotidien).',
    'Ancre 2 rituels non négociables (ex. : coucher + respiration, ou protéines matin + marche).',
    'Mesure simple : note /10 chaque soir (énergie, stress, sommeil ou symptôme n°1).',
  ];
  if (n >= 2) {
    plan.push(
      'Semaine 2 : ajoute le 2ᵉ axe seulement si le 1er est stabilisé à 60 %.',
    );
  }
  if (n >= 3) {
    plan.push(
      'Avec plusieurs symptômes, l’ordre gagnant est souvent : sommeil/stress → digestion/énergie → le reste.',
    );
  }
  if (long) {
    plan.push(
      'Comme c’est installé depuis longtemps : juge sur 21 jours, pas sur 3. La courbe est lente puis s’accélère.',
    );
  }
  plan.push(
    'Si un symptôme est brutal, unilatéral, avec fièvre, perte de poids inexpliquée, douleur thoracique, idées noires : contacte un professionnel de santé / urgences selon la gravité.',
  );
  return plan;
}

function buildWeekPlan(
  concerns: string[],
  ageRange: string
): BilanReport['weekPlan'] {
  const primary = concerns[0] || 'ton bien-être global';
  const secondary = concerns[1];
  return [
    {
      day: 'Jours 1–2',
      focus: 'Observer & alléger',
      actions: [
        `Note chaque soir l’intensité de « ${primary} » /10.`,
        'Fixe une heure de coucher cible et une hydratation minimale.',
        'Retire 1 agresseur évident (café tardif, scroll au lit, repas ultra-rapide).',
      ],
    },
    {
      day: 'Jours 3–5',
      focus: 'Ancrer le protocole n°1',
      actions: [
        'Applique le protocole quotidien du 1er axe (ci-dessus) sans ajouter d’autre nouveauté.',
        '1 marche 10–15 min/jour + 1 pause respiration 3 min.',
        ageRange === '45-54' || ageRange === '55+'
          ? 'Privilégie mobilité douce et récupération plutôt que l’intensité.'
          : 'Garde le mouvement agréable : la régularité bat l’exploit.',
      ],
    },
    {
      day: 'Jours 6–7',
      focus: secondary ? `Affiner + 1 geste sur « ${secondary} »` : 'Bilan de la semaine',
      actions: secondary
        ? [
            'Continue le protocole n°1.',
            `Ajoute 1 seule action du 2ᵉ axe (« ${secondary} »).`,
            'Compare tes notes /10 à celles du jour 1 et garde 2–3 habitudes pour la suite.',
          ]
        : [
            'Continue le même protocole jusqu’à dimanche soir.',
            'Compare tes notes /10 à celles du jour 1.',
            'Écris les 2–3 habitudes que tu gardes la semaine prochaine.',
          ],
    },
  ];
}

function concernToPlainBlocks(c: ConcernReport): string[] {
  return [
    `【 ${c.title} 】`,
    c.reading,
    c.whyNow,
    c.ageNote,
    'Protocole du jour :\n' + c.dailyProtocol.map((x) => `• ${x}`).join('\n'),
    'Alimentation & plantes :\n' + c.foodAndPlants.map((x) => `• ${x}`).join('\n'),
    'Mode de vie :\n' + c.lifestyle.map((x) => `• ${x}`).join('\n'),
    'À éviter :\n' + c.avoid.map((x) => `• ${x}`).join('\n'),
    `Test 7 jours : ${c.sevenDayTest}`,
  ];
}

export function buildBilanReport(input: BilanInput): BilanReport {
  const concerns = input.mainConcerns.length
    ? input.mainConcerns
    : ['Bien-être général'];

  const ageNoteGlobal = ageInsight(input.ageRange);
  const dur = durationInsight(input.duration);
  const goal = goalSection(input.goals, concerns);

  const concernReports: ConcernReport[] = concerns.map((label) => {
    const content = findConcernContent(label);
    return {
      concern: label,
      title: content.title,
      reading: content.reading,
      whyNow: `${content.mechanisms} ${dur}`,
      ageNote: ageNoteGlobal,
      dailyProtocol: content.dailyProtocol,
      foodAndPlants: content.foodAndPlants,
      lifestyle: content.lifestyle,
      avoid: content.avoid,
      sevenDayTest: content.sevenDayTest,
    };
  });

  const synthesis =
    concerns.length === 1
      ? `Ton bilan met en lumière un axe central : ${concernReports[0].title}. C’est une bonne nouvelle : en concentrant ton énergie ici, tu peux sentir des changements concrets sans te disperser.`
      : concerns.length === 2
        ? `Deux axes ressortent : ${concernReports.map((c) => c.title).join(' et ')}. Ils se nourrissent souvent l’un l’autre (ex. stress ↔ sommeil, digestion ↔ énergie). On traite le plus invalidant en premier.`
        : `Tu as plusieurs signaux (${concerns.length}). Ce n’est pas « trop de problèmes » : c’est souvent le même terrain (système nerveux, récupération, inflammation) qui s’exprime de plusieurs façons. On priorise pour ne pas t’épuiser.`;

  const profileReading = [
    `Profil : ${input.ageRange || 'âge non précisé'}, symptômes depuis ${input.duration || 'une durée non précisée'}.`,
    ageNoteGlobal,
    input.goals?.trim()
      ? `Objectif déclaré : « ${input.goals.trim()} ».`
      : 'Aucun objectif libre n’a été saisi : on se base sur tes symptômes pour construire le plan.',
  ].join(' ');

  const priorityPlan = buildPriorityPlan(concerns, input.duration);
  const weekPlan = buildWeekPlan(concerns, input.ageRange);

  const closingMessage =
    concerns.length > 2
      ? 'Tu n’as pas à tout réparer d’un coup. 1 axe bien tenu cette semaine vaut mieux que 6 ébauches. Reviens dans 7 jours avec tes notes /10 : tu verras ce qui a vraiment bougé.'
      : 'Sois constante 7 jours, mesure simplement, et ajuste. Le naturel fonctionne quand on lui laisse le temps d’ancrer un nouveau rythme.';

  const disclaimer =
    'Ce bilan est informatif et éducatif (hygiène de vie, pistes naturelles). Il ne remplace pas un diagnostic ni un suivi médical. En cas de doute, grossesse, pathologie, traitement en cours ou symptôme inquiétant, consulte un professionnel de santé.';

  const detailedAdvice = concernReports.flatMap(concernToPlainBlocks);

  return {
    headline: 'Ton bilan santé au naturel — version détaillée',
    synthesis,
    profileReading,
    durationInsight: dur,
    goalSection: goal,
    concerns: concernReports,
    priorityPlan,
    weekPlan,
    closingMessage,
    disclaimer,
    detailedAdvice,
    summary: synthesis,
    message: closingMessage,
    recommendations: [],
  };
}
