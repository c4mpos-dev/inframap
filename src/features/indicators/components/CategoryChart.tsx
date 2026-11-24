import type { Indicators } from '@/domain/indicators'
import { formatPercent } from '../format'

interface CategoryChartProps {
  items: Indicators['byCategory']
  view: 'chart' | 'table'
  variant: 'desktop' | 'mobile'
}

export function CategoryChart({ items, view, variant }: CategoryChartProps) {
  const max = Math.max(1, ...items.map((item) => item.value))

  if (view === 'table') {
    return (
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th scope="col" className="border-b-2 border-asfalto py-2 text-left">
              Categoria
            </th>
            <th scope="col" className="border-b-2 border-asfalto py-2 text-right">
              Relatos
            </th>
            <th scope="col" className="border-b-2 border-asfalto py-2 text-right">
              % do total
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td className="border-b border-[#EEEAE2] py-2">{item.label}</td>
              <td className="border-b border-[#EEEAE2] py-2 text-right font-mono">{item.value}</td>
              <td className="border-b border-[#EEEAE2] py-2 text-right font-mono">
                {formatPercent(item.share)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  const bar = (value: number, index: number, track: boolean) => (
    <span className={`block h-3.5 ${track ? 'h-2.5 overflow-hidden rounded bg-[#EEEAE2]' : ''}`}>
      <span
        className={`block origin-left animate-grow-right rounded-r bg-asfalto ${track ? 'h-2.5' : 'h-3.5'}`}
        style={{ width: `${(value / max) * 100}%`, animationDelay: `${index * 60}ms` }}
      />
    </span>
  )

  if (variant === 'mobile') {
    return (
      <ul className="flex flex-col gap-3">
        {items.map((item, index) => (
          <li key={item.id} className="flex flex-col gap-1.25">
            <span className="flex justify-between text-sm">
              {item.label}
              <strong className="font-mono">{item.value}</strong>
            </span>
            {bar(item.value, index, true)}
          </li>
        ))}
      </ul>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item, index) => (
        <li key={item.id} className="grid grid-cols-[112px_1fr_32px] items-center gap-3">
          <span className="text-sm">{item.label}</span>
          {bar(item.value, index, false)}
          <strong className="text-right font-mono text-sm">{item.value}</strong>
        </li>
      ))}
    </ul>
  )
}
