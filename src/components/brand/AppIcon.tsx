type AppIconTone = 'asfalto' | 'asfalto-2' | 'faixa'

const palettes: Record<AppIconTone, { tile: string; pin: string }> = {
  asfalto: { tile: '#1C1F1E', pin: '#FFC21A' },
  'asfalto-2': { tile: '#2A2E2C', pin: '#FFC21A' },
  faixa: { tile: '#FFC21A', pin: '#1C1F1E' },
}

interface AppIconProps {
  size?: number
  tone?: AppIconTone
  label?: string
}

export function AppIcon({ size = 36, tone = 'asfalto', label }: AppIconProps) {
  const { tile, pin } = palettes[tone]
  const showStripes = size >= 24
  const showCrack = size >= 20
  const a11y = label ? { role: 'img', 'aria-label': label } : { 'aria-hidden': true }

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className="shrink-0" {...a11y}>
      <rect width="64" height="64" rx="15" fill={tile} />
      <path
        d="M32 8C22 8 14 16 14 26C14 38 32 50 32 50C32 50 50 38 50 26C50 16 42 8 32 8Z"
        fill={pin}
      />
      {showCrack && (
        <path
          d="M31 8L35.5 16L29.5 21.5L35 27.5L31.5 32"
          fill="none"
          stroke={tile}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {showStripes &&
        [12, 27, 42].map((x) => (
          <rect key={x} x={x} y="54.5" width="10" height="3" rx="1.5" fill={pin} />
        ))}
    </svg>
  )
}
