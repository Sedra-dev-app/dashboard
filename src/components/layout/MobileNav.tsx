import { NavLink } from 'react-router-dom'
import { cn } from '../../lib/format'
import { NAV } from './nav'
import { useStats } from '../../hooks/useData'

/** Barre de navigation basse sur mobile (écrans disponibles uniquement). */
export function MobileNav() {
  const { data: stats } = useStats()
  const items = NAV.filter((n) => !n.phase)
  return (
    <nav
      aria-label="Navigation mobile"
      className="fixed inset-x-3 bottom-3 z-40 flex items-center justify-around rounded-2xl border border-white/10 bg-ink-900/80 px-2 py-2 shadow-2xl shadow-black/80 backdrop-blur-2xl lg:hidden"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {items.map((item) => {
        const badge = item.badgeKey ? stats?.[item.badgeKey] : 0
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              cn(
                'relative flex flex-1 flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] transition',
                isActive ? 'text-white' : 'text-gray-500',
              )
            }
          >
            {({ isActive }) => (
              <>
                <span className={cn('rounded-lg p-1.5 transition', isActive && 'bg-indigo-500/20 text-indigo-300')}>
                  <item.icon className="h-5 w-5" />
                </span>
                {item.label.split(' ')[0]}
                {!!badge && <span className="absolute right-1/4 top-0.5 h-2 w-2 rounded-full bg-indigo-400 shadow-glow" />}
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
