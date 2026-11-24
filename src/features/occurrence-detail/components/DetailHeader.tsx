import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { getCategory } from '@/domain/categories'
import { formatDistance, formatRelativeDay } from '@/domain/relativeTime'
import type { Occurrence } from '@/domain/types'

const PLACE_PATH =
  'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 7a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z'

interface DetailHeaderProps {
  occurrence: Occurrence
  distanceMeters: number | null
}

export function DetailHeader({ occurrence, distanceMeters }: DetailHeaderProps) {
  const place = [
    occurrence.neighborhood,
    distanceMeters !== null ? `a ${formatDistance(distanceMeters)} de você` : null,
    formatRelativeDay(occurrence.createdAt),
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={occurrence.status} />
        <span className="font-mono text-xs text-brita">
          {occurrence.protocol} · {getCategory(occurrence.categoryId).shortLabel}
        </span>
      </div>
      <h1 className="text-[28px] leading-[1.05] font-black tracking-[-0.01em] [font-stretch:115%]">
        {occurrence.title}
      </h1>
      <span className="flex items-center gap-1.5 text-sm text-carvao">
        <StrokeIcon path={PLACE_PATH} size={16} className="shrink-0" />
        {place}
      </span>
    </div>
  )
}
