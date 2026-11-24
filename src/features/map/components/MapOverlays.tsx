import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { iconPaths } from '@/components/icons/paths'
import { statuses } from '@/domain/statuses'
import { StatusGlyph } from '@/components/icons/StatusGlyph'

export function StatusLegend() {
  return (
    <div className="absolute top-5 left-5 z-10 hidden items-center gap-3.5 rounded-control bg-branco px-3.5 py-2.5 text-[13px] font-semibold shadow-[0_2px_0_#D3CBB9] md:flex">
      {statuses.map((status) => (
        <span key={status.id} className="flex items-center gap-1.5">
          <span
            className="flex size-3.5 items-center justify-center rounded-full text-branco"
            style={{ backgroundColor: status.color }}
          >
            <StatusGlyph status={status.id} size={9} />
          </span>
          {status.label}
        </span>
      ))}
    </div>
  )
}

interface MapControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onLocate: () => void
  locating: boolean
}

export function MapControls({ onZoomIn, onZoomOut, onLocate, locating }: MapControlsProps) {
  const buttonClass = 'flex size-11 items-center justify-center hover:bg-concreto'
  return (
    <div className="absolute top-5 right-5 z-10 hidden flex-col overflow-hidden rounded-control bg-branco shadow-[0_2px_0_#D3CBB9] md:flex">
      <button type="button" aria-label="Aproximar" onClick={onZoomIn} className={buttonClass}>
        <StrokeIcon path="M12 5v14M5 12h14" size={18} strokeWidth={2.4} />
      </button>
      <span className="h-px bg-meio-fio" />
      <button type="button" aria-label="Afastar" onClick={onZoomOut} className={buttonClass}>
        <StrokeIcon path="M5 12h14" size={18} strokeWidth={2.4} />
      </button>
      <span className="h-px bg-meio-fio" />
      <button
        type="button"
        aria-label="Ir para minha localização"
        aria-busy={locating}
        onClick={onLocate}
        className={`${buttonClass} text-andamento`}
      >
        <StrokeIcon path={iconPaths.locate} size={18} strokeWidth={2.2} />
      </button>
    </div>
  )
}
