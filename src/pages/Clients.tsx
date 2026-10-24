import { useState, useMemo } from 'react'
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Globe,
  MapPin,
  Pencil,
  Trash2,
  ExternalLink,
  ShieldCheck,
  Building2,
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { Avatar, PageHeader, EmptyState, Field } from '../components/ui/misc'
import { useClients, useDeleteClient, useSaveClient } from '../hooks/useData'
import { CLIENT_STATUS, formatDate } from '../lib/format'
import type { Client, ClientStatus } from '../lib/types'

export function ClientsPage() {
  const { data: clients = [] } = useClients()
  const saveClient = useSaveClient()
  const deleteClient = useDeleteClient()

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Modal d'ajout / modification
  const [modalOpen, setModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null)

  const openCreate = () => {
    setEditingClient({
      name: '',
      company: '',
      email: '',
      phone: '',
      website: '',
      city: '',
      country: 'France',
      status: 'actif',
      notes: '',
    })
    setModalOpen(true)
  }

  const openEdit = (client: Client) => {
    setEditingClient(client)
    setModalOpen(true)
  }

  const filtered = useMemo(() => {
    return clients.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        (c.company && c.company.toLowerCase().includes(search.toLowerCase())) ||
        (c.email && c.email.toLowerCase().includes(search.toLowerCase())) ||
        (c.city && c.city.toLowerCase().includes(search.toLowerCase()))

      const matchStatus = statusFilter === 'all' || c.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [clients, search, statusFilter])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingClient || !editingClient.name) return
    saveClient.mutate(editingClient)
    setModalOpen(false)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Portefeuille & Comptes"
        title="Gestion des Clients"
        description="Fiches clients, coordonnées et contrats (noms d’entreprises, interlocuteurs et coordonnées 100% fictifs pour le portfolio)."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone="amber">Identités & Contacts fictifs</Badge>
            <Button variant="primary" size="md" onClick={openCreate}>
              <Plus className="h-4 w-4" />
              Nouveau client
            </Button>
          </div>
        }
      />

      {/* Barre de filtres et recherche */}
      <GlassCard className="p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, entreprise, ville..."
              className="input pl-10"
            />
          </div>

          <div className="flex items-center gap-2">
            {['all', 'actif', 'prospect', 'inactif'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-medium transition ${
                  statusFilter === st
                    ? 'border border-indigo-500/40 bg-indigo-500/20 text-white shadow-glow'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                {st === 'all'
                  ? 'Tous'
                  : st === 'actif'
                  ? 'Actifs'
                  : st === 'prospect'
                  ? 'Prospects'
                  : 'Inactifs'}
              </button>
            ))}
          </div>
        </div>
      </GlassCard>

      {/* Grille des cartes clients */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Aucun client trouvé"
          text="Ajoutez un premier client ou réinitialisez vos filtres."
          action={
            <Button variant="primary" size="sm" onClick={openCreate}>
              <Plus className="h-4 w-4 mr-1.5" />
              Ajouter un client
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((client) => {
            const st = CLIENT_STATUS[client.status] || {
              label: client.status,
              tone: 'gray',
            }
            const displayName = client.company || client.name

            return (
              <GlassCard
                key={client.id}
                className="group flex flex-col justify-between p-6 transition duration-200 hover:border-indigo-500/30"
              >
                <div className="space-y-4">
                  {/* Top card */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={displayName} size="md" />
                      <div className="min-w-0">
                        <h3 className="truncate font-semibold text-white group-hover:text-indigo-300">
                          {displayName}
                        </h3>
                        {client.company && (
                          <p className="truncate text-xs text-gray-400">
                            {client.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <Badge tone={st.tone} dot>
                      {st.label}
                    </Badge>
                  </div>

                  {/* Coordonnées */}
                  <div className="space-y-2 text-xs text-gray-300">
                    {client.email && (
                      <a
                        href={`mailto:${client.email}`}
                        className="flex items-center gap-2 hover:text-indigo-300"
                      >
                        <Mail className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </a>
                    )}
                    {client.phone && (
                      <a
                        href={`tel:${client.phone}`}
                        className="flex items-center gap-2 hover:text-emerald-300"
                      >
                        <Phone className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                        <span>{client.phone}</span>
                      </a>
                    )}
                    {(client.city || client.country) && (
                      <div className="flex items-center gap-2 text-gray-400">
                        <MapPin className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                        <span>
                          {[client.city, client.country].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                    {client.website && (
                      <a
                        href={client.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 text-cyan-300 hover:underline"
                      >
                        <Globe className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                        <span className="truncate">{client.website.replace(/^https?:\/\//, '')}</span>
                        <ExternalLink className="h-3 w-3 opacity-60" />
                      </a>
                    )}
                    {client.siret && (
                      <div className="flex items-center gap-2 font-geist-mono text-[11px] text-gray-400">
                        <Building2 className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                        <span className="truncate">SIRET : {client.siret}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes brèves */}
                  {client.notes && (
                    <p className="rounded-xl border border-white/5 bg-white/[0.02] p-2.5 text-xs text-gray-400 line-clamp-2">
                      {client.notes}
                    </p>
                  )}
                </div>

                {/* Footer card */}
                <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4 text-xs">
                  <span className="font-geist-mono text-[10px] text-gray-500">
                    Client depuis {formatDate(client.created_at, 'MMM yyyy')}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => openEdit(client)}
                      title="Modifier"
                    >
                      <Pencil className="h-4 w-4 text-gray-400 hover:text-white" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (confirm(`Supprimer le client ${displayName} ?`)) {
                          deleteClient.mutate(client.id)
                        }
                      }}
                      title="Supprimer"
                    >
                      <Trash2 className="h-4 w-4 text-rose-400" />
                    </Button>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}

      {/* Modal Ajout / Modification Client */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingClient?.id ? 'Modifier le client' : 'Ajouter un nouveau client'}
        subtitle="Renseignez les coordonnées et informations contractuelles."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Nom complet / Contact *">
              <input
                required
                type="text"
                value={editingClient?.name || ''}
                onChange={(e) =>
                  setEditingClient((c) => ({ ...c, name: e.target.value }))
                }
                placeholder="Ex: Sophie Martinet"
                className="input"
              />
            </Field>

            <Field label="Société / Marque">
              <input
                type="text"
                value={editingClient?.company || ''}
                onChange={(e) =>
                  setEditingClient((c) => ({ ...c, company: e.target.value }))
                }
                placeholder="Ex: L'Atelier Optique"
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Email professionnel">
              <input
                type="email"
                value={editingClient?.email || ''}
                onChange={(e) =>
                  setEditingClient((c) => ({ ...c, email: e.target.value }))
                }
                placeholder="contact@entreprise.com"
                className="input"
              />
            </Field>

            <Field label="Téléphone">
              <input
                type="tel"
                value={editingClient?.phone || ''}
                onChange={(e) =>
                  setEditingClient((c) => ({ ...c, phone: e.target.value }))
                }
                placeholder="+33 6 ..."
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Site Web">
              <input
                type="url"
                value={editingClient?.website || ''}
                onChange={(e) =>
                  setEditingClient((c) => ({ ...c, website: e.target.value }))
                }
                placeholder="https://..."
                className="input"
              />
            </Field>

            <Field label="Numéro SIRET (Fictif)">
              <input
                type="text"
                value={editingClient?.siret || ''}
                onChange={(e) =>
                  setEditingClient((c) => ({ ...c, siret: e.target.value }))
                }
                placeholder="Ex: 842 193 847 00018 (Fictif)"
                className="input"
              />
            </Field>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Statut">
              <select
                value={editingClient?.status || 'actif'}
                onChange={(e) =>
                  setEditingClient((c) => ({
                    ...c,
                    status: e.target.value as ClientStatus,
                  }))
                }
                className="input bg-ink-800"
              >
                <option value="actif">Actif</option>
                <option value="prospect">Prospect</option>
                <option value="inactif">Inactif</option>
              </select>
            </Field>

            <Field label="Ville">
              <input
                type="text"
                value={editingClient?.city || ''}
                onChange={(e) =>
                  setEditingClient((c) => ({ ...c, city: e.target.value }))
                }
                placeholder="Ex: Genève"
                className="input"
              />
            </Field>

            <Field label="Pays">
              <input
                type="text"
                value={editingClient?.country || 'France'}
                onChange={(e) =>
                  setEditingClient((c) => ({ ...c, country: e.target.value }))
                }
                placeholder="France, Suisse, etc."
                className="input"
              />
            </Field>
          </div>

          <Field label="Notes & Détails contractuels">
            <textarea
              rows={3}
              value={editingClient?.notes || ''}
              onChange={(e) =>
                setEditingClient((c) => ({ ...c, notes: e.target.value }))
              }
              placeholder="Abonnement Forfait Sérénité, type de projet, historique..."
              className="input"
            />
          </Field>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setModalOpen(false)}
            >
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              {editingClient?.id ? 'Enregistrer les modifications' : 'Créer le client'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
