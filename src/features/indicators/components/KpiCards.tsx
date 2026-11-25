import type { Indicators } from '@/domain/indicators'
import { CountUp } from '@/components/ui/CountUp'
import { formatDecimal, formatPercent } from '../format'

const formatCount = (value: number) => String(Math.round(value))

const REPORTS_GOAL = 80
const RESIDENTS_GOAL = 50

interface KpiCardsProps {
  indicators: Indicators
  registeredResidents: number
  variant: 'desktop' | 'mobile'
}

function goalNote(value: number, goal: number, prefix: string): string {
  const missing = goal - value
  return missing <= 0 ? `${prefix} ${goal} · batida` : `${prefix} ${goal} · faltam ${missing}`
}

export function KpiCards({ indicators, registeredResidents, variant }: KpiCardsProps) {
  const desktop = variant === 'desktop'
  const cards = [
    {
      label: desktop ? 'Relatos no mapa' : 'Relatos',
      value: indicators.total,
      format: formatCount,
      note: goalNote(indicators.total, REPORTS_GOAL, desktop ? 'Meta do projeto:' : 'meta'),
      className: desktop ? 'bg-asfalto text-concreto' : 'bg-faixa text-asfalto',
    },
    {
      label: desktop ? 'Moradores cadastrados' : 'Cadastros',
      value: registeredResidents,
      format: formatCount,
      note: goalNote(registeredResidents, RESIDENTS_GOAL, desktop ? 'Meta:' : 'meta'),
      className: desktop ? 'bg-faixa text-asfalto' : 'bg-branco text-asfalto',
    },
    {
      label: desktop ? 'Com foto e descrição' : 'Com foto',
      value: indicators.withPhotoAndDescriptionShare,
      format: formatPercent,
      note: desktop
        ? `${indicators.withPhotoAndDescription} de ${indicators.total} relatos`
        : 'e descrição',
      className: 'bg-branco text-asfalto',
    },
    {
      label: desktop ? 'Confirmações por relato' : 'Confirmações',
      value: indicators.confirmationsPerReport,
      format: formatDecimal,
      note: desktop ? 'Média de “eu também vi”' : 'por relato',
      className: 'bg-branco text-asfalto',
    },
  ]

  return (
    <div
      className={
        desktop
          ? 'grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-4'
          : 'grid grid-cols-2 gap-2.5'
      }
    >
      {cards.map((card) => (
        <div
          key={card.label}
          className={`flex animate-rise flex-col ${card.className} ${
            desktop ? 'min-h-37.5 gap-2.5 rounded-card p-5.5' : 'gap-1.5 rounded-[18px] p-4'
          }`}
        >
          <span className={`font-semibold opacity-85 ${desktop ? 'text-sm' : 'text-[13px]'}`}>
            {card.label}
          </span>
          <span
            className={`font-mono leading-none font-semibold tracking-[-0.03em] ${
              desktop ? 'text-5xl' : 'text-4xl'
            }`}
          >
            <CountUp value={card.value} format={card.format} />
          </span>
          <span className={`mt-auto opacity-80 ${desktop ? 'text-[13px]' : 'text-xs'}`}>
            {card.note}
          </span>
        </div>
      ))}
    </div>
  )
}
