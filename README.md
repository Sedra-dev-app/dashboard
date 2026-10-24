# ⚡ Sedra Command Center — Back-office Supabase

Dashboard d'administration sur-mesure pour **[sedra-dev.com](https://sedra-dev.com)**.
Conçu avec la Direction Artistique exacte du site (fond noir, surfaces bleu nuit, accent indigo `#6366f1` / violet / cyan, typographies Geist & Inter, cartes en verre dépoli et halos aurora animés).

---

## 🚀 Démarrage rapide

### 1. Lancer le serveur de développement en local
```bash
npm run dev
```
Ouvrez ensuite [http://localhost:5173](http://localhost:5173).

> 💡 **Mode Démo Immédiat :** Sur l'écran de connexion, un bouton **« Accéder en Mode Démo (Données réelles) »** vous permet d'explorer l'intégralité du tableau de bord avec des données réalistes (leads, clients, CA, Forfait Sérénité) même avant d'avoir configuré votre compte Supabase.

---

## 🗄️ Initialisation de votre Base Supabase

Votre projet Supabase est configuré sur :
`https://hupewwtgrfuxowpdsxjw.supabase.co`

### Pour créer toutes les tables et la sécurité RLS en 1 clic :
1. Allez sur votre dashboard Supabase : [supabase.com/dashboard/project/hupewwtgrfuxowpdsxjw](https://supabase.com/dashboard/project/hupewwtgrfuxowpdsxjw)
2. Cliquez sur l'onglet **SQL Editor** dans le menu de gauche.
3. Cliquez sur **New query**.
4. Ouvrez le fichier local [`supabase/schema.sql`](./supabase/schema.sql), copiez l'intégralité de son contenu et collez-le.
5. Cliquez sur le bouton vert **Run**.

**Ce script configure automatiquement :**
- `profiles` : Votre compte admin (le premier compte inscrit devient admin par défaut).
- `leads` : Demandes de contact et d'audits SEO en temps réel.
- `clients` : Portefeuille de clients avec fiches complètes.
- `projects` & `tasks` : Pipeline Kanban de suivi de développement.
- `quotes` & `invoices` : Devis et factures officiels avec montants.
- `subscriptions` : Abonnements au **Forfait Sérénité à 10 € / mois**.
- `seo_audits` : Scores Google Core Web Vitals et conformité GEO IA.
- `activity_log` : Journal d'activité alimenté automatiquement par des triggers SQL.
- `submit_lead(...)` : Fonction RPC publique avec protection anti-spam (honeypot + limite d'envois) pour relier votre formulaire de contact en direct !

---

## 🔗 Relier le formulaire de contact de `sedra-dev.com`

Sur votre site vitrine `sedra-dev.com`, remplacez l'envoi de formulaire actuel par cet appel Supabase :

```ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://hupewwtgrfuxowpdsxjw.supabase.co',
  'VOTRE_CLE_ANON_PUBLIC'
)

// Dans le handler de soumission de votre formulaire :
const { data, error } = await supabase.rpc('submit_lead', {
  p_name: nom,
  p_email: email,
  p_phone: telephone,
  p_company: entreprise,
  p_website: siteWeb,
  p_service: 'Site vitrine sur-mesure',
  p_budget: '590 €',
  p_message: message,
  p_source: 'contact', // ou 'audit_seo'
  p_honeypot: '' // champ caché anti-bot
})
```
Dès qu'un visiteur soumet le formulaire, une notification sonore retentit et le lead s'affiche en **temps réel** sur votre dashboard !

---

## ☁️ Déploiement sur Vercel

1. Poussez ce dossier `DASHBOARD` sur votre GitHub.
2. Rendez-vous sur votre compte **Vercel** et importez le repository.
3. Dans **Environment Variables**, ajoutez les 2 clés suivantes :
   - `VITE_SUPABASE_URL` = `https://hupewwtgrfuxowpdsxjw.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
4. Déployez ! Le fichier `vercel.json` est déjà configuré avec les règles de routage SPA et l'interdiction de crawl (`X-Robots-Tag: noindex, nofollow`).

---

## 📱 Fonctionnalités et Raccourcis

- **⌘K / Ctrl+K** : Palette de commandes globale pour rechercher n'importe quel lead, client ou page instantanément.
- **Conversion en 1 clic** : Transformez n'importe quel lead en client actif avec création automatique de sa fiche.
- **Tableau Kanban** : Projets glissables par statut (Cadrage, Dev, Recette, Livré).
- **Temps Réel natif** : Invalidation automatique du cache et toasts de notification.
- **Responsive Mobile-First** : Barre de navigation basse escamotable pensée pour smartphone.
