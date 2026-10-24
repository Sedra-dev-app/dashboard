import { useState } from 'react'
import {
  HeartHandshake,
  ShieldCheck,
  Globe,
  Clock,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Plus,
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/misc'
import { formatDate } from '../lib/format'
import { MOCK_SUBSCRIPTIONS, type FictionalSubscription } from '../lib/mockData'

export function SerenitePage() {
  const [subscribers] = useState<FictionalSubscription[]>(MOCK_SUBSCRIPTIONS)

  const mrr = subscribers
    .filter((s) => s.status === 'actif')
    .reduce((acc, s) => acc + s.amount, 0)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Abonnements & Récurent"
        title="Forfait Sérénité (10 € / mois)"
        description="Gestion des abonnements Forfait Sérénité Sedra-dev : hébergement, sauvegardes et retouches express (données clients fictives à des fins de démonstration)."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone="amber">Contrats fictifs (Démo)</Badge>
            <Button
              variant="primary"
              size="md"
              onClick={() =>
                alert('Ajout d’un abonné Forfait Sérénité à un client existant.')
              }
            >
              <Plus className="h-4 w-4" />
              Nouvel abonnement
            </Button>
          </div>
        }
      />

      {/* KPIs Sérénité */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <GlassCard className="p-5">
          <p className="label-mono">Revenu Récurrent (MRR)</p>
          <p className="mt-2 font-geist text-3xl font-bold text-emerald-400">
            {mrr} €<span className="text-xs font-normal text-gray-500">/mois</span>
          </p>
          <p className="mt-1 text-xs text-gray-500">Flux prévisible annuel : {mrr * 12} €</p>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="label-mono">Abonnés Actifs</p>
          <p className="mt-2 font-geist text-3xl font-bold text-white">
            {subscribers.length}
          </p>
          <p className="mt-1 text-xs text-emerald-400 font-medium">100% sans engagement</p>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="label-mono">Délai moyen d’intervention</p>
          <p className="mt-2 font-geist text-3xl font-bold text-indigo-300">
            &lt; 4h
          </p>
          <p className="mt-1 text-xs text-gray-500">Engagement contractuel 24h-48h</p>
        </GlassCard>

        <GlassCard className="p-5">
          <p className="label-mono">Taux de fidélité</p>
          <p className="mt-2 font-geist text-3xl font-bold text-cyan-300">
            100%
          </p>
          <p className="mt-1 text-xs text-gray-500">0 résiliation enregistrée</p>
        </GlassCard>
      </div>

      {/* Liste des abonnés */}
      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-white/5 p-4 sm:px-6">
          <h3 className="font-semibold text-white">Clients sous Forfait Sérénité</h3>
          <p className="text-xs text-gray-400">
            Chaque client dispose de son hébergement infogéré et peut envoyer ses requêtes par WhatsApp ou email.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-white/5 bg-white/[0.02] font-geist-mono text-[11px] uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-6 py-4">Client / Entreprise</th>
                <th className="px-6 py-4">Site infogéré</th>
                <th className="px-6 py-4">Forfait</th>
                <th className="px-6 py-4">Dernière retouche effectuée</th>
                <th className="px-6 py-4">Prochaine échéance</th>
                <th className="px-6 py-4">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-gray-200">
              {subscribers.map((sub) => (
                <tr key={sub.id} className="transition hover:bg-white/[0.03]">
                  <td className="px-6 py-4 font-semibold text-white">
                    {sub.clientName}
                  </td>
                  <td className="px-6 py-4">
                    <a
                      href={sub.siteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:underline"
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {sub.siteUrl.replace(/^https?:\/\//, '')}
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </a>
                  </td>
                  <td className="px-6 py-4 font-geist-mono font-bold text-emerald-400">
                    {sub.amount} € / mois
                  </td>
                  <td className="px-6 py-4 text-xs text-gray-400">
                    {sub.lastIntervention || 'Aucune retouche ce mois-ci'}
                  </td>
                  <td className="px-6 py-4 font-geist-mono text-xs text-gray-400">
                    {formatDate(sub.nextBilling, 'd MMMM yyyy')}
                  </td>
                  <td className="px-6 py-4">
                    <Badge tone="emerald" dot>
                      Actif
                    </Badge>
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
