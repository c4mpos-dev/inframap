import { useNavigate, useParams } from 'react-router'
import { Toast } from '@/components/ui/Toast'
import { useToast } from '@/components/ui/useToast'
import { useOccurrences } from '@/data/useOccurrences'
import { MapView } from '@/features/map/engine/MapView'
import { DetailLoading, DetailMissing } from '@/features/occurrence-detail/components/DetailStates'
import { OccurrenceDetail } from '@/features/occurrence-detail/OccurrenceDetail'
import { useOccurrenceDetail } from '@/features/occurrence-detail/useOccurrenceDetail'
import { useIsDesktop } from '@/lib/useMediaQuery'

function DesktopContextMap({ selectedId }: { selectedId: string }) {
  const navigate = useNavigate()
  const { occurrences } = useOccurrences()

  return (
    <section aria-label="Mapa da ocorrência" className="relative min-w-0 flex-1 bg-mapa-fundo">
      <MapView
        occurrences={occurrences}
        selectedId={selectedId}
        onSelect={(id) => navigate(`/ocorrencia/${id}`)}
      />
    </section>
  )
}

export default function OccurrencePage() {
  const { id = '' } = useParams()
  const isDesktop = useIsDesktop()
  const { state, toggleConfirmation } = useOccurrenceDetail(id)
  const { toast, showToast } = useToast()

  const detail =
    state.status === 'loading' ? (
      <DetailLoading />
    ) : state.status === 'missing' ? (
      <DetailMissing />
    ) : (
      <OccurrenceDetail
        key={state.occurrence.id}
        occurrence={state.occurrence}
        nearby={state.nearby}
        onToggleConfirmation={toggleConfirmation}
        onNotify={showToast}
      />
    )

  return (
    <>
      {isDesktop ? (
        <div className="flex h-[calc(100dvh-4.25rem)]">
          <DesktopContextMap selectedId={id} />
          <div className="flex w-120 shrink-0 flex-col overflow-y-auto border-l border-linha bg-concreto">
            {detail}
          </div>
        </div>
      ) : (
        <div className="flex min-h-dvh flex-col">{detail}</div>
      )}
      <Toast toast={toast} />
    </>
  )
}
