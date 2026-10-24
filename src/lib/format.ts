import { formatDistanceToNowStrict, format } from 'date-fns'
import { fr } from 'date-fns/locale'
import type { LeadSource, LeadStatus, ClientStatus } from './types'

export { clsx as cn } from 'clsx'

const eur = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
export const formatEUR = (n: number) => eur.format(n || 0)

export const timeAgo = (d: string) => formatDistanceToNowStrict(new Date(d), { addSuffix: true, locale: fr })
export const formatDate = (d: string, pattern = 'd MMM yyyy') => format(new Date(d), pattern, { locale: fr })

export const delta = (current: number, previous: number) =>
  previous === 0 ? (current > 0 ? 100 : 0) : Math.round(((current - previous) / previous) * 100)

export const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('') || '?'

/** Dégradé d'avatar stable dérivé du nom */
const AVATAR_GRADIENTS = [
  'from-indigo-500 to-purple-500',
  'from-cyan-500 to-indigo-500',
  'from-purple-500 to-rose-500',
  'from-emerald-500 to-cyan-500',
  'from-amber-500 to-rose-500',
  'from-indigo-400 to-cyan-400',
]
export const avatarGradient = (seed: string) => {
  let h = 0
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0
  return AVATAR_GRADIENTS[h % AVATAR_GRADIENTS.length]
}

type Tone = 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan' | 'purple' | 'gray'

export const LEAD_STATUS: Record<LeadStatus, { label: string; tone: Tone }> = {
  nouveau: { label: 'Nouveau', tone: 'indigo' },
  contacte: { label: 'Contacté', tone: 'cyan' },
  qualifie: { label: 'Qualifié', tone: 'purple' },
  converti: { label: 'Converti', tone: 'emerald' },
  perdu: { label: 'Perdu', tone: 'rose' },
}

export const LEAD_SOURCE: Record<LeadSource, { label: string; tone: Tone }> = {
  contact: { label: 'Formulaire', tone: 'indigo' },
  audit_seo: { label: 'Audit SEO', tone: 'amber' },
  whatsapp: { label: 'WhatsApp', tone: 'emerald' },
  email: { label: 'Email', tone: 'cyan' },
  autre: { label: 'Autre', tone: 'gray' },
}

export const CLIENT_STATUS: Record<ClientStatus, { label: string; tone: Tone }> = {
  prospect: { label: 'Prospect', tone: 'amber' },
  actif: { label: 'Actif', tone: 'emerald' },
  inactif: { label: 'Inactif', tone: 'gray' },
}

export type { Tone }
