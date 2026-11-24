import { getStatus } from '@/domain/statuses'
import type { StatusId } from '@/domain/types'

interface StatusPinIconProps {
  status: StatusId
  size?: number
}

export function StatusPinIcon({ status, size = 32 }: StatusPinIconProps) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 32 40" aria-hidden="true">
      <path
        d="M16 1C8 1 2 7 2 14.5C2 24 16 37 16 37C16 37 30 24 30 14.5C30 7 24 1 16 1Z"
        fill={getStatus(status).color}
      />
      {status === 'aberta' && <circle cx="16" cy="14.5" r="5" fill="#FFFFFF" />}
      {status === 'andamento' && (
        <path d="M11 14.5h10" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
      )}
      {status === 'resolvida' && (
        <path
          d="M11 14.5l3.5 3.5L21 11.5"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  )
}
