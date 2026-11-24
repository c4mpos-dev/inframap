import { useState } from 'react'
import type { WeekBucket } from '@/domain/indicators'
import { niceMax } from '../format'

interface WeeklyChartProps {
  weeks: WeekBucket[]
  variant: 'desktop' | 'mobile'
}

const reportsLabel = (value: number) => (value === 1 ? '1 relato' : `${value} relatos`)

export function WeeklyChart({ weeks, variant }: WeeklyChartProps) {
  const desktop = variant === 'desktop'
  const [active, setActive] = useState<number | null>(desktop ? null : weeks.length - 1)
  const max = niceMax(Math.max(0, ...weeks.map((week) => week.value)))
  const plotHeight = desktop ? 212 : 160
  const highlighted = active !== null ? weeks[active] : undefined

  if (weeks.length === 0) {
    return <p className="text-sm text-carvao">Nenhum relato nesse filtro.</p>
  }

  return (
    <div className="flex flex-col gap-3.5">
      {!desktop && highlighted && (
        <p className="self-end text-[13px] text-carvao" aria-live="polite">
          <strong className="font-mono">{highlighted.value}</strong> na semana de{' '}
          {highlighted.label}
        </p>
      )}
      <div
        className={`relative flex ${desktop ? 'h-60 pl-8' : 'h-42.5 border-b border-[#CFC8B8]'}`}
      >
        {desktop && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 bottom-7 flex flex-col justify-between font-mono text-[11px] text-brita"
          >
            {[max, max / 2, 0].map((tick, index) => (
              <span key={tick} className="flex items-center gap-2">
                <span className="w-5 text-right">{tick}</span>
                <span className={`h-px flex-1 ${index === 2 ? 'bg-[#CFC8B8]' : 'bg-[#EEEAE2]'}`} />
              </span>
            ))}
          </div>
        )}
        {weeks.map((week, index) => {
          const on = index === active
          const height = (week.value / max) * plotHeight
          return (
            <button
              key={week.start}
              type="button"
              aria-label={`${reportsLabel(week.value)} na semana de ${week.label}`}
              aria-pressed={desktop ? undefined : on}
              onMouseEnter={() => desktop && setActive(index)}
              onMouseLeave={() => desktop && setActive(null)}
              onFocus={() => setActive(index)}
              onBlur={() => desktop && setActive(null)}
              onClick={() => setActive(index)}
              className={`relative z-1 flex flex-1 flex-col items-center justify-end ${desktop ? 'gap-2' : ''}`}
            >
              {desktop && on && (
                <span
                  className="absolute left-1/2 z-2 -translate-x-1/2 rounded-lg bg-asfalto px-2.5 py-1.5 text-xs whitespace-nowrap text-concreto"
                  style={{ bottom: height + 36 }}
                >
                  <strong className="font-mono">{week.value}</strong>{' '}
                  {week.value === 1 ? 'relato' : 'relatos'} · {week.label}
                </span>
              )}
              <span
                className={`block origin-bottom animate-grow-up rounded-t ${desktop ? 'w-7' : 'w-4.5'} ${
                  on ? 'bg-faixa' : 'bg-asfalto'
                }`}
                style={{ height, animationDelay: `${index * 60}ms` }}
              />
              {desktop && (
                <span className="h-5 font-mono text-[11px] text-brita">{week.label}</span>
              )}
            </button>
          )
        })}
      </div>
      {!desktop && (
        <div className="flex justify-between font-mono text-[11px] text-brita">
          <span>{weeks[0]?.label}</span>
          <span>{weeks[weeks.length - 1]?.label}</span>
        </div>
      )}
    </div>
  )
}
