import { useCallback, useEffect, useRef } from 'react'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { iconPaths } from '@/components/icons/paths'
import { RESENDE_CENTER } from '@/domain/resende'
import { formatCoordinates } from '@/domain/geo'
import {
  LocationPickerMap,
  type LocationPickerHandle,
} from '@/features/map/engine/LocationPickerMap'
import type { MarkProblemForm } from '../useMarkProblemForm'
import { useGpsFix } from '../useGpsFix'
import { CenterPin } from './CenterPin'

interface LocationStepProps {
  form: MarkProblemForm
  variant: 'mobile' | 'desktop'
}

const gpsMessages = {
  denied: 'Sem permissão de localização. Arraste o mapa até o ponto do problema.',
  unavailable: 'Não deu para achar sua localização. Arraste o mapa até o ponto do problema.',
}

export function LocationStep({ form, variant }: LocationStepProps) {
  const pickerRef = useRef<LocationPickerHandle>(null)
  const { status, requestFix } = useGpsFix()
  const { draft, setLocation, setGpsAccuracy, markLocationAsManual } = form

  const locateUser = useCallback(async () => {
    const fix = await requestFix()
    if (!fix) return
    setGpsAccuracy(fix.accuracyMeters)
    pickerRef.current?.moveTo(fix.location)
  }, [requestFix, setGpsAccuracy])

  const alreadyLocated = useRef(draft.location !== null)
  useEffect(() => {
    if (!alreadyLocated.current) locateUser()
  }, [locateUser])

  const details = draft.location
    ? [
        formatCoordinates(draft.location),
        draft.locationSource === 'gps' && draft.accuracyMeters !== null
          ? `GPS ±${draft.accuracyMeters} m`
          : null,
      ]
        .filter(Boolean)
        .join(' · ')
    : 'Procurando o ponto…'
  const gpsMessage = status === 'denied' || status === 'unavailable' ? gpsMessages[status] : null
  const mobile = variant === 'mobile'

  return (
    <div className="relative h-full min-h-0 flex-1 overflow-hidden bg-mapa-fundo">
      <LocationPickerMap
        ref={pickerRef}
        initialCenter={draft.location ?? RESENDE_CENTER}
        onMoveStart={markLocationAsManual}
        onMoveEnd={setLocation}
      />
      <CenterPin size={mobile ? 'md' : 'lg'} top={mobile ? '40%' : '46%'} />

      <span
        className={`pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-full bg-asfalto whitespace-nowrap text-concreto ${
          mobile
            ? 'top-4 px-3 py-2 text-[13px] font-semibold'
            : 'bottom-7 px-4 py-2.5 text-sm font-semibold'
        }`}
      >
        {mobile
          ? 'Arraste o mapa até o ponto exato'
          : 'Clique no mapa ou arraste até o ponto exato'}
      </span>

      <div
        className={
          mobile
            ? 'absolute inset-x-3 bottom-3 flex flex-col gap-2.5 rounded-[18px] border-2 border-asfalto bg-branco p-3.5'
            : 'absolute top-6 left-6 flex max-w-[calc(100%-48px)] flex-col gap-2.5 rounded-[14px] border-2 border-asfalto bg-branco px-4 py-3 shadow-hard'
        }
      >
        <div className="flex items-center gap-2.5" aria-live="polite">
          <StrokeIcon
            path={iconPaths.locate}
            size={22}
            strokeWidth={2.2}
            className="shrink-0 text-andamento"
          />
          <span className="flex min-w-0 flex-col">
            <strong className="text-[15px]">{draft.place?.label ?? 'Resende'}</strong>
            <span className="font-mono text-xs text-brita">{details}</span>
          </span>
        </div>
        {gpsMessage && <p className="text-[13px] text-carvao">{gpsMessage}</p>}
        {mobile && (
          <button
            type="button"
            onClick={locateUser}
            disabled={status === 'locating'}
            className="h-11 rounded-control border-[1.5px] border-[#CFC8B8] bg-concreto text-sm font-bold text-asfalto disabled:text-brita"
          >
            {status === 'locating' ? 'Procurando você…' : 'Usar minha localização de novo'}
          </button>
        )}
      </div>
    </div>
  )
}
