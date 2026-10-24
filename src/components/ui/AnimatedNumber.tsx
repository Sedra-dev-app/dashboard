import { useEffect, useRef } from 'react'
import { animate, useInView } from 'framer-motion'

interface Props {
  value: number
  format?: (n: number) => string
  duration?: number
  className?: string
}

/** Compteur qui monte jusqu'à la valeur à l'apparition. */
export function AnimatedNumber({ value, format = (n) => Math.round(n).toLocaleString('fr-FR'), duration = 1.4, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const from = useRef(0)

  useEffect(() => {
    if (!inView || !ref.current) return
    const controls = animate(from.current, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v)
      },
    })
    from.current = value
    return () => controls.stop()
  }, [inView, value, duration, format])

  return (
    <span ref={ref} className={className}>
      {format(0)}
    </span>
  )
}
