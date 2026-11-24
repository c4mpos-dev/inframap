import type { NearbyOccurrence } from '@/data/occurrencesRepo'
import { StrokeIcon } from '@/components/icons/StrokeIcon'

interface DuplicateNoticeProps {
  nearby: NearbyOccurrence
  onConfirmExisting: () => void
}

export function DuplicateNotice({ nearby, onConfirmExisting }: DuplicateNoticeProps) {
  const { occurrence, distanceMeters } = nearby
  const confirmations =
    occurrence.confirmations === 1 ? '1 confirmação' : `${occurrence.confirmations} confirmações`

  return (
    <div
      role="status"
      className="flex flex-col gap-2.5 rounded-2xl border-2 border-asfalto bg-[#FFF4D1] p-3.5"
    >
      <div className="flex items-start gap-2.5">
        <StrokeIcon path="M12 3L21.5 19.5H2.5zM12 9.5v4.5M12 16.6v.4" className="shrink-0" />
        <span className="flex flex-col gap-0.5">
          <strong className="text-[15px]">
            Já marcaram algo parecido a {Math.max(1, Math.round(distanceMeters))} m
          </strong>
          <span className="text-[13px] text-carvao">
            “{occurrence.title}” · {confirmations}
          </span>
        </span>
      </div>
      <button
        type="button"
        onClick={onConfirmExisting}
        className="h-11 rounded-control bg-asfalto text-sm font-extrabold text-faixa"
      >
        É esse mesmo, só confirmar
      </button>
    </div>
  )
}
