import { CategoryIcon } from '@/components/icons/CategoryIcon'
import { formatRelativeDay } from '@/domain/relativeTime'
import { getStatus } from '@/domain/statuses'
import type { Occurrence } from '@/domain/types'

interface OccurrenceCardProps {
  occurrence: Occurrence
  selected?: boolean
  onSelect?: (id: string) => void
}

export function OccurrenceCard({ occurrence, selected = false, onSelect }: OccurrenceCardProps) {
  const status = getStatus(occurrence.status)

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={() => onSelect?.(occurrence.id)}
      className={`flex w-full items-center gap-3.5 rounded-[14px] border-2 p-3 text-left text-asfalto transition-[background-color,border-color,transform] duration-150 hover:translate-x-0.5 hover:bg-branco ${
        selected ? 'border-asfalto bg-branco' : 'border-transparent bg-branco/45'
      }`}
    >
      <span
        className="flex size-11 shrink-0 items-center justify-center rounded-control text-branco"
        style={{ backgroundColor: status.color }}
      >
        <CategoryIcon categoryId={occurrence.categoryId} strokeWidth={2.2} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.75">
        <strong className="text-[15px] leading-tight font-bold">{occurrence.title}</strong>
        <span className="text-[13px] text-brita">
          {status.label} · {occurrence.neighborhood} · {formatRelativeDay(occurrence.createdAt)}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="font-mono text-[15px] font-semibold">{occurrence.confirmations}</span>
        <span className="text-[11px] text-brita">viram</span>
      </span>
    </button>
  )
}
