import { useCallback, useState } from 'react'
import type { LatLng } from '@/domain/types'

type GpsStatus = 'idle' | 'locating' | 'denied' | 'unavailable'

interface GpsFix {
  location: LatLng
  accuracyMeters: number
}

export function useGpsFix() {
  const [status, setStatus] = useState<GpsStatus>('idle')

  const requestFix = useCallback(
    () =>
      new Promise<GpsFix | null>((resolve) => {
        if (!('geolocation' in navigator)) {
          setStatus('unavailable')
          resolve(null)
          return
        }
        setStatus('locating')
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setStatus('idle')
            resolve({
              location: { lat: coords.latitude, lng: coords.longitude },
              accuracyMeters: Math.round(coords.accuracy),
            })
          },
          (error) => {
            setStatus(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable')
            resolve(null)
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 },
        )
      }),
    [],
  )

  return { status, requestFix }
}
