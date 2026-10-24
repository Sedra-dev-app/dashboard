import { useState } from 'react'
import {
  Settings,
  Database,
  Building,
  User,
  Shield,
  Copy,
  Check,
  Save,
  Terminal,
} from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Badge, LiveDot } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { PageHeader, Field } from '../components/ui/misc'
import { toast } from 'sonner'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

export function SettingsPage() {
  const { profile, session } = useAuth()
  const [copied, setCopied] = useState(false)

  const [companyInfo, setCompanyInfo] = useState({
    name: 'Sedra Studio (Nom d’agence fictif)',
    admin: 'Alexandre R. (Identité fictive)',
    email: 'contact.demo@sedra-studio.fr (Email fictif)',
    phone: '+33 1 00 00 00 00 (Numéro fictif)',
    address: '14 Avenue de l’Opéra, 75001 Paris (Adresse fictive)',
    siret: '000 000 000 00000 (SIRET Fictif - Démo)',
    mention: 'Dispensé d’immatriculation RCS, art. 293 B du CGI (Exemple démo)',
  })

  const copySqlHint = () => {
    navigator.clipboard.writeText(
      `Le fichier de migration SQL complet est disponible dans :\nsupabase/schema.sql`,
    )
    setCopied(true)
    toast.success('Chemin du script SQL copié !')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('Paramètres enregistrés avec succès')
  }

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://hupewwtgrfuxowpdsxjw.supabase.co'

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Configuration & Système"
        title="Paramètres de l’application"
        description="Gérez les informations d’entreprise, la connexion Supabase et vos préférences administratives."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Colonne Gauche : Société & Profil (7 col) */}
        <div className="space-y-6 lg:col-span-7">
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Building className="h-5 w-5 text-indigo-400" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-white">
                    Identité professionnelle & Facturation
                  </h3>
                  <Badge tone="amber">Données & SIRET Fictifs</Badge>
                </div>
                <p className="text-xs text-gray-400">
                  Noms, SIRET, adresses et emails indiqués à titre d’exemple fictif pour le portfolio.
                </p>
              </div>
            </div>

            <form onSubmit={handleSave} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nom commercial">
                  <input
                    type="text"
                    value={companyInfo.name}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, name: e.target.value })
                    }
                    className="input"
                  />
                </Field>

                <Field label="Responsable légal">
                  <input
                    type="text"
                    value={companyInfo.admin}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, admin: e.target.value })
                    }
                    className="input"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Email de contact">
                  <input
                    type="email"
                    value={companyInfo.email}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, email: e.target.value })
                    }
                    className="input"
                  />
                </Field>

                <Field label="Téléphone officiel">
                  <input
                    type="tel"
                    value={companyInfo.phone}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, phone: e.target.value })
                    }
                    className="input"
                  />
                </Field>
              </div>

              <Field label="Adresse légale / Localisation">
                <input
                  type="text"
                  value={companyInfo.address}
                  onChange={(e) =>
                    setCompanyInfo({ ...companyInfo, address: e.target.value })
                  }
                  className="input"
                />
              </Field>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Numéro SIRET">
                  <input
                    type="text"
                    value={companyInfo.siret}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, siret: e.target.value })
                    }
                    className="input"
                  />
                </Field>

                <Field label="Mention légale TVA">
                  <input
                    type="text"
                    value={companyInfo.mention}
                    onChange={(e) =>
                      setCompanyInfo({ ...companyInfo, mention: e.target.value })
                    }
                    className="input"
                  />
                </Field>
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" size="md">
                  <Save className="h-4 w-4 mr-1.5" />
                  Sauvegarder les modifications
                </Button>
              </div>
            </form>
          </GlassCard>
        </div>

        {/* Colonne Droite : Base Supabase & Sécurité (5 col) */}
        <div className="space-y-6 lg:col-span-5">
          <GlassCard className="p-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-emerald-400" />
                <div>
                  <h3 className="font-semibold text-white">Connexion Supabase</h3>
                  <p className="text-xs text-gray-400">Base PostgreSQL en direct</p>
                </div>
              </div>
              <Badge tone="emerald" dot>
                Connecté
              </Badge>
            </div>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <span className="label-mono block mb-1">Project Endpoint</span>
                <div className="rounded-xl border border-white/10 bg-black/50 p-2.5 font-geist-mono text-gray-300 truncate">
                  {supabaseUrl}
                </div>
              </div>

              <div>
                <span className="label-mono block mb-1">Authentification & RLS</span>
                <p className="text-gray-400 leading-relaxed">
                  Toutes les tables sont sécurisées par Row Level Security (RLS). Seul votre compte administrateur a les droits de lecture et écriture.
                </p>
              </div>

              <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.04] p-4 space-y-2">
                <div className="flex items-center gap-2 text-indigo-300 font-semibold">
                  <Terminal className="h-4 w-4" />
                  Schéma SQL prêt à l’emploi
                </div>
                <p className="text-gray-400">
                  Le fichier <code className="text-white">supabase/schema.sql</code> contient toutes vos tables, triggers d'activité temps réel et la fonction anti-spam pour sedra-dev.com.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copySqlHint}
                  className="w-full mt-2"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5 mr-1 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 mr-1" />
                  )}
                  Copier l'emplacement du SQL
                </Button>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4">
              <Shield className="h-5 w-5 text-purple-400" />
              <div>
                <h3 className="font-semibold text-white">Session Administrateur</h3>
                <p className="text-xs text-gray-400">
                  Compte connecté : {session?.user.email || 'Mode Démonstration Actif'}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-gray-400">Rôle attribué :</span>
              <Badge tone="purple">Admin Principal</Badge>
            </div>
          </GlassCard>

          <ThemeSettingsCard />
        </div>
      </div>
    </div>
  )
}

function ThemeSettingsCard() {
  const { theme, setTheme } = useTheme()

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 border-b border-white/5 pb-4">
        <Sun className="h-5 w-5 text-amber-400" />
        <div>
          <h3 className="font-semibold text-white">Apparence de l'interface</h3>
          <p className="text-xs text-gray-400">Choisissez votre thème préféré.</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`flex flex-col items-center gap-2 rounded-2xl border p-3.5 transition-all ${
            theme === 'dark'
              ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-glow'
              : 'border-white/10 bg-white/[0.02] text-gray-400 hover:text-white'
          }`}
        >
          <div className="flex h-10 w-full items-center justify-center rounded-xl bg-black border border-white/10">
            <Moon className="h-5 w-5 text-indigo-400" />
          </div>
          <span className="font-medium">Mode Sombre (Défaut)</span>
        </button>

        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`flex flex-col items-center gap-2 rounded-2xl border p-3.5 transition-all ${
            theme === 'light'
              ? 'border-indigo-500 bg-indigo-500/10 text-indigo-900 shadow-md'
              : 'border-slate-200 bg-white/60 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex h-10 w-full items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
            <Sun className="h-5 w-5 text-amber-500" />
          </div>
          <span className="font-medium">Mode Clair</span>
        </button>
      </div>
    </GlassCard>
  )
}
