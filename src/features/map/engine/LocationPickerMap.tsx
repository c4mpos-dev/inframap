import 'mapbox-gl/dist/mapbox-gl.css'
import { useCallback, useEffect, useImperativeHandle, useRef, type Ref } from 'react'
import MapGL, { AttributionControl, type MapRef } from 'react-map-gl/mapbox'
import type { LatLng } from '@/domain/types'
import { prefersReducedMotion } from '@/lib/motion'
import { getMapStyle, themeMapStyle } from './mapStyles'
import { useMapStyle } from '../useMapStyle'
import { MapUnavailable } from './MapUnavailable'

const PICK_ZOOM = 16.5

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
  const [styleId] = useMapStyle()
  const styleIdRef = useRef(styleId)
  useEffect(() => {
    styleIdRef.current = styleId
  }, [styleId])

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
    themeMapStyle(map, styleIdRef.current)
    map.on('style.load', () => themeMapStyle(map, styleIdRef.current))
    const { lat, lng } = map.getCenter()
    onMoveEnd({ lat, lng })
  }, [onMoveEnd])

  if (!token) return <MapUnavailable />

  return (
    <MapGL
      ref={mapRef}
      mapboxAccessToken={token}
      mapStyle={getMapStyle(styleId).url}
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
