import { Link } from 'react-router-dom'
import {
  TrendingUp,
  Inbox,
  ShieldCheck,
  FolderKanban,
  ArrowUpRight,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Zap,
} from 'lucide-react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { GlassCard } from '../components/ui/GlassCard'
import { Badge, LiveDot } from '../components/ui/Badge'
import { AnimatedNumber } from '../components/ui/AnimatedNumber'
import { Button } from '../components/ui/Button'
import { Avatar } from '../components/ui/misc'
import { useActivity, useLeads, useStats } from '../hooks/useData'
import { formatEUR, timeAgo, LEAD_SOURCE, LEAD_STATUS } from '../lib/format'

export function OverviewPage() {
  const { data: stats } = useStats()
  const { data: activity = [] } = useActivity(6)
  const { data: leads = [] } = useLeads()

  const recentLeads = leads.slice(0, 4)

  const chartData = (stats?.revenue_by_month || []).map((item) => ({
    name: item.month.slice(5), // '10' for October
    revenue: item.revenue,
    fullMonth: item.month,
  }))

  const revDiff =
    stats && stats.revenue_prev_month > 0
      ? Math.round(
          ((stats.revenue_month - stats.revenue_prev_month) /
            stats.revenue_prev_month) *
            100,
        )
      : 24

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-950/40 via-purple-950/20 to-black p-6 sm:p-8 backdrop-blur-2xl">
        <div className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-300">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                Sedra-dev Command Center
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-300">
                <LiveDot /> Temps réel actif
              </span>
              <span className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300">
                Identités, SIRET & Contacts fictifs (Démo)
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
              Bienvenue sur votre cockpit,{' '}
              <span className="text-gradient">Sedra Studio</span>
            </h1>
            <p className="max-w-2xl text-sm text-gray-400">
              Pilotage centralisé de vos projets web sur-mesure, boutiques
              e-commerce, briques IA et suivi du Forfait Sérénité.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link to="/leads">
              <Button variant="outline" size="md">
                <Inbox className="h-4 w-4 text-cyan-300" />
                Voir les leads ({stats?.leads_unread || 0} non lus)
              </Button>
            </Link>
            <a
              href="https://sedra-dev.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="primary" size="md">
                <ExternalLink className="h-4 w-4" />
                Site en direct
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* 4 KPIs Clés */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1 : CA Mensuel */}
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <p className="label-mono">Chiffre d’affaires (Mois)</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-geist text-3xl font-bold text-white sm:text-4xl">
              <AnimatedNumber
                value={stats?.revenue_month || 0}
                format={formatEUR}
              />
            </span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            <span className="flex items-center text-emerald-400 font-medium">
              <ArrowUpRight className="h-3.5 w-3.5 mr-0.5" /> +{revDiff}%
            </span>
            <span className="text-gray-500">vs mois précédent</span>
          </div>
        </GlassCard>

        {/* KPI 2 : Forfait Sérénité (MRR) */}
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <p className="label-mono">Forfait Sérénité (MRR)</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-geist text-3xl font-bold text-emerald-400 sm:text-4xl">
              <AnimatedNumber
                value={stats?.mrr || 0}
                format={(n) => `${Math.round(n)} €/mois`}
              />
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-gray-400">
              <span className="text-white font-semibold">
                {stats?.subscribers || 0}
              </span>{' '}
              abonnés à 10 €/m
            </span>
            <Badge tone="emerald" dot>
              Récurrent
            </Badge>
          </div>
        </GlassCard>

        {/* KPI 3 : Demandes entrantes (30j) */}
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <p className="label-mono">Leads entrants (30j)</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <Inbox className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-geist text-3xl font-bold text-white sm:text-4xl">
              <AnimatedNumber value={stats?.leads_30d || 0} />
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-cyan-300 font-medium">
              {stats?.leads_unread || 0} nouveau(x) à traiter
            </span>
            <span className="text-gray-500">Taux conv. {stats?.conversion_rate || 0}%</span>
          </div>
        </GlassCard>

        {/* KPI 4 : Projets actifs */}
        <GlassCard className="p-6">
          <div className="flex items-start justify-between">
            <p className="label-mono">Projets en production</p>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
              <FolderKanban className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-geist text-3xl font-bold text-white sm:text-4xl">
              <AnimatedNumber value={stats?.projects_active || 0} />
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-gray-400">
              {stats?.clients_total || 0} clients au total
            </span>
            <Badge tone="purple">Actifs</Badge>
          </div>
        </GlassCard>
      </div>

      {/* Graphique CA + Funnel */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Graphique principal (8 colonnes) */}
        <GlassCard className="p-6 lg:col-span-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="label-mono text-indigo-300">Performance financière</p>
              <h2 className="text-lg font-bold text-white sm:text-xl">
                Évolution du chiffre d’affaires
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" /> Factures payées
              </span>
              <span className="font-geist-mono text-xs text-gray-500">
                Derniers 12 mois
              </span>
            </div>
          </div>

          <div className="mt-6 h-[290px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="name"
                  stroke="#52525b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                />
                <YAxis
                  stroke="#52525b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: '#27272a' }}
                  tickFormatter={(val) => `${val}€`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload
                      return (
                        <div className="rounded-xl border border-white/10 bg-black/90 p-3 shadow-xl backdrop-blur-xl">
                          <p className="font-geist-mono text-[10px] uppercase tracking-wider text-gray-400">
                            {data.fullMonth}
                          </p>
                          <p className="mt-1 font-geist text-base font-bold text-indigo-300">
                            {formatEUR(data.revenue)}
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#818cf8"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRev)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        {/* Funnel & Répartition des sources (4 colonnes) */}
        <GlassCard className="flex flex-col justify-between p-6 lg:col-span-4">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <p className="label-mono text-purple-300">Conversion</p>
                <h2 className="text-lg font-bold text-white">Pipeline de vente</h2>
              </div>
              <Badge tone="purple">{stats?.conversion_rate || 0}%</Badge>
            </div>

            <div className="mt-6 space-y-4">
              {/* Funnel items */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Leads captés</span>
                  <span className="font-geist-mono text-white font-medium">
                    {stats?.funnel?.leads || 0}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-indigo-500 w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Leads qualifiés</span>
                  <span className="font-geist-mono text-white font-medium">
                    {stats?.funnel?.qualifies || 0}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{
                      width: `${
                        ((stats?.funnel?.qualifies || 1) /
                          (stats?.funnel?.leads || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Devis émis</span>
                  <span className="font-geist-mono text-white font-medium">
                    {stats?.funnel?.devis || 0}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{
                      width: `${
                        ((stats?.funnel?.devis || 1) /
                          (stats?.funnel?.leads || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-300">Contrats signés</span>
                  <span className="font-geist-mono text-emerald-400 font-bold">
                    {stats?.funnel?.signes || 0}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-emerald-400"
                    style={{
                      width: `${
                        ((stats?.funnel?.signes || 1) /
                          (stats?.funnel?.leads || 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 border-t border-white/5 pt-4">
            <p className="label-mono mb-3 text-[10px]">Sources principales</p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-xs text-gray-300">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                Formulaire : {stats?.leads_by_source?.contact || 0}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-xs text-gray-300">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Audit SEO : {stats?.leads_by_source?.audit_seo || 0}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-xs text-gray-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                WhatsApp : {stats?.leads_by_source?.whatsapp || 0}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* Récents Leads & Activité Live */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Récents Leads (7 colonnes) */}
        <GlassCard className="p-6 lg:col-span-7">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <p className="label-mono text-cyan-300">Nouveaux contacts</p>
              <h2 className="text-lg font-bold text-white">Derniers leads reçus</h2>
            </div>
            <Link
              to="/leads"
              className="group flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300"
            >
              Voir tout ({leads.length})
              <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="mt-4 divide-y divide-white/5">
            {recentLeads.map((lead) => {
              const src = LEAD_SOURCE[lead.source] || { label: lead.source, tone: 'gray' }
              const st = LEAD_STATUS[lead.status] || { label: lead.status, tone: 'gray' }
              return (
                <Link
                  key={lead.id}
                  to={`/leads?id=${lead.id}`}
                  className="group flex items-center justify-between gap-4 py-3.5 transition hover:bg-white/[0.02] rounded-xl px-2"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar name={lead.name} size="md" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-semibold text-white group-hover:text-indigo-300">
                          {lead.name}
                        </p>
                        {!lead.is_read && (
                          <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-glow" />
                        )}
                      </div>
                      <p className="truncate text-xs text-gray-400">
                        {lead.company || lead.service || lead.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="hidden sm:flex flex-col items-end text-right">
                      <Badge tone={st.tone} dot>
                        {st.label}
                      </Badge>
                      <span className="mt-1 font-geist-mono text-[10px] text-gray-500">
                        {timeAgo(lead.created_at)}
                      </span>
                    </div>
                    <Badge tone={src.tone} className="hidden md:inline-flex">
                      {src.label}
                    </Badge>
                  </div>
                </Link>
              )
            })}
          </div>
        </GlassCard>

        {/* Fil d'activité live (5 colonnes) */}
        <GlassCard className="p-6 lg:col-span-5">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div className="flex items-center gap-2">
              <LiveDot />
              <h2 className="text-lg font-bold text-white">Activité en direct</h2>
            </div>
            <span className="font-geist-mono text-xs text-gray-500">Auto-sync</span>
          </div>

          <div className="mt-4 space-y-3.5">
            {activity.map((act) => (
              <div
                key={act.id}
                className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 text-xs transition hover:border-white/10"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                  <Zap className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-gray-200">{act.title}</p>
                  <p className="mt-1 flex items-center gap-1 font-geist-mono text-[10px] text-gray-500">
                    <Clock className="h-3 w-3" />
                    {timeAgo(act.created_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
