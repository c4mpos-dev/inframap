import type { CSSProperties } from 'react'
import { getCategory } from '@/domain/categories'
import { getStatus } from '@/domain/statuses'
import type { CategoryId, StatusId } from '@/domain/types'

interface MapPinProps {
  categoryId: CategoryId
  status: StatusId
  selected?: boolean
  dropDelayMs?: number
  width?: number
}

export function MapPin({
  categoryId,
  status,
  selected = false,
  dropDelayMs = 0,
  width = 40,
}: MapPinProps) {
  const height = width * 1.25
  const color = getStatus(status).color
  const dropStyle: CSSProperties = { animationDelay: `${dropDelayMs}ms` }

  return (
    <span className="relative block animate-drop" style={{ width, height, ...dropStyle }}>
      {selected && (
        <span
          aria-hidden="true"
          className="absolute top-full left-1/2 size-8 animate-pulse-ring rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      <span
        className={`block origin-bottom transition-transform duration-200 ease-bounce ${
          selected ? 'scale-130' : 'hover:scale-115'
        }`}
      >
        <svg width={width} height={height} viewBox="-2 0 36 40" aria-hidden="true">
          <path
            d="M16 1C8 1 2 7 2 14.5C2 24 16 38 16 38C16 38 30 24 30 14.5C30 7 24 1 16 1Z"
            fill={color}
            stroke="#FFFFFF"
            strokeWidth="2"
          />
          <g transform="translate(8.5 7) scale(0.625)">
            <path
              d={getCategory(categoryId).iconPath}
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </svg>
      </span>
    </span>
  )
}
