import type { CountItem } from '@/domain/indicators'

interface NeighborhoodRankingProps {
  items: CountItem[]
  variant: 'desktop' | 'mobile'
}

export function NeighborhoodRanking({ items, variant }: NeighborhoodRankingProps) {
  if (items.length === 0) return <p className="text-sm text-carvao">Nenhum relato nesse filtro.</p>
  const max = Math.max(1, ...items.map((item) => item.value))

  if (variant === 'mobile') {
    return (
      <ol className="flex flex-col">
        {items.map((item, index) => (
          <li
            key={item.label}
            className="flex items-center gap-3 border-b border-[#EEEAE2] py-2.5 last:border-b-0"
          >
            <span
              className={`flex size-6.5 items-center justify-center rounded-lg font-mono text-[13px] font-semibold ${
                index === 0 ? 'bg-asfalto text-faixa' : 'bg-meio-fio text-asfalto'
              }`}
            >
              {index + 1}
            </span>
            <span className="flex-1 text-[15px]">{item.label}</span>
            <strong className="font-mono text-[15px]">{item.value}</strong>
          </li>
        ))}
      </ol>
    )
  }

  return (
    <ol className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-x-8 gap-y-3.5">
      {items.map((item, index) => (
        <li key={item.label} className="flex flex-col gap-1.5">
          <span className="flex items-baseline justify-between">
            <span className="text-[15px] font-semibold">
              {index + 1}. {item.label}
            </span>
            <strong className="font-mono text-sm">{item.value}</strong>
          </span>
          <span className="block h-2.5 overflow-hidden rounded bg-[#EEEAE2]">
            <span
              className="block h-2.5 origin-left animate-grow-right rounded-r bg-asfalto"
              style={{ width: `${(item.value / max) * 100}%`, animationDelay: `${index * 60}ms` }}
            />
          </span>
        </li>
      ))}
    </ol>
  )
}
