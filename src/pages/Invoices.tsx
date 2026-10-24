import { useState } from 'react'
import {
  FileText,
  Plus,
  ArrowDownToLine,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/misc'
import { formatEUR, formatDate } from '../lib/format'
import { MOCK_INVOICES, type FictionalInvoice } from '../lib/mockData'

export function InvoicesPage() {
  const [tab, setTab] = useState<'all' | 'devis' | 'factures'>('all')

  const filtered = MOCK_INVOICES.filter((d) => {
    const isDevis = d.number.startsWith('DEV')
    if (tab === 'devis') return isDevis
    if (tab === 'factures') return !isDevis
    return true
  })

  const totalPaye = MOCK_INVOICES.filter((d) => d.status === 'payee').reduce(
    (acc, d) => acc + d.total,
    0,
  )
  const totalEnAttente = MOCK_INVOICES.filter((d) => d.status === 'envoyee').reduce(
    (acc, d) => acc + d.total,
    0,
  )

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Finances & Facturation"
        title="Devis & Factures"
        description="Suivi financier et justificatifs PDF (noms d’entreprises, SIRET et coordonnées fictifs à titre de démonstration)."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone="amber">Noms & SIRET fictifs</Badge>
            <Button
              variant="primary"
              size="md"
              onClick={() =>
                alert(
                  'Création de devis / facture intégrée au schéma Supabase quotes/invoices.',
                )
              }
            >
              <Plus className="h-4 w-4" />
              Nouveau document
            </Button>
          </div>
        }
      />

      {/* KPIs Facturation */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <GlassCard className="p-5">
          <p className="label-mono">Facturé & Encaissé</p>
          <p className="mt-2 font-geist text-3xl font-bold text-emerald-400">
            {formatEUR(totalPaye)}
          </p>
          <p className="mt-1 text-xs text-gray-500">Paiements validés</p>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="label-mono">Devis & Règlements en attente</p>
          <p className="mt-2 font-geist text-3xl font-bold text-indigo-300">
            {formatEUR(totalEnAttente)}
          </p>
          <p className="mt-1 text-xs text-gray-500">En cours de signature</p>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="label-mono">Garantie Confiance</p>
          <p className="mt-2 font-geist text-xl font-bold text-white">
            0 € d’acompte
          </p>
          <p className="mt-1 text-xs text-gray-400">
            Règlement à la satisfaction client avant mise en ligne.
          </p>
        </GlassCard>
      </div>

      {/* Onglets */}
      <div className="flex items-center gap-2 border-b border-white/5 pb-2">
        {(['all', 'devis', 'factures'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-xs font-medium transition ${
              tab === t
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {t === 'all' ? 'Tous les documents' : t === 'devis' ? 'Devis' : 'Factures'}
          </button>
        ))}
      </div>

      {/* Tableau des documents */}
      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5 bg-white/[0.02] font-geist-mono text-[11px] uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4">Numéro</th>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Montant TTC</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {filtered.map((doc) => (
                <tr
                  key={doc.id}
                  className="transition hover:bg-white/[0.03]"
                >
                  <td className="px-6 py-4 font-geist-mono font-semibold text-white">
                    {doc.number}
                  </td>
                  <td className="px-6 py-4 font-medium">{doc.clientName}</td>
                  <td className="px-6 py-4">
                    <span className="capitalize text-xs text-gray-400">
                      {doc.number.startsWith('DEV') ? 'Devis' : 'Facture'}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-geist-mono text-xs text-gray-400">
                    {formatDate(doc.date, 'dd/MM/yyyy')}
                  </td>
                  <td className="px-6 py-4 font-geist-mono font-bold text-white">
                    {formatEUR(doc.total)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      tone={
                        doc.status === 'payee'
                          ? 'emerald'
                          : doc.status === 'envoyee'
                          ? 'cyan'
                          : 'gray'
                      }
                      dot
                    >
                      {doc.status === 'payee'
                        ? 'Payée'
                        : doc.status === 'envoyee'
                        ? 'Envoyé'
                        : doc.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        alert(`Téléchargement PDF pour ${doc.number}`)
                      }
                    >
                      <ArrowDownToLine className="h-3.5 w-3.5 mr-1" />
                      PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
