import type { StatusId } from '@/domain/types'

interface StatusGlyphProps {
  status: StatusId
  size?: number
}

export function StatusGlyph({ status, size = 12 }: StatusGlyphProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      {status === 'aberta' && <circle cx="6" cy="6" r="2.75" fill="currentColor" stroke="none" />}
      {status === 'andamento' && <path d="M2.5 6h7" />}
      {status === 'resolvida' && <path d="M2.25 6.25l2.5 2.5L9.75 3.5" />}
    </svg>
  )
}
