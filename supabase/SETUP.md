# Brancher Supabase (auth + forum)

## 1. Créer le projet
1. Va sur [supabase.com](https://supabase.com) → New project  
2. Note la région (idéalement EU / Ireland)  
3. Attends que le projet soit prêt (~1 min)

## 2. Clés API
**Project Settings → API** :
- `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- `anon` `public` → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 3. Tables + règles de sécurité
**SQL Editor** → New query → colle tout le contenu de `schema.sql` → **Run**.

Tu dois voir les tables `profiles`, `forum_posts`, `forum_replies` + 3 discussions d’exemple.

## 4. Auth email + confirmation (Resend SMTP)

**Authentication → Providers → Email** : activé  
**Confirm email** : **ON** (confirmation obligatoire)

**Authentication → URL Configuration** :
- Site URL : `https://naturabioyas.fr`
- Redirect URLs :  
  - `https://naturabioyas.fr/**`  
  - `http://localhost:3000/**`

### SMTP Resend (pour recevoir vraiment les mails)

Sans SMTP perso, les mails Supabase arrivent mal. Avec Resend (déjà utilisé pour le bilan) :

1. [resend.com](https://resend.com) → API Keys → copie ta clé `re_...`
2. Domaine `naturabioyas.fr` **vérifié** dans Resend
3. Dans Supabase : **Project Settings → Authentication** (ou **Auth → SMTP Settings**)
4. Active **Custom SMTP** et remplis :

| Champ | Valeur |
|--------|--------|
| Sender email | `contact@naturabioyas.fr` (ou autre adresse du domaine vérifié) |
| Sender name | `Natura'bio by yas` |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | ta clé API Resend `re_...` |

5. **Save**
6. Test : crée un nouveau compte sur le site → regarde la boîte mail + spams

Doc Resend : https://resend.com/docs/send-with-supabase-smtp

## 5. Variables d’environnement

### Local (`.env.local`)
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ....
```

### Vercel
Project → Settings → Environment Variables → ajoute les 2 clés (Production + Preview)  
puis **Redeploy**.

## 6. Service role (achat Beacons → premium sur le compte)

Pour enregistrer `ebook` / `coaching` dans `profiles.access_tier` de façon fiable :

1. Supabase → **Project Settings → API Keys**
2. Copie la clé **secret** / **service_role** (pas la publishable)
3. Vercel → Environment Variable :
   - Name : `SUPABASE_SERVICE_ROLE_KEY`
   - Value : la clé secret
   - Production (+ Preview)
4. Redeploy

Sans cette clé, la liaison compte fonctionne souvent quand même (session user), mais la service role est recommandée.

### Parcours cliente
1. Achat Beacons → lien `/acces/ebook/TOKEN` ou `/acces/coaching/TOKEN`
2. Idéal : déjà connectée sur le site → premium écrit sur le profil
3. Sinon : débloqué sur l’appareil → **Compte** → se connecter → auto-liaison (ou bouton « Enregistrer sur mon compte »)
4. Autre appareil : se connecter → premium retrouvé via `/api/access/me`

## 7. Tester
1. https://naturabioyas.fr/espace → onglet **Compte** → créer un compte  
2. Onglet **Forum** → poser une question  
3. Ouvre en navigation privée avec un 2ᵉ compte → tu dois voir le post
4. Connectée + activer un code Beacons → Table Editor → `profiles` → `access_tier` = ebook ou coaching

## Dépannage
| Problème | Cause fréquente |
|----------|-----------------|
| « Forum temporairement indisponible » | SQL `schema.sql` pas exécuté |
| Impossible de publier | Pas connectée / Confirm email encore ON |
| Mode démo | Variables Supabase absentes sur Vercel |
| Premium pas sur le compte | Pas connectée au moment de l’activation / service role absente |
