import { useRef, type PointerEvent, type ReactNode } from 'react'
import { prefersReducedMotion } from '@/lib/motion'

const MAX_DEGREES = 7

/** Leans its child toward the mouse, like a card held in the hand. Mouse only. */
export function TiltOnHover({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  function lean(event: PointerEvent<HTMLDivElement>) {
    const element = ref.current
    if (!element || event.pointerType !== 'mouse' || prefersReducedMotion()) return
    const box = element.getBoundingClientRect()
    const x = (event.clientX - box.left) / box.width - 0.5
    const y = (event.clientY - box.top) / box.height - 0.5
    element.style.transform = `perspective(900px) rotateX(${-y * MAX_DEGREES}deg) rotateY(${x * MAX_DEGREES}deg)`
  }

  function reset() {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <div
      ref={ref}
      onPointerMove={lean}
      onPointerLeave={reset}
      className={`transition-transform duration-300 ease-out will-change-transform ${className}`}
    >
      {children}
    </div>
  )
}
