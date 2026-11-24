import { Link } from 'react-router'
import type { Occurrence } from '@/domain/types'
import { LandingPin } from './LandingPin'

interface MobileSuccessProps {
  occurrence: Occurrence
  onShare: () => void
}

export function MobileSuccess({ occurrence, onShare }: MobileSuccessProps) {
  return (
    <div
      data-surface="dark"
      className="flex min-h-dvh flex-col gap-5 bg-asfalto px-5 pt-8 pb-[calc(24px+env(safe-area-inset-bottom))] text-concreto"
    >
      <div className="flex flex-1 items-center justify-center">
        <LandingPin width={150} />
      </div>
      <div className="flex flex-col gap-2.5" role="status">
        <span className="font-mono text-sm text-faixa">{occurrence.protocol}</span>
        <h1 className="text-[40px] leading-[0.95] font-display">Tá no mapa!</h1>
        <p className="text-base leading-snug text-poeira">
          Agora a vizinhança pode confirmar. Quanto mais gente vê, mais força o relato ganha na hora
          de levar à prefeitura.
        </p>
      </div>
      <div className="flex flex-col gap-2.5">
        <Link
          to={`/mapa?id=${occurrence.id}`}
          className="flex h-13.5 items-center justify-center rounded-[14px] bg-faixa text-base font-extrabold text-asfalto no-underline"
        >
          Ver no mapa
        </Link>
        <button
          type="button"
          onClick={onShare}
          className="h-13.5 rounded-[14px] border-2 border-grafite text-base font-bold text-concreto"
        >
          Compartilhar com o bairro
        </button>
      </div>
    </div>
  )
}
