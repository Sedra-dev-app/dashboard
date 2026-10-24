import { NavLink, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut } from 'lucide-react'
import { toast } from 'sonner'
import { NAV } from './nav'
import { cn } from '../../lib/format'
import { useStats } from '../../hooks/useData'
import { useAuth } from '../../hooks/useAuth'
import { Avatar } from '../ui/misc'
import { LiveDot } from '../ui/Badge'

export function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="absolute inset-0 rounded-xl bg-indigo-500/50 blur-md" />
        <img src="/favicon.svg" alt="" className="relative h-9 w-9" />
      </div>
      <div className="leading-tight">
        <p className="font-geist text-[15px] font-bold tracking-tight text-white">Sedra-dev</p>
        <p className="font-geist-mono text-[10px] uppercase tracking-widest text-gray-500">Command Center</p>
      </div>
    </div>
  )
}

export function Sidebar() {
  const { data: stats } = useStats()
  const { profile, session, signOut } = useAuth()
  const name = profile?.full_name || session?.user.email || 'Admin'

  return (
    <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 flex-col border-r border-white/5 bg-ink-900/60 px-4 py-6 backdrop-blur-xl lg:flex">
      <div className="px-2">
        <Logo />
      </div>

      <nav className="mt-10 flex-1 space-y-1" aria-label="Navigation principale">
        <p className="label-mono mb-3 px-3 text-[10px] text-gray-600">Menu</p>
        {NAV.map((item) => {
          const badge = item.badgeKey ? stats?.[item.badgeKey] : 0
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              id={`nav-${item.to.replace('/', '') || 'overview'}`}
              className={({ isActive }) =>
                cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors',
                  isActive ? 'text-white' : 'text-gray-400 hover:bg-white/[0.04] hover:text-gray-200',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-xl border border-indigo-500/25 bg-gradient-to-r from-indigo-500/15 to-purple-500/5 shadow-lg shadow-indigo-500/10"
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                  <item.icon className={cn('relative h-[18px] w-[18px]', isActive ? 'text-indigo-300' : 'text-gray-500 group-hover:text-gray-300')} />
                  <span className="relative flex-1">{item.label}</span>
                  {!!badge && (
                    <span className="relative rounded-full bg-indigo-500 px-1.5 py-0.5 font-geist-mono text-[10px] font-semibold text-white shadow-glow">
                      {badge}
                    </span>
                  )}
                  {item.phase && (
                    <span className="relative font-geist-mono text-[9px] uppercase tracking-wider text-gray-600">Bientôt</span>
                  )}
                </>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div className="glass-card mt-6 rounded-2xl p-3">
        <div className="flex items-center gap-3">
          <Avatar name={name} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{name}</p>
            <p className="flex items-center gap-1.5 text-[11px] text-emerald-300">
              <LiveDot className="scale-75" /> En ligne
            </p>
          </div>
          <Link
            to="/login"
            onClick={() => {
              signOut()
              toast.info('Session terminée — retour à l’écran de connexion démo')
            }}
            id="btn-logout"
            className="rounded-lg p-2 text-gray-500 transition hover:bg-white/10 hover:text-indigo-300"
            aria-label="Voir la page de connexion"
            title="Voir la page de connexion (Démo)"
          >
            <LogOut className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
