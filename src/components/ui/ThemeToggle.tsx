import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../lib/format'

interface Props {
  className?: string
}

export function ThemeToggle({ className }: Props) {
  const { theme, toggleTheme } = useTheme()
  const isLight = theme === 'light'

  return (
    <button
      onClick={toggleTheme}
      type="button"
      id="theme-toggle-btn"
      aria-label={isLight ? 'Passer en mode sombre' : 'Passer en mode clair'}
      title={isLight ? 'Passer en mode sombre' : 'Passer en mode clair'}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300',
        isLight
          ? 'border-slate-300 bg-white text-amber-500 shadow-sm hover:border-amber-400 hover:bg-amber-50/50'
          : 'border-white/10 bg-white/[0.04] text-indigo-300 hover:border-white/20 hover:bg-white/10 hover:text-white',
        className,
      )}
    >
      <div className="relative h-4 w-4">
        <Sun
          className={cn(
            'absolute inset-0 h-4 w-4 transition-transform duration-300',
            isLight
              ? 'rotate-0 scale-100 opacity-100'
              : '-rotate-90 scale-0 opacity-0',
          )}
        />
        <Moon
          className={cn(
            'absolute inset-0 h-4 w-4 transition-transform duration-300',
            isLight
              ? 'rotate-90 scale-0 opacity-0'
              : 'rotate-0 scale-100 opacity-100',
          )}
        />
      </div>
    </button>
  )
}
