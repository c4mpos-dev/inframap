import { StrokeIcon } from '@/components/icons/StrokeIcon'

interface ChipProps {
  label: string
  iconPath?: string
  selected?: boolean
  onClick?: () => void
}

export function Chip({ label, iconPath, selected = false, onClick }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-9 shrink-0 items-center gap-1.5 rounded-full border-[1.5px] border-asfalto px-3 text-sm font-semibold transition-colors ${
        selected ? 'bg-asfalto text-concreto' : 'bg-branco text-asfalto hover:bg-concreto'
      }`}
    >
      {iconPath && <StrokeIcon path={iconPath} size={15} />}
      {label}
    </button>
  )
}
