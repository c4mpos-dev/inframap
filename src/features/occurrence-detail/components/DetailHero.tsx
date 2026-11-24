import { Link } from 'react-router'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder'
import type { Occurrence } from '@/domain/types'
import { shareOccurrence } from '../shareOccurrence'

interface DetailHeroProps {
  occurrence: Occurrence
  onLinkCopied: () => void
}

const darkButton =
  'absolute top-4 flex size-11 items-center justify-center rounded-[14px] bg-asfalto text-concreto'

export function DetailHero({ occurrence, onLinkCopied }: DetailHeroProps) {
  return (
    <div data-surface="dark" className="relative h-75 shrink-0">
      {occurrence.photoUrl ? (
        <img
          src={occurrence.photoUrl}
          alt={`Foto enviada pelo morador: ${occurrence.title}`}
          className="size-full object-cover"
        />
      ) : (
        <PhotoPlaceholder className="size-full" label="sem foto" />
      )}
      <Link
        to={`/mapa?id=${occurrence.id}`}
        aria-label="Voltar ao mapa"
        className={`${darkButton} left-4`}
      >
        <StrokeIcon path="M15 5l-7 7 7 7" size={20} strokeWidth={2.6} />
      </Link>
      <button
        type="button"
        aria-label="Compartilhar"
        onClick={async () => {
          if ((await shareOccurrence(occurrence)) === 'copied') onLinkCopied()
        }}
        className={`${darkButton} right-4`}
      >
        <StrokeIcon
          path="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5"
          size={18}
          strokeWidth={2.2}
        />
      </button>
    </div>
  )
}
