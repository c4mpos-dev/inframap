import { useCallback, useState } from 'react'
import type { LatLng } from '@/domain/types'

const errorMessages: Record<number, string> = {
  1: 'Você não deu permissão de localização. Libere nas configurações do navegador.',
  2: 'Não deu para achar onde você está agora. Tente de novo em um lugar aberto.',
  3: 'A localização demorou demais. Tente de novo.',
}

export function useUserLocation(onFound?: (location: LatLng) => void) {
  const [location, setLocation] = useState<LatLng | null>(null)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const locate = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setError('Este navegador não informa a localização.')
      return
    }
    setLocating(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const found = { lat: coords.latitude, lng: coords.longitude }
        setLocation(found)
        setLocating(false)
        onFound?.(found)
      },
      (positionError) => {
        setError(errorMessages[positionError.code] ?? errorMessages[2] ?? null)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 },
    )
  }, [onFound])

  const dismissError = useCallback(() => setError(null), [])

  return { location, locating, error, locate, dismissError }
}
