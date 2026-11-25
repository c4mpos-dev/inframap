import { useEffect, useState } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

const DURATION_MS = 900

interface CountUpProps {
  value: number
  format: (value: number) => string
}

/** Counts from 0 to `value` once, easing out. Screen readers get the final number only. */
export function CountUp({ value, format }: CountUpProps) {
  const [shown, setShown] = useState(0)
  const reduced = prefersReducedMotion()

  useEffect(() => {
    if (reduced) return
    let frame = 0
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS)
      setShown(value * (1 - (1 - progress) ** 3))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, reduced])

  return (
    <>
      <span aria-hidden="true">{format(reduced ? value : shown)}</span>
      <span className="sr-only">{format(value)}</span>
    </>
  )
}
