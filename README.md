# natura'bio by yas

Site + application web pour la santé et le bien-être au naturel (aromathérapie, naturopathie, médecine prophétique, MTC, nerf vague, hormones, etc.).

**Modèle** :
- Ebook d’entrée « Ménopause au Naturel » → 9,99 €
- Accès immédiat à l’app (Chat IA multi-agents + Forum)
- Upsell Coaching 4 semaines personnalisé (WhatsApp remplacé par chat privé dans l’app) → 299,99 €

## Stack
- Next.js 16 + TypeScript + Tailwind
- Vercel AI SDK + xAI (Grok) pour le chat intelligent
- Stripe (à brancher)
- Supabase (auth + DB + stockage + realtime) — à brancher
- Sonner (toasts)

## Démarrage rapide (Windows) - Version Beacons

Tu vends déjà sur **Beacons**. Parfait ! On redirige les achats vers tes pages Beacons existantes. Le site sert de belle vitrine + espace membres (chat IA + forum).

### Configuration

1. Ouvre `app/page.tsx` et remplace les deux liens en haut du fichier :
   ```ts
   const BEACONS_EBOOK_LINK = "https://beacons.ai/ton_nom/lien-ebook";
   const BEACONS_COACHING_LINK = "https://beacons.ai/ton_nom/lien-coaching";
   ```

2. (Optionnel) Ajoute ta clé **XAI_API_KEY** dans `.env.local` si tu veux que le chat IA fonctionne vraiment.

3. Lance :
   ```bash
   cd C:\Users\yasme\projets\sagesse-vitale
   npm run dev
   ```

Ouvre http://localhost:3000

### Comment donner l'accès à l'espace membres après achat sur Beacons

C'est la partie importante pour la fidélisation.

Option recommandée (simple) :
- Dans la page de remerciement / email de confirmation Beacons, ajoute ce texte + lien :

```
Merci pour ton achat !

Accède immédiatement à ton espace membres (chat IA avec 8 expertes + forum de la communauté) ici :
https://ton-domaine.com/espace?unlocked=ebook

(Conserve ce lien précieusement)
```

Tu peux utiliser le même lien pour le coaching (`?unlocked=coaching`).

### Tester rapidement
- Page d'accueil : http://localhost:3000
- Espace ebook : http://localhost:3000/espace?unlocked=ebook
- Espace coaching : http://localhost:3000/espace?unlocked=coaching

### Téléchargement de l'ebook
Le bouton de téléchargement apparaît dans l'espace quand l'utilisateur est débloqué. Place ton PDF ici si tu veux proposer le téléchargement direct depuis le site :
`ebooks/menopause-au-naturel.pdf`

Sinon, tu peux simplement livrer le PDF depuis Beacons comme tu le fais déjà.

## Prochaines étapes (ce qu'il reste à faire pour du vrai)

- [ ] Intégration Stripe réelle (Checkout + Webhook + mise à jour accès)
- [ ] Supabase Auth + base de données (users, achats, posts forum, historique chat, protocoles)
- [ ] Stockage de l'ebook PDF (bucket privé + signed URL après achat)
- [ ] Chat privé coach pour les clientes en coaching
- [ ] Booking visio (Cal.com embed ou formulaire)
- [ ] Vrais prompts + base de connaissances (RAG optionnel)
- [ ] Design final + assets (logo, photos, cover ebook)
- [ ] Pages légales complètes + mentions
- [ ] Déploiement Vercel + domaine

## Important — Santé
Tous les textes contiennent des disclaimers forts. L'IA a été promptée pour ne jamais se substituer à un avis médical.

Tu es responsable de la conformité légale en France/Europe (RGPD, allégations santé, etc.). Je te conseille fortement de faire relire par un avocat spécialisé.

## Besoin d'aide ?
Dis-moi ce que tu veux prioriser ensuite :
- Stripe + vrais paiements ?
- Supabase + auth réelle ?
- Intégration de ton ebook PDF existant ?
- Création de visuels avec Canva MCP ?
- Renommer la marque ?

Bonne construction !
