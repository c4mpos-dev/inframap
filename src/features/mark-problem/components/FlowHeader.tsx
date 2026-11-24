import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import { StrokeIcon } from '@/components/icons/StrokeIcon'

interface FlowHeaderProps {
  step: number
  totalSteps: number
  title: string
  onBack: () => void
}

export function FlowHeader({ step, totalSteps, title, onBack }: FlowHeaderProps) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const firstStep = useRef(step)

  // The button that moved the flow forward may be disabled or gone on the next
  // step, so focus goes to the new step title instead of falling to <body>.
  useEffect(() => {
    if (step !== firstStep.current) titleRef.current?.focus()
  }, [step])

  return (
    <header className="relative z-3 flex shrink-0 flex-col gap-3.5 bg-concreto px-4 pt-[calc(16px+env(safe-area-inset-top))] pb-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Voltar"
          onClick={onBack}
          className="flex size-11 items-center justify-center rounded-[14px] border-2 border-asfalto bg-branco"
        >
          <StrokeIcon path="M15 5l-7 7 7 7" size={20} strokeWidth={2.6} />
        </button>
        <div className="flex flex-1 flex-col">
          <span className="font-mono text-xs text-brita">
            Passo {step} de {totalSteps}
          </span>
          <h1 ref={titleRef} tabIndex={-1} className="text-lg font-extrabold outline-none">
            {title}
          </h1>
        </div>
        <Link to="/mapa" className="py-3 text-sm font-semibold text-brita">
          Cancelar
        </Link>
      </div>
      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${totalSteps}, minmax(0, 1fr))` }}
        aria-hidden="true"
      >
        {Array.from({ length: totalSteps }, (_, index) => (
          <span key={index} className="block h-1.5 overflow-hidden rounded-[3px] bg-[#DDD7CA]">
            {index < step && <span className="block h-full origin-left animate-fill bg-asfalto" />}
          </span>
        ))}
      </div>
    </header>
  )
}
