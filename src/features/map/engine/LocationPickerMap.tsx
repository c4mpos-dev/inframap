import 'mapbox-gl/dist/mapbox-gl.css'
import { useCallback, useImperativeHandle, useRef, type Ref } from 'react'
import MapGL, { AttributionControl, type MapRef } from 'react-map-gl/mapbox'
import type { LatLng } from '@/domain/types'
import { prefersReducedMotion } from '@/lib/motion'
import { applyDesignTheme } from './designTheme'
import { MapUnavailable } from './MapUnavailable'

const PICK_ZOOM = 16.5
const MAP_STYLE = 'mapbox://styles/mapbox/light-v11'

export interface LocationPickerHandle {
  moveTo: (location: LatLng) => void
}

interface LocationPickerMapProps {
  ref?: Ref<LocationPickerHandle>
  initialCenter: LatLng
  onMoveStart?: () => void
  onMoveEnd: (center: LatLng) => void
}

export function LocationPickerMap({
  ref,
  initialCenter,
  onMoveStart,
  onMoveEnd,
}: LocationPickerMapProps) {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  const mapRef = useRef<MapRef>(null)

  const moveTo = useCallback(({ lat, lng }: LatLng) => {
    mapRef.current?.easeTo({
      center: [lng, lat],
      zoom: Math.max(mapRef.current.getZoom(), PICK_ZOOM),
      duration: prefersReducedMotion() ? 0 : 600,
    })
  }, [])

  useImperativeHandle(ref, () => ({ moveTo }))

  const handleLoad = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return
    applyDesignTheme(map)
    const { lat, lng } = map.getCenter()
    onMoveEnd({ lat, lng })
  }, [onMoveEnd])

  if (!token) return <MapUnavailable />

  return (
    <MapGL
      ref={mapRef}
      mapboxAccessToken={token}
      mapStyle={MAP_STYLE}
      initialViewState={{
        latitude: initialCenter.lat,
        longitude: initialCenter.lng,
        zoom: PICK_ZOOM,
      }}
      attributionControl={false}
      onLoad={handleLoad}
      onMoveStart={(event) => {
        if (event.originalEvent) onMoveStart?.()
      }}
      onMoveEnd={(event) => {
        const { lat, lng } = event.target.getCenter()
        onMoveEnd({ lat, lng })
      }}
      onClick={(event) => moveTo({ lat: event.lngLat.lat, lng: event.lngLat.lng })}
      style={{ position: 'absolute', inset: 0 }}
    >
      <AttributionControl compact position="bottom-right" />
    </MapGL>
  )
}
