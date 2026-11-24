interface StrokeIconProps {
  path: string
  size?: number
  strokeWidth?: number
  className?: string
}

export function StrokeIcon({ path, size = 22, strokeWidth = 2, className }: StrokeIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d={path} />
    </svg>
  )
}
