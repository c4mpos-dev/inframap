import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { iconPaths } from '@/components/icons/paths'
import { MapStylePicker } from './MapStylePicker'

interface MobileLocateButtonProps {
  raised: boolean
  onLocate: () => void
  locating: boolean
}

export function MobileLocateButton({ raised, onLocate, locating }: MobileLocateButtonProps) {
  if (raised) return null
  return (
    <div className="absolute right-4 bottom-[calc(100px+env(safe-area-inset-bottom))] z-10 flex flex-col gap-2.5 md:hidden">
      <MapStylePicker
        placement="above"
        buttonClassName="size-12 rounded-[14px] bg-branco shadow-[0_2px_0_#D3CBB9] aria-expanded:bg-asfalto aria-expanded:text-faixa"
      />
      <button
        type="button"
        aria-label="Ir para minha localização"
        aria-busy={locating}
        onClick={onLocate}
        className="flex size-12 items-center justify-center rounded-[14px] bg-branco text-andamento shadow-[0_2px_0_#D3CBB9]"
      >
        <StrokeIcon path={iconPaths.locate} size={20} strokeWidth={2.2} />
      </button>
    </div>
  )
}
