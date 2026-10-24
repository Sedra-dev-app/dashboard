import type { ReactNode } from 'react'
import { cn, type Tone } from '../../lib/format'

const TONES: Record<Tone, string> = {
  indigo: 'border-indigo-500/30 bg-indigo-500/10 text-indigo-300',
  emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
  amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
  rose: 'border-rose-500/30 bg-rose-500/10 text-rose-300',
  cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
  purple: 'border-purple-500/30 bg-purple-500/10 text-purple-300',
  gray: 'border-white/10 bg-white/5 text-gray-400',
}

const DOTS: Record<Tone, string> = {
  indigo: 'bg-indigo-400',
  emerald: 'bg-emerald-400',
  amber: 'bg-amber-400',
  rose: 'bg-rose-400',
  cyan: 'bg-cyan-400',
  purple: 'bg-purple-400',
  gray: 'bg-gray-500',
}

export function Badge({ tone = 'gray', dot, children, className }: { tone?: Tone; dot?: boolean; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 font-geist-mono text-[10px] font-medium uppercase tracking-wider',
        TONES[tone],
        className,
      )}
    >
      {dot && <span className={cn('h-1.5 w-1.5 rounded-full', DOTS[tone])} />}
      {children}
    </span>
  )
}

/** Point vert « live » qui pulse, comme sur sedra-dev.com */
export function LiveDot({ className }: { className?: string }) {
  return (
    <span className={cn('relative flex h-2 w-2', className)}>
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-glow-emerald" />
    </span>
  )
}
