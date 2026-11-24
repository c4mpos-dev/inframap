import { StrokeIcon } from '@/components/icons/StrokeIcon'

interface PhotoPlaceholderProps {
  className?: string
  label?: string
}

export function PhotoPlaceholder({ className = '', label }: PhotoPlaceholderProps) {
  return (
    <div
      className={`flex items-center justify-center bg-[repeating-linear-gradient(-45deg,#E6E1D6_0_12px,#DDD7CA_12px_24px)] ${className}`}
    >
      {label ? (
        <span className="rounded-md bg-concreto px-2 py-1 font-mono text-xs text-brita">
          {label}
        </span>
      ) : (
        <StrokeIcon
          path="M3 8h3l2-3h8l2 3h3v11H3zM12 9.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z"
          strokeWidth={1.8}
          className="text-brita"
        />
      )}
    </div>
  )
}
