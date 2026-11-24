import { useState } from 'react'
import type { NearbyOccurrence } from '@/data/occurrencesRepo'
import { occurrencesRepo } from '@/data/occurrencesRepo'
import type { Occurrence } from '@/domain/types'
import { useAccountGuard } from '@/features/auth/useAccountGuard'
import { ConfirmPanel } from './components/ConfirmPanel'
import { DetailHeader } from './components/DetailHeader'
import { DetailHero } from './components/DetailHero'
import { NearbyList } from './components/NearbyList'
import { ReportDialog } from './components/ReportDialog'
import { ResidentStory } from './components/ResidentStory'
import { StatusTimeline } from './components/StatusTimeline'
import { useDistanceFromUser } from './useDistanceFromUser'

interface OccurrenceDetailProps {
  occurrence: Occurrence
  nearby: NearbyOccurrence[]
  onToggleConfirmation: () => void
  onNotify: (message: string) => void
}

export function OccurrenceDetail({
  occurrence,
  nearby,
  onToggleConfirmation,
  onNotify,
}: OccurrenceDetailProps) {
  const [reporting, setReporting] = useState(false)
  const distance = useDistanceFromUser(occurrence.location)
  const guard = useAccountGuard()

  return (
    <article className="flex flex-col">
      <DetailHero occurrence={occurrence} onLinkCopied={() => onNotify('Link copiado.')} />
      <div className="relative -mt-6 flex flex-col gap-5.5 rounded-t-3xl bg-concreto px-5 pt-5.5 pb-8">
        <DetailHeader occurrence={occurrence} distanceMeters={distance} />
        <ConfirmPanel
          confirmed={occurrence.confirmedByMe}
          count={occurrence.confirmations}
          onToggle={onToggleConfirmation}
        />
        <ResidentStory occurrence={occurrence} />
        <StatusTimeline occurrence={occurrence} />
        <NearbyList nearby={nearby} />
        <button
          type="button"
          onClick={() => guard(() => setReporting(true))}
          className="self-center py-3 text-sm text-brita underline hover:text-asfalto"
        >
          Denunciar foto ou texto impróprio
        </button>
      </div>
      {reporting && (
        <ReportDialog
          onClose={() => setReporting(false)}
          onSubmit={async (reason, details) => {
            await occurrencesRepo.report(occurrence.id, reason, details)
            setReporting(false)
            onNotify('Denúncia enviada. A equipe vai olhar.')
          }}
        />
      )}
    </article>
  )
}
