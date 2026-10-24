export type LeadStatus = 'nouveau' | 'contacte' | 'qualifie' | 'converti' | 'perdu'
export type LeadSource = 'contact' | 'audit_seo' | 'whatsapp' | 'email' | 'autre'
export type ClientStatus = 'prospect' | 'actif' | 'inactif'

export interface Lead {
  id: string
  created_at: string
  name: string
  email: string
  phone: string | null
  company: string | null
  website: string | null
  source: LeadSource
  service: string | null
  budget: string | null
  message: string | null
  status: LeadStatus
  is_read: boolean
  client_id: string | null
  notes: string | null
}

export interface Client {
  id: string
  created_at: string
  name: string
  company: string | null
  email: string | null
  phone: string | null
  website: string | null
  city: string | null
  country: string | null
  status: ClientStatus
  notes: string | null
  siret?: string | null
}

export interface Activity {
  id: string
  created_at: string
  type: string
  action: string
  title: string
  entity_id: string | null
}

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  role: 'admin' | 'user'
}

export interface DashboardStats {
  revenue_month: number
  revenue_prev_month: number
  mrr: number
  subscribers: number
  leads_30d: number
  leads_prev_30d: number
  leads_unread: number
  projects_active: number
  clients_total: number
  conversion_rate: number
  pending_invoices: number
  revenue_by_month: { month: string; revenue: number }[]
  leads_by_source: Partial<Record<LeadSource, number>>
  funnel: { leads: number; qualifies: number; devis: number; signes: number }
}
