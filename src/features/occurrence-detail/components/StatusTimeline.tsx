import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { formatEventDate } from '@/domain/relativeTime'
import type { Occurrence } from '@/domain/types'
import { buildTimeline, type TimelineStep } from '../buildTimeline'

const CHECK_PATH = 'M5 12.5l4.5 4.5L19 7.5'

function StepMarker({ step }: { step: TimelineStep }) {
  if (step.state === 'done') {
    return (
      <span className="flex size-6.25 shrink-0 items-center justify-center rounded-full bg-asfalto text-faixa">
        <StrokeIcon path={CHECK_PATH} size={12} strokeWidth={3.6} />
      </span>
    )
  }
  if (step.state === 'current') {
    return (
      <span
        className="size-6.25 shrink-0 animate-live rounded-full border-4 border-concreto"
        style={{ backgroundColor: step.color, color: step.color }}
      />
    )
  }
  return (
    <span className="size-6.25 shrink-0 rounded-full border-3 border-dashed border-[#A39C8D] bg-concreto" />
  )
}

const stateLabels: Record<TimelineStep['state'], string> = {
  done: 'concluído',
  current: 'etapa atual',
  pending: 'ainda não aconteceu',
  skipped: 'pulado',
}

export function StatusTimeline({ occurrence }: { occurrence: Occurrence }) {
  const steps = buildTimeline(occurrence)

  return (
    <section className="flex flex-col gap-3.5">
      <h2 className="text-sm font-bold tracking-[0.06em] text-brita uppercase">Andamento</h2>
      <ol className="relative flex flex-col">
        {steps.map((step, index) => {
          const last = index === steps.length - 1
          const nextReached =
            steps[index + 1]?.state === 'done' || steps[index + 1]?.state === 'current'
          const muted = step.state === 'pending' || step.state === 'skipped'
          return (
            <li
              key={step.key}
              aria-current={step.state === 'current' ? 'step' : undefined}
              className={`relative flex gap-3.5 ${last ? '' : 'pb-5'}`}
            >
              {!last && (
                <span
                  aria-hidden="true"
                  className={`absolute top-6.25 bottom-0 left-2.75 w-0.75 rounded-sm ${
                    nextReached
                      ? 'origin-top animate-grow-down bg-asfalto'
                      : 'bg-[repeating-linear-gradient(#CFC8B8_0_5px,transparent_5px_10px)]'
                  }`}
                />
              )}
              <StepMarker step={step} />
              <span className="flex flex-col gap-0.5">
                <strong className={`text-[15px] ${muted ? 'text-brita' : ''}`}>
                  {step.title}
                  <span className="sr-only">, {stateLabels[step.state]}</span>
                </strong>
                {step.detail && (
                  <span
                    className={`text-[13px] leading-snug ${muted ? 'text-brita' : 'text-carvao'}`}
                  >
                    {step.detail}
                  </span>
                )}
                {step.at && (
                  <span className="font-mono text-xs text-brita">{formatEventDate(step.at)}</span>
                )}
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
