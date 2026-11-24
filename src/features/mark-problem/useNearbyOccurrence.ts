import { useEffect, useState } from 'react'
import { occurrencesRepo, type NearbyOccurrence } from '@/data/occurrencesRepo'
import type { CategoryId, LatLng } from '@/domain/types'

export const DUPLICATE_RADIUS_METERS = 50

export function useNearbyOccurrence(location: LatLng | null, categoryId: CategoryId | null) {
  const [nearby, setNearby] = useState<NearbyOccurrence | null>(null)
  const lat = location?.lat
  const lng = location?.lng

  useEffect(() => {
    if (lat === undefined || lng === undefined || !categoryId) return
    let active = true
    occurrencesRepo
      .findNearby({ lat, lng }, categoryId, DUPLICATE_RADIUS_METERS)
      .then((result) => active && setNearby(result))
    return () => {
      active = false
    }
  }, [lat, lng, categoryId])

  return lat === undefined || !categoryId ? null : nearby
}
