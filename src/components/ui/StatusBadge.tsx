import { StatusGlyph } from '@/components/icons/StatusGlyph'
import { getStatus } from '@/domain/statuses'
import type { StatusId } from '@/domain/types'

const backgrounds: Record<StatusId, string> = {
  aberta: 'bg-aberta',
  andamento: 'bg-andamento',
  resolvida: 'bg-resolvida',
}

interface StatusBadgeProps {
  status: StatusId
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const dimensions = size === 'sm' ? 'h-6 px-2.5 text-xs' : 'h-7 px-2.5 text-[13px]'
  return (
    <span
      className={`inline-flex items-center gap-1.5 self-start rounded-full font-bold text-branco ${backgrounds[status]} ${dimensions}`}
    >
      <StatusGlyph status={status} size={size === 'sm' ? 10 : 12} />
      {getStatus(status).label}
    </span>
  )
}
