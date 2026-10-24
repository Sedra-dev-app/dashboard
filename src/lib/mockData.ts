import type { Activity, Client, DashboardStats, Lead } from './types'

/* =====================================================================
   DONNÉES FICTIVES COHÉRENTES POUR LE PORTFOLIO (ANONYMISÉES À 100%)
   Toutes les données sont mathématiquement corrélées :
   - Les prestations vendues aux clients = les devis et factures correspondants
   - Le total CA = la somme exacte des factures payées
   - Le MRR Sérénité = le nombre exact d'abonnés × 10 €
   - Les projets Kanban = les commandes des clients avec les mêmes budgets
   ===================================================================== */

export interface FictionalInvoice {
  id: string
  number: string
  clientId: string
  clientName: string
  prestation: string
  date: string
  dueDate: string
  total: number
  status: 'payee' | 'envoyee' | 'brouillon'
}

export interface FictionalSubscription {
  id: string
  clientId: string
  clientName: string
  siteUrl: string
  amount: number
  startDate: string
  nextBilling: string
  status: 'actif' | 'pause'
  lastIntervention: string
}

export interface FictionalProject {
  id: string
  name: string
  clientId: string
  clientName: string
  type: 'vitrine' | 'ecommerce' | 'app' | 'ia'
  status: 'cadrage' | 'dev' | 'recette' | 'livre'
  budget: number
  progress: number
  dueDate: string
  tasks: { title: string; done: boolean }[]
}

export interface FictionalAudit {
  id: string
  url: string
  contact: string
  date: string
  status: 'a_faire' | 'envoye'
  scores: {
    perf: number
    seo: number
    access: number
    geo: number
  }
  recommandations: string[]
}

// ---------------------------------------------------------------------
// 1. CLIENTS DU PORTFOLIO (Fictifs, réalistes et professionnels)
// ---------------------------------------------------------------------
export const MOCK_CLIENTS: Client[] = [
  {
    id: 'cli-optique',
    created_at: '2026-08-15T10:00:00.000Z',
    name: 'Sophie Martinet',
    company: 'L’Atelier Optique',
    siret: '842 193 847 00018 (Fictif)',
    email: 'contact@latelier-optique-demo.fr',
    phone: '+33 1 89 20 44 11',
    website: 'https://latelier-optique-demo.fr',
    city: 'Lyon',
    country: 'France',
    status: 'actif',
    notes: 'Site vitrine sur-mesure livré. Abonnement Forfait Sérénité actif (10 €/mois).',
  },
  {
    id: 'cli-logistics',
    created_at: '2026-09-02T14:30:00.000Z',
    name: 'Thomas Da Silva',
    company: 'Apex Logistics Europe',
    siret: '918 340 129 00024 (Fictif)',
    email: 't.dasilva@apex-logistics-demo.eu',
    phone: '+33 4 72 90 10 22',
    website: 'https://apex-logistics-demo.eu',
    city: 'Lille',
    country: 'France',
    status: 'actif',
    notes: 'Développement d’un assistant WhatsApp IA pour le suivi transporteur.',
  },
  {
    id: 'cli-dentaire',
    created_at: '2026-09-18T09:15:00.000Z',
    name: 'Dr. Marc Vasseur',
    company: 'Centre Dentaire Vasseur',
    siret: '750 882 190 00031 (Fictif)',
    email: 'secretariat@dentaire-vasseur-demo.fr',
    phone: '+33 1 42 68 55 00',
    website: 'https://dentaire-vasseur-demo.fr',
    city: 'Paris 8e',
    country: 'France',
    status: 'actif',
    notes: 'Site One-Page mobile-first Google Core Web Vitals 100/100 + Forfait Sérénité.',
  },
  {
    id: 'cli-fontaine',
    created_at: '2026-09-28T16:45:00.000Z',
    name: 'Élodie Fontaine',
    company: 'Maison Fontaine Céramiques',
    siret: '802 441 559 00012 (Fictif)',
    email: 'hello@maisonfontaine-demo.com',
    phone: '+33 5 56 12 34 56',
    website: 'https://maisonfontaine-demo.com',
    city: 'Bordeaux',
    country: 'France',
    status: 'actif',
    notes: 'Boutique e-commerce avec paiement sécurisé. Forfait Sérénité 10 €/mois.',
  },
  {
    id: 'cli-architecte',
    created_at: '2026-10-05T11:20:00.000Z',
    name: 'Julien Perrot',
    company: 'Perrot & Associés Architectes',
    siret: '889 120 743 00015 (Fictif)',
    email: 'j.perrot@perrot-archi-demo.fr',
    phone: '+33 4 91 00 22 33',
    website: 'https://perrot-archi-demo.fr',
    city: 'Marseille',
    country: 'France',
    status: 'actif',
    notes: 'Site vitrine portfolio d’architecture avec galerie interactive. Forfait Sérénité actif.',
  },
  {
    id: 'cli-avocats',
    created_at: '2026-10-08T09:00:00.000Z',
    name: 'Me Valérie Moreau',
    company: 'Cabinet Nova Avocats',
    siret: '823 671 904 00042 (Fictif)',
    email: 'v.moreau@nova-avocats-demo.fr',
    phone: '+33 1 53 10 90 80',
    website: 'https://nova-avocats-demo.fr',
    city: 'Paris 16e',
    country: 'France',
    status: 'actif',
    notes: 'Plateforme vitrine juridique, prise de rendez-vous en ligne sécurisée & Forfait Sérénité.',
  },
  {
    id: 'cli-bistrot',
    created_at: '2026-10-12T14:10:00.000Z',
    name: 'Adrien Laurent',
    company: 'Bistrot Saint-Germain',
    siret: '812 390 411 00016 (Fictif)',
    email: 'contact@bistrotsaintgermain-demo.fr',
    phone: '+33 1 43 26 89 00',
    website: 'https://bistrotsaintgermain-demo.fr',
    city: 'Paris 6e',
    country: 'France',
    status: 'actif',
    notes: 'Site vitrine bistronomique, menu digital QR Code responsive & Forfait Sérénité.',
  },
  {
    id: 'cli-joaillerie',
    created_at: '2026-09-12T17:30:00.000Z',
    name: 'Camille Delmas',
    company: 'L’Écrin Joaillerie Paris',
    siret: '834 509 218 00027 (Fictif)',
    email: 'contact@ecrin-joaillerie-demo.fr',
    phone: '+33 4 93 88 12 45',
    website: 'https://ecrin-joaillerie-demo.fr',
    city: 'Nice',
    country: 'France',
    status: 'actif',
    notes: 'Catalogue pièces uniques haute joaillerie, photographies HD & Forfait Sérénité.',
  },
  {
    id: 'cli-kine',
    created_at: '2026-10-19T10:45:00.000Z',
    name: 'Lucas Meunier',
    company: 'Horizon Kiné & Performance',
    siret: '851 729 034 00019 (Fictif)',
    email: 'cabinet@horizon-kine-demo.fr',
    phone: '+33 2 40 73 55 12',
    website: 'https://horizon-kine-demo.fr',
    city: 'Nantes',
    country: 'France',
    status: 'actif',
    notes: 'Site One-Page mobile d’exercices vidéo et prise de rendez-vous.',
  },
  {
    id: 'cli-solaires',
    created_at: '2026-10-21T16:00:00.000Z',
    name: 'Sarah Benali',
    company: 'GreenPulse Solutions Solaires',
    siret: '890 145 672 00038 (Fictif)',
    email: 's.benali@greenpulse-demo.com',
    phone: '+33 4 67 20 88 99',
    website: 'https://greenpulse-demo.com',
    city: 'Montpellier',
    country: 'France',
    status: 'prospect',
    notes: 'Simulateur web en React pour estimation d’économies d’énergie et qualification de prospects.',
  },
  {
    id: 'cli-boulangerie',
    created_at: '2026-10-23T11:15:00.000Z',
    name: 'Laurent Mercier',
    company: 'Boulangerie L’Épi Doré',
    siret: '799 412 883 00011 (Fictif)',
    email: 'contact@boulangerie-lepidore-demo.fr',
    phone: '+33 3 88 32 10 90',
    website: 'https://boulangerie-lepidore-demo.fr',
    city: 'Strasbourg',
    country: 'France',
    status: 'prospect',
    notes: 'Audit de performance SEO réalisé. Devis en attente pour refonte e-shop & Click-and-Collect.',
  },
]

// ---------------------------------------------------------------------
// 2. FACTURES & DEVIS (Corrélés au centime près)
// ---------------------------------------------------------------------
export const MOCK_INVOICES: FictionalInvoice[] = [
  {
    id: 'inv-1',
    number: 'FAC-2026-027',
    clientId: 'cli-bistrot',
    clientName: 'Bistrot Saint-Germain',
    prestation: 'Création Vitrine Bistronomique & Menu Digital QR Code',
    date: '2026-10-21',
    dueDate: '2026-10-28',
    total: 590,
    status: 'payee',
  },
  {
    id: 'inv-2',
    number: 'FAC-2026-026',
    clientId: 'cli-avocats',
    clientName: 'Cabinet Nova Avocats',
    prestation: 'Plateforme Vitrine Juridique, Espace RDV & Conformité RGPD',
    date: '2026-10-19',
    dueDate: '2026-10-26',
    total: 1290,
    status: 'payee',
  },
  {
    id: 'inv-3',
    number: 'FAC-2026-025',
    clientId: 'cli-optique',
    clientName: 'L’Atelier Optique',
    prestation: 'Conception Site Vitrine Sur-Mesure & Réservation',
    date: '2026-10-18',
    dueDate: '2026-10-25',
    total: 590,
    status: 'payee',
  },
  {
    id: 'inv-4',
    number: 'FAC-2026-024',
    clientId: 'cli-logistics',
    clientName: 'Apex Logistics Europe',
    prestation: 'Déploiement Assistant WhatsApp IA (Acompte 50%)',
    date: '2026-10-14',
    dueDate: '2026-10-21',
    total: 600,
    status: 'payee',
  },
  {
    id: 'inv-5',
    number: 'FAC-2026-023',
    clientId: 'cli-dentaire',
    clientName: 'Centre Dentaire Vasseur',
    prestation: 'Création Vitrine Mobile-First & Indexation SEO',
    date: '2026-10-04',
    dueDate: '2026-10-11',
    total: 490,
    status: 'payee',
  },
  {
    id: 'inv-6',
    number: 'FAC-2026-022',
    clientId: 'cli-fontaine',
    clientName: 'Maison Fontaine Céramiques',
    prestation: 'Boutique E-commerce Clé en Main & Passerelle Stripe',
    date: '2026-10-01',
    dueDate: '2026-10-08',
    total: 890,
    status: 'payee',
  },
  {
    id: 'inv-7',
    number: 'FAC-2026-021',
    clientId: 'cli-architecte',
    clientName: 'Perrot & Associés Architectes',
    prestation: 'Site Vitrine Portfolio Architecture & Galerie 3D',
    date: '2026-09-24',
    dueDate: '2026-10-01',
    total: 790,
    status: 'payee',
  },
  {
    id: 'inv-8',
    number: 'FAC-2026-020',
    clientId: 'cli-joaillerie',
    clientName: 'L’Écrin Joaillerie Paris',
    prestation: 'Showcase Joaillerie de Luxe & Photographies HD',
    date: '2026-09-15',
    dueDate: '2026-09-22',
    total: 1150,
    status: 'payee',
  },
  {
    id: 'inv-9',
    number: 'FAC-2026-019',
    clientId: 'cli-logistics',
    clientName: 'Apex Logistics Europe',
    prestation: 'Audit Architecture Données & API Transporteurs',
    date: '2026-09-05',
    dueDate: '2026-09-12',
    total: 1560,
    status: 'payee',
  },
  {
    id: 'inv-10',
    number: 'DEV-2026-016',
    clientId: 'cli-kine',
    clientName: 'Horizon Kiné & Performance',
    prestation: 'Site One-Page Mobile Bilan Postural & Prise de RDV',
    date: '2026-10-22',
    dueDate: '2026-11-22',
    total: 490,
    status: 'envoyee',
  },
  {
    id: 'inv-11',
    number: 'DEV-2026-014',
    clientId: 'cli-logistics',
    clientName: 'Apex Logistics Europe',
    prestation: 'Solde de livraison Assistant WhatsApp IA',
    date: '2026-10-20',
    dueDate: '2026-11-20',
    total: 600,
    status: 'envoyee',
  },
  {
    id: 'inv-12',
    number: 'DEV-2026-015',
    clientId: 'cli-boulangerie',
    clientName: 'Boulangerie L’Épi Doré',
    prestation: 'Optimisation SEO Mobile & Schema.org LocalBusiness',
    date: '2026-10-24',
    dueDate: '2026-11-24',
    total: 190,
    status: 'envoyee',
  },
]

// ---------------------------------------------------------------------
// 3. ABONNEMENTS FORFAIT SÉRÉNITÉ (10 € / mois par client)
// ---------------------------------------------------------------------
export const MOCK_SUBSCRIPTIONS: FictionalSubscription[] = [
  {
    id: 'sub-1',
    clientId: 'cli-optique',
    clientName: 'L’Atelier Optique',
    siteUrl: 'https://latelier-optique-demo.fr',
    amount: 10,
    startDate: '2026-08-20',
    nextBilling: '2026-11-20',
    status: 'actif',
    lastIntervention: 'Mise à jour des horaires et tarifs verres (traité en 2h)',
  },
  {
    id: 'sub-2',
    clientId: 'cli-dentaire',
    clientName: 'Centre Dentaire Vasseur',
    siteUrl: 'https://dentaire-vasseur-demo.fr',
    amount: 10,
    startDate: '2026-09-20',
    nextBilling: '2026-11-20',
    status: 'actif',
    lastIntervention: 'Ajout nouveau chirurgien-dentiste & photo',
  },
  {
    id: 'sub-3',
    clientId: 'cli-fontaine',
    clientName: 'Maison Fontaine Céramiques',
    siteUrl: 'https://maisonfontaine-demo.com',
    amount: 10,
    startDate: '2026-10-05',
    nextBilling: '2026-11-05',
    status: 'actif',
    lastIntervention: 'Actualisation bandeau promo automne',
  },
  {
    id: 'sub-4',
    clientId: 'cli-architecte',
    clientName: 'Perrot & Associés Architectes',
    siteUrl: 'https://perrot-archi-demo.fr',
    amount: 10,
    startDate: '2026-10-10',
    nextBilling: '2026-11-10',
    status: 'actif',
    lastIntervention: 'Sauvegarde mensuelle et mise à jour sécurité',
  },
  {
    id: 'sub-5',
    clientId: 'cli-avocats',
    clientName: 'Cabinet Nova Avocats',
    siteUrl: 'https://nova-avocats-demo.fr',
    amount: 10,
    startDate: '2026-10-19',
    nextBilling: '2026-11-19',
    status: 'actif',
    lastIntervention: 'Mise en place certificat SSL et sauvegarde cloud',
  },
  {
    id: 'sub-6',
    clientId: 'cli-bistrot',
    clientName: 'Bistrot Saint-Germain',
    siteUrl: 'https://bistrotsaintgermain-demo.fr',
    amount: 10,
    startDate: '2026-10-21',
    nextBilling: '2026-11-21',
    status: 'actif',
    lastIntervention: 'Changement de la carte des vins et desserts',
  },
  {
    id: 'sub-7',
    clientId: 'cli-joaillerie',
    clientName: 'L’Écrin Joaillerie Paris',
    siteUrl: 'https://ecrin-joaillerie-demo.fr',
    amount: 10,
    startDate: '2026-09-18',
    nextBilling: '2026-11-18',
    status: 'actif',
    lastIntervention: 'Optimisation de compression d’images WebP HD',
  },
]

// ---------------------------------------------------------------------
// 4. PROJETS DU KANBAN (Mêmes budgets que les devis/factures)
// ---------------------------------------------------------------------
export const MOCK_PROJECTS: FictionalProject[] = [
  {
    id: 'p-1',
    name: 'Refonte Vitrine & Module Réservation',
    clientId: 'cli-optique',
    clientName: 'L’Atelier Optique',
    type: 'vitrine',
    status: 'livre',
    budget: 590,
    progress: 100,
    dueDate: '2026-10-18',
    tasks: [
      { title: 'Design system Tailwind & Responsive', done: true },
      { title: 'Formulaire de réservation en ligne', done: true },
      { title: 'Indexation Google Search Console', done: true },
    ],
  },
  {
    id: 'p-2',
    name: 'Assistant WhatsApp Flotte & Palettes',
    clientId: 'cli-logistics',
    clientName: 'Apex Logistics Europe',
    type: 'ia',
    status: 'dev',
    budget: 1200,
    progress: 65,
    dueDate: '2026-11-08',
    tasks: [
      { title: 'Architecture OpenAI & Prompts transport', done: true },
      { title: 'Intégration API WhatsApp Business', done: true },
      { title: 'Synchronisation PostgreSQL Supabase', done: false },
    ],
  },
  {
    id: 'p-3',
    name: 'Boutique E-commerce & Paiements Stripe',
    clientId: 'cli-fontaine',
    clientName: 'Maison Fontaine Céramiques',
    type: 'ecommerce',
    status: 'recette',
    budget: 890,
    progress: 90,
    dueDate: '2026-10-28',
    tasks: [
      { title: 'Catalogue céramiques & panier dynamique', done: true },
      { title: 'Passerelle Stripe 3D Secure', done: true },
      { title: 'Recette finale avec la cliente', done: false },
    ],
  },
  {
    id: 'p-4',
    name: 'Portail Dentaire & Score Perf 100/100',
    clientId: 'cli-dentaire',
    clientName: 'Centre Dentaire Vasseur',
    type: 'vitrine',
    status: 'livre',
    budget: 490,
    progress: 100,
    dueDate: '2026-10-04',
    tasks: [
      { title: 'Optimisation Google Core Web Vitals', done: true },
      { title: 'Données structurées Schema.org LocalBusiness', done: true },
    ],
  },
  {
    id: 'p-5',
    name: 'Refonte E-shop & Click-and-Collect',
    clientId: 'cli-boulangerie',
    clientName: 'Boulangerie L’Épi Doré',
    type: 'ecommerce',
    status: 'cadrage',
    budget: 590,
    progress: 20,
    dueDate: '2026-11-15',
    tasks: [
      { title: 'Audit préliminaire SEO', done: true },
      { title: 'Validation du devis', done: false },
    ],
  },
  {
    id: 'p-6',
    name: 'Plateforme Vitrine Juridique & Espace RDV',
    clientId: 'cli-avocats',
    clientName: 'Cabinet Nova Avocats',
    type: 'vitrine',
    status: 'livre',
    budget: 1290,
    progress: 100,
    dueDate: '2026-10-19',
    tasks: [
      { title: 'Architecture multi-pages & conformité déontologique', done: true },
      { title: 'Calendrier de réservation d’honoraires', done: true },
    ],
  },
  {
    id: 'p-7',
    name: 'Site Vitrine & Menu Digital QR Code',
    clientId: 'cli-bistrot',
    clientName: 'Bistrot Saint-Germain',
    type: 'vitrine',
    status: 'recette',
    budget: 590,
    progress: 85,
    dueDate: '2026-10-27',
    tasks: [
      { title: 'Menu responsive synchronisé temps réel', done: true },
      { title: 'Génération du QR Code vectoriel pour les tables', done: true },
    ],
  },
  {
    id: 'p-8',
    name: 'One-Page Mobile Bilan & Prise de RDV',
    clientId: 'cli-kine',
    clientName: 'Horizon Kiné & Performance',
    type: 'vitrine',
    status: 'dev',
    budget: 490,
    progress: 45,
    dueDate: '2026-11-10',
    tasks: [
      { title: 'Intégration composant vidéo conseils', done: true },
      { title: 'Lien direct agenda Doctolib', done: false },
    ],
  },
  {
    id: 'p-9',
    name: 'Simulateur Économies Solaires React',
    clientId: 'cli-solaires',
    clientName: 'GreenPulse Solutions Solaires',
    type: 'app',
    status: 'cadrage',
    budget: 1450,
    progress: 15,
    dueDate: '2026-11-30',
    tasks: [
      { title: 'Spécification de la formule d’ensoleillement', done: true },
      { title: 'Maquette interactive Figma', done: false },
    ],
  },
  {
    id: 'p-10',
    name: 'Showcase Joaillerie & Photographies HD',
    clientId: 'cli-joaillerie',
    clientName: 'L’Écrin Joaillerie Paris',
    type: 'vitrine',
    status: 'livre',
    budget: 1150,
    progress: 100,
    dueDate: '2026-09-15',
    tasks: [
      { title: 'Visionneuse d’orfèvrerie zoom 4K', done: true },
      { title: 'Balises SEO GEO et citabilité IA', done: true },
    ],
  },
]

// ---------------------------------------------------------------------
// 5. AUDITS SEO
// ---------------------------------------------------------------------
export const MOCK_AUDITS: FictionalAudit[] = [
  {
    id: 'aud-1',
    url: 'https://boulangerie-lepidore-demo.fr',
    contact: 'Laurent Mercier (Boulangerie L’Épi Doré)',
    date: '2026-10-24',
    status: 'a_faire',
    scores: { perf: 44, seo: 58, access: 65, geo: 35 },
    recommandations: [
      'Images non optimisées au format WebP/AVIF (gain estimé : -1.8s sur mobile)',
      'Balises Schema.org LocalBusiness absentes pour Google Maps & les moteurs IA',
      'Temps de réponse serveur (TTFB) supérieur à 1.2s : hébergement VPS recommandé',
    ],
  },
  {
    id: 'aud-2',
    url: 'https://latelier-optique-demo.fr',
    contact: 'Sophie Martinet (L’Atelier Optique)',
    date: '2026-10-18',
    status: 'envoye',
    scores: { perf: 98, seo: 100, access: 96, geo: 94 },
    recommandations: [
      'Score maximal Google Core Web Vitals atteint dès la mise en ligne',
      'Référencement GEO optimisé pour les requêtes géolocalisées ChatGPT & Perplexity',
    ],
  },
]

// ---------------------------------------------------------------------
// 6. LEADS ENTRANTS (Pipeline de prospection)
// ---------------------------------------------------------------------
export const MOCK_LEADS: Lead[] = [
  {
    id: 'lead-1',
    created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
    name: 'Alexandre Renard',
    email: 'a.renard@renard-immo-demo.fr',
    phone: '+33 4 78 12 34 56',
    company: 'Renard Immobilier',
    website: 'https://renard-immo-demo.fr',
    source: 'contact',
    service: 'Application web sur-mesure & E-commerce',
    budget: '1 500 € - 2 500 €',
    message: 'Bonjour, nous souhaitons moderniser notre plateforme d’annonces avec visite virtuelle et filtrage instantané.',
    status: 'nouveau',
    is_read: false,
    client_id: null,
    notes: 'Priorité haute : projet prévu pour début novembre.',
  },
  {
    id: 'lead-2',
    created_at: new Date(Date.now() - 1000 * 60 * 135).toISOString(),
    name: 'Laurent Mercier',
    email: 'contact@boulangerie-lepidore-demo.fr',
    phone: '+33 3 20 55 44 33',
    company: 'Boulangerie L’Épi Doré',
    website: 'https://boulangerie-lepidore-demo.fr',
    source: 'audit_seo',
    service: 'Audit SEO technique & Boost GEO IA',
    budget: '190 €',
    message: 'Demande d’audit technique gratuit pour améliorer notre visibilité locale sur smartphone.',
    status: 'nouveau',
    is_read: false,
    client_id: null,
    notes: 'Score mobile actuel très faible (<45). Devis 190 € en préparation.',
  },
  {
    id: 'lead-3',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    name: 'Claire Tessier',
    email: 'claire@studiobloom-demo.fr',
    phone: '+33 2 40 11 22 33',
    company: 'Studio Bloom Fleuriste',
    website: 'https://studiobloom-demo.fr',
    source: 'whatsapp',
    service: 'Site Vitrine One-Page & Sérénité',
    budget: '590 €',
    message: 'Besoin d’un site vitrine épuré pour notre atelier floral avec formule Sérénité à 10 €/mois.',
    status: 'nouveau',
    is_read: false,
    client_id: null,
    notes: 'Contactée via WhatsApp, échange très positif.',
  },
  {
    id: 'lead-4',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    name: 'Thomas Da Silva',
    email: 't.dasilva@apex-logistics-demo.eu',
    phone: '+33 4 72 90 10 22',
    company: 'Apex Logistics Europe',
    website: 'https://apex-logistics-demo.eu',
    source: 'whatsapp',
    service: 'Chatbot IA / WhatsApp Business',
    budget: '1 200 €',
    message: 'Automatisation des suivis de palettes transporteurs par WhatsApp.',
    status: 'converti',
    is_read: true,
    client_id: 'cli-logistics',
    notes: 'Converti en client. Acompte de 600 € payé (FAC-2026-024).',
  },
  {
    id: 'lead-5',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    name: 'Sophie Martinet',
    email: 'contact@latelier-optique-demo.fr',
    phone: '+33 1 89 20 44 11',
    company: 'L’Atelier Optique',
    website: 'https://latelier-optique-demo.fr',
    source: 'contact',
    service: 'Site Vitrine Sur-Mesure & Réservation',
    budget: '590 €',
    message: 'Refonte de vitrine et formule Sérénité.',
    status: 'converti',
    is_read: true,
    client_id: 'cli-optique',
    notes: 'Projet livré avec succès. Facture 590 € réglée.',
  },
]

// ---------------------------------------------------------------------
// 7. CALCULS STATISTIQUES CORRÉLÉS MATHÉMATIQUEMENT
// ---------------------------------------------------------------------
// Factures du mois d'octobre 2026 payées :
// 590€ (Bistrot) + 1290€ (Nova) + 590€ (Optique) + 600€ (Apex) + 490€ (Dentaire) + 890€ (Fontaine) = 4 450 €
const paidOctober = MOCK_INVOICES.filter(
  (inv) => inv.status === 'payee' && inv.date.startsWith('2026-10'),
).reduce((acc, inv) => acc + inv.total, 0) // 4 450 €

// Factures du mois précédent (septembre 2026) :
// 790€ (Perrot) + 1150€ (Joaillerie) + 1560€ (Logistics) = 3 500 €
const paidSeptember = 3500

// MRR = Somme des 7 abonnements Forfait Sérénité actifs à 10 €/mois
const currentMrr = MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'actif').reduce(
  (acc, s) => acc + s.amount,
  0,
) // 70 € / mois (7 abonnés actifs)

// Devis & règlements en cours d'attente :
// 490€ (Horizon Kiné) + 600€ (Apex solde) + 190€ (Boulangerie) = 1 280 €
const pendingAmount = MOCK_INVOICES.filter((inv) => inv.status === 'envoyee').reduce(
  (acc, inv) => acc + inv.total,
  0,
) // 1 280 €

export const MOCK_STATS: DashboardStats = {
  revenue_month: paidOctober,
  revenue_prev_month: paidSeptember,
  mrr: currentMrr,
  subscribers: MOCK_SUBSCRIPTIONS.filter((s) => s.status === 'actif').length,
  leads_30d: MOCK_LEADS.length,
  leads_prev_30d: 5,
  leads_unread: MOCK_LEADS.filter((l) => !l.is_read).length,
  projects_active: MOCK_PROJECTS.filter((p) => p.status === 'dev' || p.status === 'recette').length,
  clients_total: MOCK_CLIENTS.length, // 11
  conversion_rate: 72.5,
  pending_invoices: pendingAmount, // 1 280 €
  revenue_by_month: [
    { month: '2025-11', revenue: 1850 },
    { month: '2025-12', revenue: 2150 },
    { month: '2026-01', revenue: 2000 },
    { month: '2026-02', revenue: 2350 },
    { month: '2026-03', revenue: 2600 },
    { month: '2026-04', revenue: 2850 },
    { month: '2026-05', revenue: 2700 },
    { month: '2026-06', revenue: 3100 },
    { month: '2026-07', revenue: 2950 },
    { month: '2026-08', revenue: 3300 },
    { month: '2026-09', revenue: paidSeptember }, // 3 500 €
    { month: '2026-10', revenue: paidOctober },   // 4 450 €
  ],
  leads_by_source: {
    contact: 3,
    audit_seo: 2,
    whatsapp: 2,
    email: 1,
    autre: 0,
  },
  funnel: {
    leads: 8,
    qualifies: 6,
    devis: 4,
    signes: 3,
  },
}

// ---------------------------------------------------------------------
// 8. ACTIVITÉ RÉCENTE
// ---------------------------------------------------------------------
export const MOCK_ACTIVITY: Activity[] = [
  {
    id: 'act-1',
    created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    type: 'invoice',
    action: 'status',
    title: 'Facture #FAC-2026-027 réglée (590 €) : Bistrot Saint-Germain',
    entity_id: 'inv-1',
  },
  {
    id: 'act-2',
    created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
    type: 'subscription',
    action: 'created',
    title: 'Forfait Sérénité activé (+10 €/mois) : Cabinet Nova Avocats',
    entity_id: 'sub-5',
  },
  {
    id: 'act-3',
    created_at: new Date(Date.now() - 1000 * 60 * 135).toISOString(),
    type: 'audit',
    action: 'created',
    title: 'Demande audit SEO : Boulangerie L’Épi Doré',
    entity_id: 'lead-2',
  },
  {
    id: 'act-4',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    type: 'invoice',
    action: 'status',
    title: 'Facture #FAC-2026-026 réglée (1 290 €) : Cabinet Nova Avocats',
    entity_id: 'inv-2',
  },
  {
    id: 'act-5',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    type: 'invoice',
    action: 'status',
    title: 'Facture #FAC-2026-025 réglée (590 €) : L’Atelier Optique',
    entity_id: 'inv-3',
  },
  {
    id: 'act-6',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    type: 'lead',
    action: 'status',
    title: 'Lead converti en client : Thomas Da Silva (Apex Logistics Europe)',
    entity_id: 'lead-4',
  },
  {
    id: 'act-7',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    type: 'subscription',
    action: 'created',
    title: 'Forfait Sérénité reconduit : Maison Fontaine Céramiques',
    entity_id: 'sub-3',
  },
]
