import { Link } from 'react-router'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { ConfirmButton } from '@/components/ui/ConfirmButton'
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { formatRelativeDay } from '@/domain/relativeTime'
import type { Occurrence } from '@/domain/types'

interface MobileSelectedSheetProps {
  occurrence: Occurrence
  onToggleConfirmation: () => void
}

export function MobileSelectedSheet({
  occurrence,
  onToggleConfirmation,
}: MobileSelectedSheetProps) {
  return (
    <div className="absolute inset-x-0 bottom-[calc(84px+env(safe-area-inset-bottom))] z-10 px-3 md:hidden">
      <BottomSheet key={occurrence.id} label="Ocorrência selecionada">
        <div className="flex items-start gap-3">
          {occurrence.photoUrl ? (
            <img
              src={occurrence.photoUrl}
              alt=""
              className="size-18 shrink-0 rounded-[14px] object-cover"
            />
          ) : (
            <PhotoPlaceholder className="size-18 shrink-0 rounded-[14px]" />
          )}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <StatusBadge status={occurrence.status} size="sm" />
            <h2 className="text-lg leading-tight font-extrabold [font-stretch:108%]">
              {occurrence.title}
            </h2>
            <span className="text-[13px] text-brita">
              {occurrence.neighborhood} · {formatRelativeDay(occurrence.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <ConfirmButton
            className="flex-1 shadow-none"
            confirmed={occurrence.confirmedByMe}
            count={occurrence.confirmations}
            onToggle={onToggleConfirmation}
          />
          <Link
            to={`/ocorrencia/${occurrence.id}`}
            className="flex h-12 items-center rounded-control border-2 border-asfalto bg-branco px-4 text-[15px] font-bold text-asfalto no-underline"
          >
            Detalhes
          </Link>
        </div>
      </BottomSheet>
    </div>
  )
}
