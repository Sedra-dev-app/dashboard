import { useRef, type HTMLAttributes, type MouseEvent } from 'react'
import { cn } from '../../lib/format'

interface Props extends HTMLAttributes<HTMLDivElement> {
  spotlight?: boolean
}

/** Carte verre du site + bordure lumineuse qui suit la souris. */
export function GlassCard({ className, spotlight = true, onMouseMove, children, ...rest }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current
    if (el) {
      const r = el.getBoundingClientRect()
      el.style.setProperty('--x', `${e.clientX - r.left}px`)
      el.style.setProperty('--y', `${e.clientY - r.top}px`)
    }
    onMouseMove?.(e)
  }
  return (
    <div
      ref={ref}
      onMouseMove={spotlight ? handleMove : onMouseMove}
      className={cn('glass-card rounded-3xl', spotlight && 'spotlight', className)}
      {...rest}
    >
      {children}
    </div>
  )
}
