import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Lock, Mail, Sparkles, ArrowRight, ArrowLeft, ShieldCheck, Eye, EyeOff } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { Field } from '../components/ui/misc'
import { Aurora } from '../components/layout/Aurora'
import { ThemeToggle } from '../components/ui/ThemeToggle'
import { useAuth } from '../hooks/useAuth'
import { toast } from 'sonner'

export function LoginPage() {
  const navigate = useNavigate()
  const { signIn, signUp, enterDemoMode } = useAuth()

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('admin@sedra-studio.fr')
  const [password, setPassword] = useState('demo-access-2026')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulation fluide et réaliste de vérification d'accès
    await new Promise((r) => setTimeout(r, 450))

    try {
      enterDemoMode()
      if (mode === 'signin') {
        toast.success('Connexion réussie ! Bienvenue sur le Command Center Alexandre R.')
      } else {
        toast.success('Accès administrateur validé ! Session démo initialisée avec succès.')
      }
      navigate('/')
    } finally {
      setLoading(false)
    }
  }

  const handleDemo = () => {
    enterDemoMode()
    toast.success('Accès direct au cockpit activé (Session Démo)')
    navigate('/')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <Aurora />

      <div className="absolute left-6 top-6 z-20">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2 text-xs font-medium text-gray-300 transition hover:border-indigo-500/40 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-indigo-400" />
          Accéder directement au cockpit
        </Link>
      </div>

      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      <GlassCard className="relative w-full max-w-md overflow-hidden p-8 sm:p-10 shadow-2xl">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl" />

        {/* Logo & Titre */}
        <div className="text-center space-y-2">
          <div className="inline-flex relative mb-2">
            <div className="absolute inset-0 rounded-2xl bg-indigo-500/50 blur-lg" />
            <img src="/favicon.svg" alt="Sedra-dev" className="relative h-14 w-14" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Command Center
          </h1>
          <p className="text-xs text-gray-400">
            Accès sécurisé réservé à l’administration de{' '}
            <span className="text-indigo-300 font-semibold">sedra-dev.com</span>
          </p>
        </div>

        {/* Onglets Connexion / Inscription */}
        <div className="mt-8 flex rounded-xl border border-white/10 bg-white/[0.02] p-1 text-xs">
          <button
            type="button"
            onClick={() => setMode('signin')}
            className={`flex-1 rounded-lg py-2 font-medium transition ${
              mode === 'signin'
                ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-glow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Connexion Admin
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`flex-1 rounded-lg py-2 font-medium transition ${
              mode === 'signup'
                ? 'bg-indigo-600/30 text-white border border-indigo-500/40 shadow-glow'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Créer mon accès
          </button>
        </div>

        {/* Badge Identifiants Démo Fictifs */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3.5 py-2.5 text-xs text-indigo-300">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <span>Identifiants démo fictifs pré-remplis</span>
          </div>
          <span className="font-geist-mono text-[10px] uppercase tracking-wider text-indigo-400 font-semibold">
            Accès libre
          </span>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <Field label="Adresse email">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sedra-studio.fr"
                className="input pl-10"
              />
            </div>
          </Field>

          <Field label="Mot de passe">
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <input
                required
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="input pl-10 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </Field>

          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            className="w-full mt-2"
          >
            {mode === 'signin'
              ? 'Se connecter au cockpit (Accès Démo)'
              : 'Valider mon accès démo'}
            <ArrowRight className="h-4 w-4 ml-1.5" />
          </Button>
        </form>

        {/* Bouton Accès Démo Immédiat */}
        <div className="mt-6 border-t border-white/5 pt-5 text-center">
          <p className="text-xs text-gray-500 mb-3">
            Vous voulez explorer l’interface immédiatement ?
          </p>
          <button
            type="button"
            onClick={handleDemo}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-medium text-gray-300 transition hover:border-indigo-500/40 hover:bg-white/[0.07] hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
            Accéder en Mode Démo (Découverte Portfolio)
          </button>
        </div>
      </GlassCard>
    </div>
  )
}
