import { useRef, type ChangeEvent } from 'react'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { iconPaths } from '@/components/icons/paths'

const CAMERA_PATH = 'M3 8h3l2-3h8l2 3h3v11H3zM12 9.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z'
const GALLERY_PATH =
  'M3 4h18v16H3zM3 16l5-5 4 4 3-3 6 6M15.5 7a1.5 1.5 0 1 0 0 3a1.5 1.5 0 1 0 0-3z'
const PRIVACY_NOTE = 'A foto fica pública. Evite rostos e placas de carro.'

interface PhotoPickerProps {
  photoUrl: string | null
  processing: boolean
  failed: boolean
  onChoose: (file: File) => void
  onRemove: () => void
  variant: 'mobile' | 'desktop'
}

export function PhotoPicker({
  photoUrl,
  processing,
  failed,
  onChoose,
  onRemove,
  variant,
}: PhotoPickerProps) {
  const cameraRef = useRef<HTMLInputElement>(null)
  const galleryRef = useRef<HTMLInputElement>(null)

  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) onChoose(file)
    event.target.value = ''
  }

  const inputs = (
    <>
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={handleFile}
      />
      <input ref={galleryRef} type="file" accept="image/*" hidden onChange={handleFile} />
    </>
  )

  if (photoUrl) {
    return (
      <div className="flex flex-col gap-2">
        <div
          className={`relative overflow-hidden rounded-[18px] ${variant === 'mobile' ? 'h-45' : 'h-40'}`}
        >
          <img
            src={photoUrl}
            alt="Foto escolhida para o relato"
            className="size-full object-cover"
          />
          <button
            type="button"
            aria-label="Remover foto"
            onClick={onRemove}
            className="absolute top-2.5 right-2.5 flex size-9 items-center justify-center rounded-full bg-asfalto text-concreto"
          >
            <StrokeIcon path={iconPaths.close} size={14} strokeWidth={3} />
          </button>
        </div>
        <p className="text-[13px] text-carvao">{PRIVACY_NOTE}</p>
      </div>
    )
  }

  const status = processing
    ? 'Preparando a foto…'
    : failed
      ? 'Não deu para abrir essa foto. Tente outra.'
      : null

  if (variant === 'desktop') {
    return (
      <div className="flex flex-col gap-2">
        {inputs}
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          disabled={processing}
          className="flex h-30 items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#A39C8D] bg-branco text-asfalto hover:bg-concreto"
        >
          <StrokeIcon path={CAMERA_PATH} size={28} />
          <span className="flex flex-col text-left">
            <strong className="text-[15px]">{status ?? 'Escolher uma foto'}</strong>
            <span className="text-[13px] text-carvao">Opcional, mas ajuda muito</span>
          </span>
        </button>
        <p className="text-[13px] text-carvao">{PRIVACY_NOTE}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {inputs}
      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => cameraRef.current?.click()}
          disabled={processing}
          className="flex h-37 flex-col items-center justify-center gap-2.5 rounded-[18px] border-2 border-dashed border-asfalto bg-faixa text-asfalto"
        >
          <StrokeIcon path={CAMERA_PATH} size={34} />
          <strong className="text-[15px] font-extrabold">Tirar foto</strong>
        </button>
        <button
          type="button"
          onClick={() => galleryRef.current?.click()}
          disabled={processing}
          className="flex h-37 flex-col items-center justify-center gap-2.5 rounded-[18px] border-2 border-dashed border-[#A39C8D] bg-branco text-asfalto"
        >
          <StrokeIcon path={GALLERY_PATH} size={34} />
          <strong className="text-[15px] font-bold">Da galeria</strong>
        </button>
      </div>
      <p aria-live="polite" className="text-[13px] text-carvao">
        {status ?? PRIVACY_NOTE}
      </p>
    </div>
  )
}
