import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Search,
  Mail,
  Phone,
  Globe,
  Trash2,
  UserCheck,
  Calendar,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Avatar, PageHeader, EmptyState } from '../components/ui/misc'
import { useConvertLead, useDeleteLead, useLeads, useUpdateLead } from '../hooks/useData'
import { formatDate, timeAgo, LEAD_SOURCE, LEAD_STATUS, type Tone } from '../lib/format'
import type { Lead, LeadStatus, LeadSource } from '../lib/types'

export function LeadsPage() {
  const [params, setParams] = useSearchParams()
  const { data: leads = [], isLoading } = useLeads()
  const updateLead = useUpdateLead()
  const deleteLead = useDeleteLead()
  const convertLead = useConvertLead()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')

  const selectedLeadId = params.get('id')
  const selectedLead = leads.find((l) => l.id === selectedLeadId) || null

  const openModal = (id: string) => {
    setParams({ id })
    // Marquer comme lu
    const target = leads.find((l) => l.id === id)
    if (target && !target.is_read) {
      updateLead.mutate({ id, is_read: true })
    }
  }

  const closeModal = () => {
    params.delete('id')
    setParams(params)
  }

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      const matchSearch =
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.email.toLowerCase().includes(search.toLowerCase()) ||
        (l.company && l.company.toLowerCase().includes(search.toLowerCase())) ||
        (l.message && l.message.toLowerCase().includes(search.toLowerCase()))

      const matchStatus = statusFilter === 'all' || l.status === statusFilter
      const matchSource = sourceFilter === 'all' || l.source === sourceFilter

      return matchSearch && matchStatus && matchSource
    })
  }, [leads, search, statusFilter, sourceFilter])

  const statuses: { key: string; label: string; tone?: Tone }[] = [
    { key: 'all', label: 'Tous' },
    { key: 'nouveau', label: 'Nouveaux', tone: 'indigo' },
    { key: 'contacte', label: 'Contactés', tone: 'cyan' },
    { key: 'qualifie', label: 'Qualifiés', tone: 'purple' },
    { key: 'converti', label: 'Convertis', tone: 'emerald' },
    { key: 'perdu', label: 'Perdus', tone: 'rose' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Acquisition & Pipeline"
        title="Gestion des Leads"
        description="Consultez et qualifiez les opportunités entrantes (coordonnées, emails, noms et messages 100% fictifs à titre de démonstration)."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone="amber">Coordonnées & Noms fictifs</Badge>
            <span className="font-geist-mono text-xs text-gray-400">
              Total : <strong className="text-white">{leads.length}</strong> (
              <span className="text-indigo-400 font-semibold">
                {leads.filter((l) => !l.is_read).length} non lus
              </span>
              )
            </span>
          </div>
        }
      />

      {/* Barre de filtres et recherche */}
      <GlassCard className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email, société, mot-clé..."
              className="input pl-10"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {statuses.map((s) => (
              <button
                key={s.key}
                onClick={() => setStatusFilter(s.key)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  statusFilter === s.key
                    ? 'border border-indigo-500/40 bg-indigo-500/20 text-white shadow-glow'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {s.label}
              </button>
            ))}

            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-xl border border-white/10 bg-ink-800 px-3 py-1.5 text-xs text-gray-300 outline-none focus:border-indigo-400"
            >
              <option value="all">Toutes sources</option>
              <option value="contact">Formulaire site</option>
              <option value="audit_seo">Audit SEO</option>
              <option value="whatsapp">WhatsApp</option>
              <option value="email">Email</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* Liste des leads */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Mail}
          title="Aucun lead trouvé"
          text="Essayez de modifier vos critères de recherche ou réinitialisez les filtres."
          action={
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch('')
                setStatusFilter('all')
                setSourceFilter('all')
              }}
            >
              Réinitialiser
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-3.5">
          {filtered.map((lead) => {
            const src = LEAD_SOURCE[lead.source] || { label: lead.source, tone: 'gray' }
            const st = LEAD_STATUS[lead.status] || { label: lead.status, tone: 'gray' }

            return (
              <GlassCard
                key={lead.id}
                onClick={() => openModal(lead.id)}
                className={`group cursor-pointer p-4 transition duration-200 hover:border-indigo-500/40 hover:bg-white/[0.04] ${
                  !lead.is_read ? 'border-indigo-500/30 bg-indigo-500/[0.02]' : ''
                }`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start gap-4 min-w-0">
                    <Avatar name={lead.name} size="md" />
                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-white group-hover:text-indigo-300">
                          {lead.name}
                        </span>
                        {!lead.is_read && (
                          <span className="rounded-full bg-indigo-500 px-2 py-0.5 text-[9px] font-bold text-white shadow-glow">
                            NOUVEAU
                          </span>
                        )}
                        <Badge tone={src.tone}>{src.label}</Badge>
                        <Badge tone={st.tone} dot>
                          {st.label}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                        {lead.company && (
                          <span className="text-gray-300 font-medium">
                            {lead.company}
                          </span>
                        )}
                        <span>{lead.email}</span>
                        {lead.phone && <span>{lead.phone}</span>}
                      </div>

                      {lead.message && (
                        <p className="line-clamp-1 text-xs text-gray-400 pt-1">
                          « {lead.message} »
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 border-t border-white/5 pt-3 lg:border-t-0 lg:pt-0 shrink-0">
                    <div className="text-right">
                      {lead.budget && (
                        <span className="block font-geist-mono text-xs font-semibold text-emerald-400">
                          {lead.budget}
                        </span>
                      )}
                      <span className="font-geist-mono text-[10px] text-gray-500">
                        {timeAgo(lead.created_at)}
                      </span>
                    </div>

                    <div
                      className="flex items-center gap-1.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {lead.status !== 'converti' && (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Convertir en client"
                          onClick={() => convertLead.mutate(lead)}
                        >
                          <UserCheck className="h-4 w-4 text-emerald-400" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Supprimer"
                        onClick={() => {
                          if (confirm('Voulez-vous supprimer ce lead ?')) {
                            deleteLead.mutate(lead.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-rose-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}

      {/* Modal Détail du Lead */}
      {selectedLead && (
        <Modal
          open={Boolean(selectedLead)}
          onClose={closeModal}
          title={selectedLead.name}
          subtitle={selectedLead.company || selectedLead.email}
          side
        >
          <div className="space-y-6">
            {/* Statut & Actions rapides */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <div>
                <span className="label-mono mb-1.5 block">Statut du lead</span>
                <select
                  value={selectedLead.status}
                  onChange={(e) =>
                    updateLead.mutate({
                      id: selectedLead.id,
                      status: e.target.value as LeadStatus,
                    })
                  }
                  className="rounded-xl border border-white/15 bg-ink-800 px-3 py-1.5 text-xs font-medium text-white outline-none focus:border-indigo-400"
                >
                  <option value="nouveau">Nouveau</option>
                  <option value="contacte">Contacté</option>
                  <option value="qualifie">Qualifié</option>
                  <option value="converti">Converti en client</option>
                  <option value="perdu">Perdu</option>
                </select>
              </div>

              {selectedLead.status !== 'converti' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => convertLead.mutate(selectedLead)}
                >
                  <UserCheck className="h-4 w-4 mr-1.5" />
                  Convertir en client
                </Button>
              ) : (
                <Badge tone="emerald" dot>
                  Client actif lié
                </Badge>
              )}
            </div>

            {/* Coordonnées */}
            <div className="space-y-3">
              <span className="label-mono">Informations de contact</span>
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                <a
                  href={`mailto:${selectedLead.email}`}
                  className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs text-gray-200 transition hover:bg-white/[0.06]"
                >
                  <Mail className="h-4 w-4 text-indigo-400 shrink-0" />
                  <span className="truncate">{selectedLead.email}</span>
                </a>

                {selectedLead.phone ? (
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs text-gray-200 transition hover:bg-white/[0.06]"
                  >
                    <Phone className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>{selectedLead.phone}</span>
                  </a>
                ) : (
                  <div className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.01] p-3 text-xs text-gray-500">
                    <Phone className="h-4 w-4 shrink-0" />
                    <span>Non renseigné</span>
                  </div>
                )}

                {selectedLead.website && (
                  <a
                    href={selectedLead.website}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 rounded-xl border border-white/5 bg-white/[0.03] p-3 text-xs text-cyan-300 transition hover:bg-white/[0.06] sm:col-span-2"
                  >
                    <Globe className="h-4 w-4 text-cyan-400 shrink-0" />
                    <span className="truncate">{selectedLead.website}</span>
                    <ExternalLink className="h-3 w-3 ml-auto opacity-70" />
                  </a>
                )}
              </div>
            </div>

            {/* Service & Budget */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
                <span className="label-mono mb-1 block">Prestation visée</span>
                <p className="text-sm font-medium text-white">
                  {selectedLead.service || 'Non spécifié'}
                </p>
              </div>
              <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-3.5">
                <span className="label-mono mb-1 block">Budget envisagé</span>
                <p className="text-sm font-semibold text-emerald-400">
                  {selectedLead.budget || 'À définir'}
                </p>
              </div>
            </div>

            {/* Message complet */}
            <div className="space-y-2">
              <span className="label-mono flex items-center gap-1.5">
                <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                Message reçu
              </span>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-gray-200 whitespace-pre-line">
                {selectedLead.message || 'Aucun message rédigé.'}
              </div>
            </div>

            {/* Notes internes sauvegardables */}
            <div className="space-y-2">
              <span className="label-mono flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                Notes internes / Suivi
              </span>
              <textarea
                rows={3}
                defaultValue={selectedLead.notes || ''}
                placeholder="Ajoutez vos notes de cadrage, prochaine relance..."
                onBlur={(e) =>
                  updateLead.mutate({
                    id: selectedLead.id,
                    notes: e.target.value,
                  })
                }
                className="input"
              />
              <p className="font-geist-mono text-[10px] text-gray-500">
                Enregistrement automatique lorsque vous quittez le champ.
              </p>
            </div>

            {/* Footer informations */}
            <div className="flex items-center justify-between border-t border-white/5 pt-4 text-xs text-gray-500">
              <span className="flex items-center gap-1 font-geist-mono">
                <Calendar className="h-3.5 w-3.5" /> Reçu le{' '}
                {formatDate(selectedLead.created_at, 'dd/MM/yyyy à HH:mm')}
              </span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  if (confirm('Supprimer ce lead ?')) {
                    deleteLead.mutate(selectedLead.id)
                    closeModal()
                  }
                }}
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Supprimer
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
