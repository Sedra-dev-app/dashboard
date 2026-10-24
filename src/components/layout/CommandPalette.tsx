import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Command } from 'cmdk'
import { AnimatePresence, motion } from 'framer-motion'
import { Search, Inbox, Users, LogOut, CornerDownLeft } from 'lucide-react'
import { NAV } from './nav'
import { useClients, useLeads } from '../../hooks/useData'
import { useAuth } from '../../hooks/useAuth'

interface Props {
  open: boolean
  setOpen: (v: boolean) => void
}

/** Palette de commandes ⌘K / Ctrl+K : navigation + recherche leads & clients. */
export function CommandPalette({ open, setOpen }: Props) {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const { data: leads = [] } = useLeads()
  const { data: clients = [] } = useClients()
  const [search, setSearch] = useState('')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen(!open)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, setOpen])

  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  const go = (to: string) => {
    navigate(to)
    setOpen(false)
  }

  const itemCls =
    'flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-gray-300 transition-colors'

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -10 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-ink-800/95 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl"
          >
            <Command label="Palette de commandes" loop>
              <div className="flex items-center gap-3 border-b border-white/5 px-5">
                <Search className="h-4 w-4 text-gray-500" />
                <Command.Input
                  autoFocus
                  value={search}
                  onValueChange={setSearch}
                  placeholder="Rechercher un lead, un client, une page…"
                  className="h-14 flex-1 bg-transparent text-sm text-white placeholder-gray-500 outline-none"
                />
                <kbd className="rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-geist-mono text-[10px] text-gray-400">ESC</kbd>
              </div>
              <Command.List className="max-h-[380px] overflow-y-auto p-2">
                <Command.Empty className="py-10 text-center text-sm text-gray-500">Aucun résultat.</Command.Empty>

                <Command.Group heading="Navigation">
                  {NAV.filter((n) => !n.phase).map((n) => (
                    <Command.Item key={n.to} value={`page ${n.label}`} onSelect={() => go(n.to)} className={itemCls}>
                      <n.icon className="h-4 w-4 text-indigo-300" />
                      {n.label}
                      <CornerDownLeft className="ml-auto h-3.5 w-3.5 text-gray-600" />
                    </Command.Item>
                  ))}
                </Command.Group>

                {search.length > 0 && leads.length > 0 && (
                  <Command.Group heading="Leads">
                    {leads.slice(0, 30).map((l) => (
                      <Command.Item
                        key={l.id}
                        value={`lead ${l.name} ${l.email} ${l.company ?? ''}`}
                        onSelect={() => go(`/leads?id=${l.id}`)}
                        className={itemCls}
                      >
                        <Inbox className="h-4 w-4 text-cyan-300" />
                        <span className="truncate">{l.name}</span>
                        <span className="truncate text-xs text-gray-500">{l.email}</span>
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                {search.length > 0 && clients.length > 0 && (
                  <Command.Group heading="Clients">
                    {clients.slice(0, 30).map((c) => (
                      <Command.Item
                        key={c.id}
                        value={`client ${c.name} ${c.company ?? ''} ${c.email ?? ''}`}
                        onSelect={() => go(`/clients?id=${c.id}`)}
                        className={itemCls}
                      >
                        <Users className="h-4 w-4 text-purple-300" />
                        <span className="truncate">{c.company || c.name}</span>
                        {c.company && <span className="truncate text-xs text-gray-500">{c.name}</span>}
                      </Command.Item>
                    ))}
                  </Command.Group>
                )}

                <Command.Group heading="Compte">
                  <Command.Item value="déconnexion logout" onSelect={signOut} className={itemCls}>
                    <LogOut className="h-4 w-4 text-rose-300" />
                    Se déconnecter
                  </Command.Item>
                </Command.Group>
              </Command.List>
            </Command>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
