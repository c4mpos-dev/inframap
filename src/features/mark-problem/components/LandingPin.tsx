interface LandingPinProps {
  width: number
}

export function LandingPin({ width }: LandingPinProps) {
  return (
    <span className="relative flex items-center justify-center" aria-hidden="true">
      <span className="absolute top-1/2 left-1/2 -mt-10 -ml-15 size-30 animate-ring rounded-full border-3 border-faixa" />
      <svg
        width={width}
        height={width * 1.25}
        viewBox="0 0 32 40"
        className="relative animate-pin-land"
      >
        <path
          d="M16 1C8 1 2 7 2 14.5C2 24 16 38 16 38C16 38 30 24 30 14.5C30 7 24 1 16 1Z"
          fill="#FFC21A"
        />
        <path
          d="M15.5 1.5L18 6.5L14.5 10L17.5 13.5L15.5 16"
          fill="none"
          stroke="#1C1F1E"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="40"
          className="animate-crack"
        />
      </svg>
    </span>
  )
}
