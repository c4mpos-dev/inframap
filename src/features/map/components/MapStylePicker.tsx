import { useEffect, useId, useRef, useState } from 'react'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { mapStyles } from '../engine/mapStyles'
import { useMapStyle } from '../useMapStyle'

const LAYERS_PATH = 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5'

interface MapStylePickerProps {
  /** Where the menu opens relative to the button. */
  placement: 'left' | 'above'
  className?: string
  buttonClassName?: string
}

export function MapStylePicker({
  placement,
  className = '',
  buttonClassName = '',
}: MapStylePickerProps) {
  const [styleId, setStyleId] = useMapStyle()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const menuId = useId()

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      event.preventDefault()
      setOpen(false)
      rootRef.current?.querySelector<HTMLButtonElement>('button')?.focus()
    }
    document.addEventListener('pointerdown', closeOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  const menuPosition =
    placement === 'left' ? 'top-0 right-[calc(100%+10px)]' : 'right-0 bottom-[calc(100%+10px)]'

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        aria-label="Tipo de mapa"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
        className={`flex items-center justify-center ${buttonClassName}`}
      >
        <StrokeIcon path={LAYERS_PATH} size={19} strokeWidth={2.1} />
      </button>
      {open && (
        <div
          id={menuId}
          role="radiogroup"
          aria-label="Tipo de mapa"
          className={`absolute ${menuPosition} z-20 grid w-max animate-rise grid-cols-3 gap-2 rounded-card border-2 border-asfalto bg-branco p-2.5 shadow-hard`}
        >
          {mapStyles.map((style) => {
            const selected = style.id === styleId
            return (
              <button
                key={style.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => {
                  setStyleId(style.id)
                  setOpen(false)
                }}
                className={`flex w-24 flex-col gap-1.5 rounded-control border-2 p-1.5 text-left text-[13px] font-bold transition-colors ${
                  selected ? 'border-asfalto bg-concreto' : 'border-transparent hover:bg-concreto'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="relative block h-12 overflow-hidden rounded-lg"
                  style={{
                    background: `linear-gradient(135deg, ${style.swatch[0]} 55%, ${style.swatch[1]} 55%)`,
                  }}
                >
                  <span
                    className="absolute top-1/2 -right-2 -left-2 h-1 -rotate-12"
                    style={{
                      background:
                        'repeating-linear-gradient(90deg, var(--color-faixa) 0 9px, transparent 9px 15px)',
                    }}
                  />
                </span>
                {style.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
