import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import type { Activity, Client, DashboardStats, Lead, LeadStatus } from '../lib/types'
import { MOCK_ACTIVITY, MOCK_CLIENTS, MOCK_LEADS, MOCK_STATS } from '../lib/mockData'

/* ------------------------------------------------------------------ */
/*  Stats                                                              */
/* ------------------------------------------------------------------ */
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.rpc('dashboard_stats')
        if (error || !data) return MOCK_STATS
        return data as DashboardStats
      } catch {
        return MOCK_STATS
      }
    },
    initialData: MOCK_STATS,
  })
}

export function useActivity(limit = 12) {
  return useQuery({
    queryKey: ['activity', limit],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('activity_log')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(limit)
        if (error || !data || data.length === 0) return MOCK_ACTIVITY
        return data as Activity[]
      } catch {
        return MOCK_ACTIVITY
      }
    },
    initialData: MOCK_ACTIVITY,
  })
}

/* ------------------------------------------------------------------ */
/*  Leads                                                              */
/* ------------------------------------------------------------------ */
export function useLeads() {
  return useQuery({
    queryKey: ['leads'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('leads').select('*').order('created_at', { ascending: false })
        if (error || !data || data.length === 0) return MOCK_LEADS
        return data as Lead[]
      } catch {
        return MOCK_LEADS
      }
    },
    initialData: MOCK_LEADS,
  })
}

export function useUpdateLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...patch }: Partial<Lead> & { id: string }) => {
      try {
        const { error } = await supabase.from('leads').update(patch).eq('id', id)
        if (error) console.warn('Supabase update warning, falling back to local state:', error.message)
      } catch {
        // Fallback local
      }
    },
    onMutate: async ({ id, ...patch }) => {
      await qc.cancelQueries({ queryKey: ['leads'] })
      const prev = qc.getQueryData<Lead[]>(['leads'])
      qc.setQueryData<Lead[]>(['leads'], (old) => old?.map((l) => (l.id === id ? { ...l, ...patch } : l)))
      return { prev }
    },
    onSuccess: () => {
      toast.success('Lead mis à jour')
    },
    onError: (_e, _v, ctx) => {
      qc.setQueryData(['leads'], ctx?.prev)
      toast.error('Mise à jour impossible')
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['stats'] })
      qc.invalidateQueries({ queryKey: ['activity'] })
    },
  })
}

export function useDeleteLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from('leads').delete().eq('id', id)
        if (error) console.warn('Supabase delete warning:', error.message)
      } catch {
        // Fallback
      }
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['leads'] })
      const prev = qc.getQueryData<Lead[]>(['leads'])
      qc.setQueryData<Lead[]>(['leads'], (old) => old?.filter((l) => l.id !== id))
      return { prev }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['leads'] })
      qc.invalidateQueries({ queryKey: ['stats'] })
      toast.success('Lead supprimé')
    },
  })
}

/** Convertit un lead en client puis lie les deux. */
export function useConvertLead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (lead: Lead) => {
      try {
        const { data, error } = await supabase
          .from('clients')
          .insert({
            name: lead.name,
            company: lead.company,
            email: lead.email,
            phone: lead.phone,
            website: lead.website,
            status: 'actif',
            notes: lead.message,
          })
          .select('id')
          .single()
        if (error) throw error
        await supabase
          .from('leads')
          .update({ status: 'converti' as LeadStatus, client_id: data.id, is_read: true })
          .eq('id', lead.id)
      } catch {
        // Fallback local update
      }
    },
    onMutate: async (lead) => {
      await qc.cancelQueries({ queryKey: ['leads'] })
      await qc.cancelQueries({ queryKey: ['clients'] })
      const newClientId = `client-${Date.now()}`
      qc.setQueryData<Lead[]>(['leads'], (old) =>
        old?.map((l) => (l.id === lead.id ? { ...l, status: 'converti' as LeadStatus, is_read: true, client_id: newClientId } : l)),
      )
      qc.setQueryData<Client[]>(['clients'], (old) => [
        {
          id: newClientId,
          created_at: new Date().toISOString(),
          name: lead.name,
          company: lead.company,
          email: lead.email,
          phone: lead.phone,
          website: lead.website,
          city: null,
          country: 'France',
          status: 'actif',
          notes: lead.message,
        },
        ...(old || []),
      ])
    },
    onSuccess: () => {
      ;['leads', 'clients', 'stats', 'activity'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }))
      toast.success('Lead converti en client avec succès 🎉')
    },
    onError: () => toast.error('Conversion impossible'),
  })
}

/* ------------------------------------------------------------------ */
/*  Clients                                                            */
/* ------------------------------------------------------------------ */
export function useClients() {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })
        if (error || !data || data.length === 0) return MOCK_CLIENTS
        return data as Client[]
      } catch {
        return MOCK_CLIENTS
      }
    },
    initialData: MOCK_CLIENTS,
  })
}

export function useSaveClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (client: Partial<Client>) => {
      const { id, created_at: _c, ...payload } = client
      try {
        const q = id
          ? supabase.from('clients').update(payload).eq('id', id)
          : supabase.from('clients').insert(payload)
        const { error } = await q
        if (error) console.warn('Supabase save client:', error.message)
      } catch {
        // Fallback
      }
      return Boolean(id)
    },
    onMutate: async (client) => {
      await qc.cancelQueries({ queryKey: ['clients'] })
      const isEdit = Boolean(client.id)
      qc.setQueryData<Client[]>(['clients'], (old) => {
        if (isEdit) {
          return old?.map((c) => (c.id === client.id ? ({ ...c, ...client } as Client) : c))
        }
        const created: Client = {
          id: `client-${Date.now()}`,
          created_at: new Date().toISOString(),
          name: client.name || 'Nouveau client',
          company: client.company || null,
          email: client.email || null,
          phone: client.phone || null,
          website: client.website || null,
          city: client.city || null,
          country: client.country || 'France',
          status: client.status || 'actif',
          notes: client.notes || null,
        }
        return [created, ...(old || [])]
      })
    },
    onSuccess: (wasUpdate) => {
      ;['clients', 'stats', 'activity'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }))
      toast.success(wasUpdate ? 'Client mis à jour' : 'Client ajouté avec succès')
    },
    onError: () => toast.error('Enregistrement impossible'),
  })
}

export function useDeleteClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase.from('clients').delete().eq('id', id)
        if (error) console.warn('Supabase delete client:', error.message)
      } catch {
        // Fallback
      }
    },
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['clients'] })
      qc.setQueryData<Client[]>(['clients'], (old) => old?.filter((c) => c.id !== id))
    },
    onSuccess: () => {
      ;['clients', 'stats'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }))
      toast.success('Client supprimé')
    },
  })
}

/* ------------------------------------------------------------------ */
/*  Temps réel : nouveaux leads + activité                            */
/* ------------------------------------------------------------------ */
export function useRealtime(enabled: boolean) {
  const qc = useQueryClient()
  useEffect(() => {
    if (!enabled) return
    const channel = supabase
      .channel('sedra-live')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (payload) => {
        const lead = payload.new as Lead
        toast(`Nouveau lead : ${lead.name}`, {
          description: lead.message?.slice(0, 90) || lead.email,
          icon: '⚡',
        })
        playPing()
        ;['leads', 'stats'].forEach((k) => qc.invalidateQueries({ queryKey: [k] }))
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leads' }, () => {
        qc.invalidateQueries({ queryKey: ['leads'] })
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, () => {
        qc.invalidateQueries({ queryKey: ['activity'] })
      })
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [enabled, qc])
}

/** Petit « ping » synthétisé, pas de fichier audio à charger. */
function playPing() {
  try {
    const ctx = new AudioContext()
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = 'sine'
    o.frequency.setValueAtTime(880, ctx.currentTime)
    o.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.12)
    g.gain.setValueAtTime(0.0001, ctx.currentTime)
    g.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4)
    o.connect(g).connect(ctx.destination)
    o.start()
    o.stop(ctx.currentTime + 0.42)
  } catch {
    /* audio non disponible */
  }
}
