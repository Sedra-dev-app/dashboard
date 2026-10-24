import { LayoutDashboard, Inbox, Users, FolderKanban, FileText, HeartHandshake, Gauge, Settings, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  phase?: 2 | 3
  badgeKey?: 'leads_unread'
}

export const NAV: NavItem[] = [
  { to: '/', label: "Vue d'ensemble", icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: Inbox, badgeKey: 'leads_unread' },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/projets', label: 'Projets', icon: FolderKanban, phase: 2 },
  { to: '/facturation', label: 'Devis & Factures', icon: FileText, phase: 2 },
  { to: '/serenite', label: 'Sérénité', icon: HeartHandshake, phase: 3 },
  { to: '/audits', label: 'Audits SEO', icon: Gauge, phase: 3 },
  { to: '/parametres', label: 'Paramètres', icon: Settings, phase: 3 },
]
