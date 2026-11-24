import 'mapbox-gl/dist/mapbox-gl.css'
import { useCallback, useEffect, useImperativeHandle, useRef, type Ref } from 'react'
import MapGL, { AttributionControl, Marker, type MapRef } from 'react-map-gl/mapbox'
import { prefersReducedMotion } from '@/lib/motion'
import { RESENDE_CENTER } from '@/domain/resende'
import type { LatLng, Occurrence } from '@/domain/types'
import { MapPin } from '@/components/ui/MapPin'
import { applyDesignTheme } from './designTheme'
import { MapUnavailable } from './MapUnavailable'
import { UserLocationDot } from './UserLocationDot'
import { addViaDutraLayer } from './viaDutraLayer'

const INITIAL_ZOOM = 13.2
const FOCUS_ZOOM = 15
const MAP_STYLE = 'mapbox://styles/mapbox/light-v11'

export interface MapViewHandle {
  zoomIn: () => void
  zoomOut: () => void
  flyTo: (location: LatLng) => void
}

interface MapViewProps {
  ref?: Ref<MapViewHandle>
  occurrences: Occurrence[]
  selectedId: string | null
  onSelect: (id: string) => void
  onBackgroundClick?: () => void
  userLocation?: LatLng | null
  pinWidth?: number
}

export function MapView({
  ref,
  occurrences,
  selectedId,
  onSelect,
  onBackgroundClick,
  userLocation = null,
  pinWidth = 40,
}: MapViewProps) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  const mapRef = useRef<MapRef>(null)
  const stopDashRef = useRef<() => void>(() => {})

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    flyTo: ({ lat, lng }) => {
      const map = mapRef.current
      if (!map) return
      map.flyTo({
        center: [lng, lat],
        zoom: Math.max(map.getZoom(), FOCUS_ZOOM),
        duration: prefersReducedMotion() ? 0 : 900,
      })
    },
  }))

  const handleLoad = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    applyDesignTheme(map)
    stopDashRef.current = addViaDutraLayer(map, !prefersReducedMotion())
  }, [])

  useEffect(() => () => stopDashRef.current(), [])

  if (!token) return <MapUnavailable />

  return (
    <MapGL
      ref={mapRef}
      mapboxAccessToken={token}
      mapStyle={MAP_STYLE}
      initialViewState={{
        latitude: RESENDE_CENTER.lat,
        longitude: RESENDE_CENTER.lng,
        zoom: INITIAL_ZOOM,
      }}
      attributionControl={false}
      onLoad={handleLoad}
      onClick={onBackgroundClick}
      style={{ position: 'absolute', inset: 0 }}
    >
      <AttributionControl compact position="bottom-right" />
      {occurrences.map((occurrence, index) => {
        const selected = occurrence.id === selectedId
        return (
          <Marker
            key={occurrence.id}
            latitude={occurrence.location.lat}
            longitude={occurrence.location.lng}
            anchor="bottom"
            style={{ zIndex: selected ? 5 : 1 }}
            onClick={(event) => {
              event.originalEvent.stopPropagation()
              onSelect(occurrence.id)
            }}
          >
            <button
              type="button"
              aria-label={occurrence.title}
              aria-pressed={selected}
              className="block cursor-pointer rounded-md"
            >
              <MapPin
                categoryId={occurrence.categoryId}
                status={occurrence.status}
                selected={selected}
                dropDelayMs={index * 70}
                width={pinWidth}
              />
            </button>
          </Marker>
        )
      })}
      {userLocation && (
        <Marker latitude={userLocation.lat} longitude={userLocation.lng} anchor="center">
          <UserLocationDot />
        </Marker>
      )}
    </MapGL>
  )
}
