import { useEffect, useRef } from 'react'
import { Link } from 'react-router'
import type { Occurrence } from '@/domain/types'

interface SuccessDialogProps {
  occurrence: Occurrence
  onStartOver: () => void
}

export function SuccessDialog({ occurrence, onStartOver }: SuccessDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    dialogRef.current?.showModal()
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="success-title"
      onCancel={(event) => event.preventDefault()}
      className="m-auto w-115 max-w-[calc(100%-48px)] animate-rise rounded-3xl border-2 border-faixa bg-asfalto p-8 text-concreto backdrop:bg-asfalto/60"
    >
      <div data-surface="dark" className="flex flex-col gap-4">
        <svg width="64" height="80" viewBox="0 0 32 40" aria-hidden="true">
          <path
            d="M16 1C8 1 2 7 2 14.5C2 24 16 38 16 38C16 38 30 24 30 14.5C30 7 24 1 16 1Z"
            fill="#FFC21A"
          />
          <path
            d="M10 15l4 4 8-8"
            fill="none"
            stroke="#1C1F1E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="font-mono text-sm text-faixa">{occurrence.protocol}</span>
        <h2 id="success-title" className="text-[40px] leading-[0.95] font-display">
          Tá no mapa!
        </h2>
        <p className="text-base leading-snug text-poeira">
          Agora a vizinhança pode confirmar. Quanto mais gente vê, mais força o relato ganha.
        </p>
        <div className="flex gap-2.5">
          <Link
            to={`/mapa?id=${occurrence.id}`}
            className="flex h-13 flex-1 items-center justify-center rounded-[14px] bg-faixa text-base font-extrabold text-asfalto no-underline"
          >
            Ver no mapa
          </Link>
          <button
            type="button"
            onClick={onStartOver}
            className="h-13 flex-1 rounded-[14px] border-2 border-grafite text-base font-bold text-concreto"
          >
            Marcar outro
          </button>
        </div>
      </div>
    </dialog>
  )
}
