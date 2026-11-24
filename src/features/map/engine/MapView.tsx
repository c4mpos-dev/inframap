import 'mapbox-gl/dist/mapbox-gl.css'
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import MapGL, { AttributionControl, Marker, type MapRef } from 'react-map-gl/mapbox'
import type { Marker as MapboxMarker } from 'mapbox-gl'
import { prefersReducedMotion } from '@/lib/motion'
import { getCategory } from '@/domain/categories'
import { getStatus } from '@/domain/statuses'
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
const DESKTOP_FOCUS_PADDING = { top: 80, bottom: 80, left: 80, right: 80 }
const MOBILE_FOCUS_PADDING = { top: 140, bottom: 300, left: 40, right: 40 }

// Mapbox wraps every marker in role="img" aria-label="Map marker", which hides
// the pin button inside it from screen readers.
function unwrapMarker(marker: MapboxMarker | null) {
  const element = marker?.getElement()
  element?.removeAttribute('role')
  element?.removeAttribute('aria-label')
}

function describePin(occurrence: Occurrence): string {
  return `${occurrence.title}. ${getCategory(occurrence.categoryId).label}, ${getStatus(occurrence.status).label.toLowerCase()}`
}

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
  const [loaded, setLoaded] = useState(false)

  const flyTo = useCallback(({ lat, lng }: LatLng) => {
    const map = mapRef.current
    if (!map) return
    map.flyTo({
      center: [lng, lat],
      zoom: Math.max(map.getZoom(), FOCUS_ZOOM),
      padding: window.matchMedia('(min-width: 768px)').matches
        ? DESKTOP_FOCUS_PADDING
        : MOBILE_FOCUS_PADDING,
      duration: prefersReducedMotion() ? 0 : 900,
    })
  }, [])

  useImperativeHandle(ref, () => ({
    zoomIn: () => mapRef.current?.zoomIn(),
    zoomOut: () => mapRef.current?.zoomOut(),
    flyTo,
  }))

  const selectedLocation = occurrences.find((item) => item.id === selectedId)?.location
  const selectedLat = selectedLocation?.lat
  const selectedLng = selectedLocation?.lng

  useEffect(() => {
    if (loaded && selectedLat !== undefined && selectedLng !== undefined) {
      flyTo({ lat: selectedLat, lng: selectedLng })
    }
  }, [loaded, selectedLat, selectedLng, flyTo])

  const handleLoad = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    applyDesignTheme(map)
    stopDashRef.current = addViaDutraLayer(map, !prefersReducedMotion())
    setLoaded(true)
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
            ref={unwrapMarker}
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
              aria-label={describePin(occurrence)}
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
        <Marker
          ref={unwrapMarker}
          latitude={userLocation.lat}
          longitude={userLocation.lng}
          anchor="center"
        >
          <UserLocationDot />
        </Marker>
      )}
    </MapGL>
  )
}
