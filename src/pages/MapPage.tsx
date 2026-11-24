import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useOccurrences } from '@/data/useOccurrences'
import type { LatLng } from '@/domain/types'
import { Toast } from '@/components/ui/Toast'
import { useToast } from '@/components/ui/useToast'
import { DesktopMapPanel } from '@/features/map/components/DesktopMapPanel'
import { LocationNotice } from '@/features/map/components/LocationNotice'
import { MapControls, StatusLegend } from '@/features/map/components/MapOverlays'
import { MobileLocateButton } from '@/features/map/components/MobileLocateButton'
import { MobileMapTop } from '@/features/map/components/MobileMapTop'
import { MobileSelectedSheet } from '@/features/map/components/MobileSelectedSheet'
import { SelectedOccurrenceCard } from '@/features/map/components/SelectedOccurrenceCard'
import { MapView, type MapViewHandle } from '@/features/map/engine/MapView'
import { filterOccurrences } from '@/features/map/filterOccurrences'
import { useMapFilters } from '@/features/map/useMapFilters'
import { useUserLocation } from '@/features/map/useUserLocation'

export default function MapPage() {
  const mapRef = useRef<MapViewHandle>(null)
  const { occurrences, state, toggleConfirmation } = useOccurrences()
  const { filters, selectedId, select, ...filterActions } = useMapFilters()
  const { toast, showToast } = useToast()

  const flyTo = useCallback((location: LatLng) => mapRef.current?.flyTo(location), [])
  const userLocation = useUserLocation(flyTo)

  const visible = useMemo(() => filterOccurrences(occurrences, filters), [occurrences, filters])
  const selected = visible.find((occurrence) => occurrence.id === selectedId) ?? null

  useEffect(() => {
    if (!selectedId) return
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return
      document.querySelector<HTMLElement>('.mapboxgl-marker [aria-pressed="true"]')?.focus()
      select(null)
    }
    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [selectedId, select])

  return (
    <div className="fixed inset-0 flex md:relative md:inset-auto md:h-[calc(100dvh-4.25rem)]">
      <DesktopMapPanel
        filters={filters}
        actions={filterActions}
        occurrences={visible}
        loading={state === 'loading'}
        selectedId={selectedId}
        onSelect={select}
      />

      <section aria-label="Mapa de ocorrências" className="relative min-w-0 flex-1 bg-mapa-fundo">
        <MapView
          ref={mapRef}
          occurrences={visible}
          selectedId={selectedId}
          onSelect={select}
          onBackgroundClick={() => select(null)}
          userLocation={userLocation.location}
        />

        <StatusLegend />
        <MapControls
          onZoomIn={() => mapRef.current?.zoomIn()}
          onZoomOut={() => mapRef.current?.zoomOut()}
          onLocate={userLocation.locate}
          locating={userLocation.locating}
        />
        <MobileMapTop filters={filters} actions={filterActions} />
        <MobileLocateButton
          raised={selected !== null}
          onLocate={userLocation.locate}
          locating={userLocation.locating}
        />

        {userLocation.error && (
          <LocationNotice message={userLocation.error} onDismiss={userLocation.dismissError} />
        )}

        {selected && (
          <>
            <SelectedOccurrenceCard
              occurrence={selected}
              onClose={() => select(null)}
              onToggleConfirmation={() => toggleConfirmation(selected.id)}
              onLinkCopied={() => showToast('Link copiado.')}
            />
            <MobileSelectedSheet
              occurrence={selected}
              onToggleConfirmation={() => toggleConfirmation(selected.id)}
            />
          </>
        )}
      </section>

      <Toast toast={toast} />
    </div>
  )
}
