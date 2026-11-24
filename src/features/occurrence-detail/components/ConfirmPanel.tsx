import { useState } from 'react'
import { StrokeIcon } from '@/components/icons/StrokeIcon'

const EYE_PATH =
  'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z'

interface ConfirmPanelProps {
  confirmed: boolean
  count: number
  onToggle: () => void
}

export function ConfirmPanel({ confirmed, count, onToggle }: ConfirmPanelProps) {
  const [pops, setPops] = useState(0)

  return (
    <div className="flex items-center gap-3.5 rounded-[18px] border-2 border-asfalto bg-branco p-3.5 shadow-hard">
      <div className="flex flex-1 flex-col gap-0.5" aria-live="polite">
        <span className="font-mono text-[28px] leading-none font-semibold">{count}</span>
        <span className="text-[13px] text-brita">
          {count === 1 ? 'vizinho também viu' : 'vizinhos também viram'}
        </span>
      </div>
      <button
        key={pops}
        type="button"
        aria-pressed={confirmed}
        onClick={() => {
          setPops((value) => value + 1)
          onToggle()
        }}
        className={`flex h-13 items-center gap-2 rounded-[14px] border-2 border-asfalto px-4.5 text-[15px] font-extrabold ${
          pops > 0 ? 'animate-pop' : ''
        } ${confirmed ? 'bg-asfalto text-faixa' : 'bg-faixa text-asfalto'}`}
      >
        <StrokeIcon path={EYE_PATH} size={18} strokeWidth={2.4} />
        {confirmed ? 'Você confirmou' : 'Eu também vi'}
      </button>
    </div>
  )
}
