import { Link } from 'react-router'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { ConfirmButton } from '@/components/ui/ConfirmButton'
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder'
import { ZoomablePhoto } from '@/components/ui/ZoomablePhoto'
import { ShareButton } from '@/components/ui/ShareButton'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { StatusProgress } from '@/components/ui/StatusProgress'
import { getCategory } from '@/domain/categories'
import { formatRelativeDay } from '@/domain/relativeTime'
import type { Occurrence } from '@/domain/types'

interface SelectedOccurrenceCardProps {
  occurrence: Occurrence
  onClose: () => void
  onToggleConfirmation: () => void
  onLinkCopied: () => void
}

export function SelectedOccurrenceCard({
  occurrence,
  onClose,
  onToggleConfirmation,
  onLinkCopied,
}: SelectedOccurrenceCardProps) {
  return (
    <article
      key={occurrence.id}
      aria-label="Ocorrência selecionada"
      className="absolute bottom-7 left-5 z-10 hidden w-95 max-w-[calc(100%-40px)] animate-rise overflow-hidden rounded-card border-2 border-asfalto bg-branco shadow-[0_3px_0_var(--color-asfalto),0_18px_40px_rgba(28,31,30,0.18)] md:block"
    >
      <div className="relative">
        {occurrence.photoUrl ? (
          <ZoomablePhoto
            src={occurrence.photoUrl}
            alt={`Foto enviada pelo morador: ${occurrence.title}`}
            className="h-33 w-full"
          />
        ) : (
          <PhotoPlaceholder className="h-33" label="sem foto" />
        )}
        <span className="absolute top-3 left-3">
          <StatusBadge status={occurrence.status} />
        </span>
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="absolute top-2.5 right-2.5 flex size-9 items-center justify-center rounded-full bg-asfalto text-concreto"
        >
          <StrokeIcon path="M6 6l12 12M18 6L6 18" size={14} strokeWidth={3} />
        </button>
      </div>
      <div className="flex flex-col gap-3.5 px-5 pt-4.5 pb-5">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-xs text-brita">
            {occurrence.protocol} · {getCategory(occurrence.categoryId).shortLabel}
          </span>
          <h2 className="text-[22px] leading-tight font-extrabold [font-stretch:110%]">
            <Link
              to={`/ocorrencia/${occurrence.id}`}
              className="text-asfalto no-underline hover:underline"
            >
              {occurrence.title}
            </Link>
          </h2>
          <span className="text-sm text-brita">
            {occurrence.neighborhood} · registrado {formatRelativeDay(occurrence.createdAt)}
          </span>
        </div>
        <StatusProgress status={occurrence.status} />
        <div className="flex gap-2.5">
          <ConfirmButton
            className="flex-1"
            confirmed={occurrence.confirmedByMe}
            count={occurrence.confirmations}
            onToggle={onToggleConfirmation}
          />
          <Link
            to={`/ocorrencia/${occurrence.id}`}
            className="flex h-12 items-center rounded-control border-2 border-asfalto bg-branco px-4 text-[15px] font-bold text-asfalto no-underline hover:bg-concreto"
          >
            Detalhes
          </Link>
          <ShareButton
            title={occurrence.title}
            path={`/ocorrencia/${occurrence.id}`}
            onCopied={onLinkCopied}
          />
        </div>
      </div>
    </article>
  )
}
