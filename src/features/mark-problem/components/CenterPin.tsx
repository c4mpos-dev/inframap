interface CenterPinProps {
  size: 'md' | 'lg'
  top: string
}

export function CenterPin({ size, top }: CenterPinProps) {
  const width = size === 'lg' ? 64 : 52
  const height = width * 1.2

  return (
    <div
      className="pointer-events-none absolute left-1/2 size-0"
      style={{ top }}
      aria-hidden="true"
    >
      {size === 'lg' && (
        <span className="absolute -top-7.5 -left-7.5 size-15 animate-ring rounded-full border-3 border-asfalto [animation-delay:0s] [animation-duration:2s]" />
      )}
      <span className="absolute -top-1 -left-3.5 h-2 w-7 animate-float-shadow rounded-[50%] bg-asfalto" />
      <svg
        width={width}
        height={height}
        viewBox="0 0 32 40"
        className="absolute animate-float"
        style={{ left: -width / 2, top: -height - 2 }}
      >
        <path
          d="M16 1C8 1 2 7 2 14.5C2 24 16 38 16 38C16 38 30 24 30 14.5C30 7 24 1 16 1Z"
          fill="#FFC21A"
          stroke="#1C1F1E"
          strokeWidth="2"
        />
        <path
          d="M15.5 1.5L18 6.5L14.5 10L17.5 13.5L15.5 16"
          fill="none"
          stroke="#1C1F1E"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  )
}
