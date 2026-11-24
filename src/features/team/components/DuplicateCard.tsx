import type { NearbyOccurrence } from '@/data/occurrencesRepo'

interface DuplicateCardProps {
  candidate: NearbyOccurrence
  onMerge: () => void
  onDismiss: () => void
}

export function DuplicateCard({ candidate, onMerge, onDismiss }: DuplicateCardProps) {
  const { occurrence, distanceMeters } = candidate
  return (
    <div className="flex flex-col gap-2.5 rounded-[14px] bg-[#FFF4D1] p-3.5">
      <strong className="text-sm">
        Possível duplicado a {Math.max(1, Math.round(distanceMeters))} m
      </strong>
      <span className="text-[13px] text-carvao">
        {occurrence.protocol} · {occurrence.title} · {occurrence.confirmations} viram
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onMerge}
          className="h-10 flex-1 rounded-[10px] bg-asfalto text-[13px] font-extrabold text-faixa"
        >
          Juntar os dois
        </button>
        <button
          type="button"
          onClick={onDismiss}
          className="h-10 flex-1 rounded-[10px] border-[1.5px] border-asfalto text-[13px] font-bold"
        >
          São diferentes
        </button>
      </div>
    </div>
  )
}
