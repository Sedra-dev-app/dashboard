import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Bell } from 'lucide-react'
import { Aurora } from './Aurora'
import { Sidebar, Logo } from './Sidebar'
import { MobileNav } from './MobileNav'
import { CommandPalette } from './CommandPalette'
import { LiveDot } from '../ui/Badge'
import { ThemeToggle } from '../ui/ThemeToggle'
import { useRealtime, useStats } from '../../hooks/useData'
import { formatDate } from '../../lib/format'

export function AppShell() {
  const [cmdOpen, setCmdOpen] = useState(false)
  const location = useLocation()
  const { data: stats } = useStats()
  useRealtime(true)

  return (
    <div className="flex min-h-screen">
      <Aurora />
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/5 bg-black/40 px-4 backdrop-blur-xl sm:px-6 lg:px-10">
          <div className="lg:hidden">
            <Logo />
          </div>

          <button
            id="btn-command-palette"
            onClick={() => setCmdOpen(true)}
            className="group ml-auto hidden h-10 w-full max-w-sm items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3.5 text-sm text-gray-500 transition hover:border-white/20 hover:bg-white/[0.06] md:flex lg:ml-0"
          >
            <Search className="h-4 w-4" />
            <span className="flex-1 text-left">Rechercher…</span>
            <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-geist-mono text-[10px] text-gray-400">Ctrl K</kbd>
          </button>

          <div className="ml-auto flex items-center gap-2 sm:gap-4">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] px-3 py-1.5 sm:flex">
              <LiveDot />
              <span className="font-geist-mono text-[10px] uppercase tracking-widest text-emerald-300">Live</span>
            </div>
            <span className="hidden font-geist-mono text-xs capitalize text-gray-500 xl:block">
              {formatDate(new Date().toISOString(), 'EEEE d MMMM')}
            </span>
            <ThemeToggle />
            <button
              onClick={() => setCmdOpen(true)}
              className="rounded-xl p-2.5 text-gray-400 transition hover:bg-white/10 hover:text-white md:hidden"
              aria-label="Rechercher"
            >
              <Search className="h-5 w-5" />
            </button>
            <a
              href="/leads"
              className="relative rounded-xl p-2.5 text-gray-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Leads non lus"
            >
              <Bell className="h-5 w-5" />
              {!!stats?.leads_unread && (
                <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-indigo-500 px-1 font-geist-mono text-[9px] font-bold text-white shadow-glow">
                  {stats.leads_unread}
                </span>
              )}
            </a>
          </div>
        </header>

        <main className="flex-1 px-4 pb-28 pt-8 sm:px-6 lg:px-10 lg:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mx-auto max-w-7xl"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <MobileNav />
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
    </div>
  )
}
