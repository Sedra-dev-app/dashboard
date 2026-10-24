import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/format'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  side?: boolean
}

/** Modale centrée, ou panneau latéral (side) — glass + blur. */
export function Modal({ open, onClose, title, subtitle, children, side }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div className={cn('fixed inset-0 z-50 flex', side ? 'justify-end' : 'items-center justify-center p-4')}>
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={side ? { x: '100%' } : { opacity: 0, scale: 0.96, y: 12 }}
            animate={side ? { x: 0 } : { opacity: 1, scale: 1, y: 0 }}
            exit={side ? { x: '100%' } : { opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: 'spring', damping: 30, stiffness: 320 }}
            className={cn(
              'relative flex flex-col overflow-hidden border border-white/10 bg-ink-800/95 shadow-2xl shadow-black/80 backdrop-blur-2xl',
              side ? 'h-full w-full max-w-xl border-y-0 border-r-0' : 'max-h-[90vh] w-full max-w-lg rounded-3xl',
            )}
          >
            <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-indigo-600/20 blur-3xl" />
            <header className="relative flex items-start justify-between gap-4 border-b border-white/5 px-6 py-5">
              <div>
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                {subtitle && <p className="mt-0.5 text-sm text-gray-400">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Fermer"
              >
                <X className="h-5 w-5" />
              </button>
            </header>
            <div className="relative flex-1 overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
