import { useState } from 'react'
import {
  Gauge,
  Sparkles,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Plus,
  Send,
  Zap,
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { PageHeader } from '../components/ui/misc'
import { formatDate } from '../lib/format'
import { MOCK_AUDITS, type FictionalAudit } from '../lib/mockData'

export function SeoAuditsPage() {
  const [audits] = useState<FictionalAudit[]>(MOCK_AUDITS)

  const scoreColor = (val: number) => {
    if (val >= 90) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
    if (val >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10'
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10'
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="SEO Google & GEO IA"
        title="Audits Techniques & Visibilité IA"
        description="Contrôle des performances web (Core Web Vitals >95/100) et de la citabilité dans les moteurs IA génératifs (ChatGPT, Claude, Perplexity)."
        actions={
          <div className="flex items-center gap-3">
            <Badge tone="amber">Sites & Clients démo</Badge>
            <Button
              variant="primary"
              size="md"
              onClick={() => alert('Nouvel audit initié.')}
            >
              <Plus className="h-4 w-4" />
              Lancer un audit
            </Button>
          </div>
        }
      />

      {/* Checklist Qualité Sedra-dev */}
      <GlassCard className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <span className="label-mono text-cyan-300">Norme d’excellence</span>
            <h3 className="text-lg font-bold text-white">
              Garantie Google Core Web Vitals & GEO
            </h3>
            <p className="text-xs text-gray-400">
              Tous les projets développés par Sedra-dev visent un score vert (&gt;90/100) sur smartphone dès la livraison.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400">
              <CheckCircle className="h-4 w-4" /> Performance &gt; 95%
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-4 w-4" /> GEO IA Ready (Schema.org)
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Liste des audits */}
      <div className="space-y-4">
        {audits.map((aud) => (
          <GlassCard key={aud.id} className="p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={aud.url}
                    target="_blank"
                    rel="noreferrer"
                    className="font-geist text-lg font-bold text-white hover:text-indigo-300 flex items-center gap-2"
                  >
                    {aud.url}
                    <ExternalLink className="h-4 w-4 opacity-60" />
                  </a>
                  <Badge
                    tone={aud.status === 'envoye' ? 'emerald' : 'amber'}
                    dot
                  >
                    {aud.status === 'envoye' ? 'Audit transmis' : 'À traiter sous 24h'}
                  </Badge>
                </div>

                <p className="text-xs text-gray-400">
                  Demandeur :{' '}
                  <strong className="text-gray-200">{aud.contact}</strong> • Demandé
                  le {formatDate(aud.date, 'd MMMM yyyy')}
                </p>

                {/* Recommandations */}
                <div className="space-y-2 pt-2">
                  <p className="label-mono text-[10px]">3 Recommandations concrètes :</p>
                  <ul className="space-y-1.5">
                    {aud.recommandations.map((rec, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-xs text-gray-300"
                      >
                        <Zap className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Jauges de scores */}
              <div className="flex flex-wrap gap-3 shrink-0">
                <div
                  className={`flex flex-col items-center justify-center h-20 w-20 rounded-2xl border font-geist ${scoreColor(
                    aud.scores.perf,
                  )}`}
                >
                  <span className="text-2xl font-bold">{aud.scores.perf}</span>
                  <span className="text-[9px] uppercase tracking-wider opacity-80">
                    Vitesse
                  </span>
                </div>

                <div
                  className={`flex flex-col items-center justify-center h-20 w-20 rounded-2xl border font-geist ${scoreColor(
                    aud.scores.seo,
                  )}`}
                >
                  <span className="text-2xl font-bold">{aud.scores.seo}</span>
                  <span className="text-[9px] uppercase tracking-wider opacity-80">
                    SEO Google
                  </span>
                </div>

                <div
                  className={`flex flex-col items-center justify-center h-20 w-20 rounded-2xl border font-geist ${scoreColor(
                    aud.scores.access,
                  )}`}
                >
                  <span className="text-2xl font-bold">{aud.scores.access}</span>
                  <span className="text-[9px] uppercase tracking-wider opacity-80">
                    Access.
                  </span>
                </div>

                <div
                  className={`flex flex-col items-center justify-center h-20 w-20 rounded-2xl border font-geist ${scoreColor(
                    aud.scores.geo,
                  )}`}
                >
                  <span className="text-2xl font-bold">{aud.scores.geo}</span>
                  <span className="text-[9px] uppercase tracking-wider opacity-80">
                    GEO IA
                  </span>
                </div>
              </div>
            </div>

            {aud.status === 'a_faire' && (
              <div className="mt-6 flex justify-end border-t border-white/5 pt-4">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() =>
                    alert(
                      'Rapport d’audit PDF généré et prêt à être envoyé par email ou WhatsApp.',
                    )
                  }
                >
                  <Send className="h-3.5 w-3.5 mr-1.5" />
                  Envoyer les recommandations (24h)
                </Button>
              </div>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
