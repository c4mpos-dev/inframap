import { getStatus } from '@/domain/statuses'
import type { Indicators } from '@/domain/indicators'
import { formatPercent } from '../format'

interface StatusBreakdownProps {
  items: Indicators['byStatus']
  variant: 'desktop' | 'mobile'
}

export function StatusBreakdown({ items, variant }: StatusBreakdownProps) {
  const desktop = variant === 'desktop'
  const summary = items.map((item) => `${item.value} ${item.label.toLowerCase()}`).join(', ')
  const visible = items.filter((item) => item.value > 0)

  return (
    <div className="flex flex-col gap-4.5">
      <div role="img" aria-label={summary} className={`flex gap-0.5 ${desktop ? 'h-7' : 'h-5.5'}`}>
        {visible.map((item, index) => (
          <span
            key={item.id}
            className={`origin-left animate-grow-right first:rounded-l last:rounded-r`}
            style={{
              flexGrow: item.value,
              backgroundColor: getStatus(item.id).color,
              animationDelay: `${index * 150}ms`,
            }}
          />
        ))}
      </div>
      {desktop ? (
        <ul className="flex flex-col gap-3">
          {items.map((item) => (
            <li key={item.id} className="flex items-center gap-2.5">
              <span
                className="size-3 rounded-[3px]"
                style={{ backgroundColor: getStatus(item.id).color }}
              />
              <span className="flex-1 text-[15px]">
                {item.id === 'andamento' ? 'Em andamento' : item.label}
              </span>
              <strong className="font-mono text-[15px]">{item.value}</strong>
              <span className="w-11 text-right font-mono text-[13px] text-brita">
                {formatPercent(item.share)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <ul className="grid grid-cols-3 gap-2">
          {items.map((item) => (
            <li key={item.id} className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1.5 text-[13px]">
                <span
                  className="size-2.5 rounded-[3px]"
                  style={{ backgroundColor: getStatus(item.id).color }}
                />
                {item.label}
              </span>
              <strong className="font-mono text-lg">{item.value}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
