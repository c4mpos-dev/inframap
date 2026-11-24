import { useRef } from 'react'
import { StrokeIcon } from '@/components/icons/StrokeIcon'

interface ZoomablePhotoProps {
  src: string
  alt: string
  /** Classes for the cropped preview (size, radius). The full photo opens on click. */
  className?: string
  /** Where the "Ver foto" chip sits, when something overlaps the default corner. */
  badgeClassName?: string
}

const EXPAND_PATH = 'M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5'

/**
 * Thumbnails crop photos to fit the layout. Clicking opens the whole photo,
 * uncropped, over a dark backdrop; Esc, the close button or a click outside closes it.
 */
export function ZoomablePhoto({
  src,
  alt,
  className = '',
  badgeClassName = 'right-3 bottom-3',
}: ZoomablePhotoProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const close = () => dialogRef.current?.close()

  return (
    <>
      <button
        type="button"
        onClick={() => dialogRef.current?.showModal()}
        aria-label={`Ver a foto inteira: ${alt}`}
        className={`group relative block cursor-zoom-in overflow-hidden ${className}`}
      >
        <img src={src} alt="" className="size-full object-cover" />
        <span
          aria-hidden="true"
          className={`absolute ${badgeClassName} flex items-center gap-1.5 rounded-full bg-asfalto/85 px-2.5 py-1.5 text-xs font-bold text-concreto transition-transform group-hover:scale-105`}
        >
          <StrokeIcon path={EXPAND_PATH} size={14} strokeWidth={2.4} />
          Ver foto
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label={alt}
        className="m-0 h-dvh max-h-none w-full max-w-none bg-asfalto/95 p-0 backdrop:bg-asfalto/80"
      >
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={close}
          className="absolute inset-0 size-full cursor-zoom-out"
        />
        <div className="pointer-events-none relative flex size-full items-center justify-center p-4 md:p-10">
          <img
            src={src}
            alt={alt}
            className="pointer-events-auto max-h-full max-w-full rounded-[14px] object-contain shadow-[0_18px_40px_rgba(0,0,0,0.45)]"
          />
        </div>
        <div className="absolute top-4 right-4 flex gap-2">
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="flex h-11 items-center rounded-[14px] bg-concreto px-4 text-sm font-bold text-asfalto no-underline"
          >
            Abrir original
          </a>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar foto"
            className="flex size-11 items-center justify-center rounded-[14px] bg-concreto text-asfalto"
          >
            <StrokeIcon path="M6 6l12 12M18 6L6 18" size={16} strokeWidth={2.8} />
          </button>
        </div>
      </dialog>
    </>
  )
}
