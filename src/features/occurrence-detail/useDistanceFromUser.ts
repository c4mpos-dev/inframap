import { useEffect, useState } from 'react'
import { distanceInMeters } from '@/domain/geo'
import type { LatLng } from '@/domain/types'

export function useDistanceFromUser(target: LatLng | null): number | null {
  const [distance, setDistance] = useState<number | null>(null)
  const lat = target?.lat
  const lng = target?.lng

  useEffect(() => {
    if (lat === undefined || lng === undefined || !navigator.permissions) return
    let active = true
    navigator.permissions
      .query({ name: 'geolocation' })
      .then((permission) => {
        if (permission.state !== 'granted') return
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            if (active) {
              setDistance(
                distanceInMeters({ lat: coords.latitude, lng: coords.longitude }, { lat, lng }),
              )
            }
          },
          () => undefined,
          { maximumAge: 120000, timeout: 8000 },
        )
      })
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [lat, lng])

  return distance
}
