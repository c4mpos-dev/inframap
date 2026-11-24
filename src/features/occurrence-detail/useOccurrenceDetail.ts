import { useCallback, useEffect, useState } from 'react'
import { occurrencesRepo, type NearbyOccurrence } from '@/data/occurrencesRepo'
import type { Occurrence } from '@/domain/types'

const NEARBY_RADIUS_METERS = 200
const NEARBY_LIMIT = 3

type DetailState =
  | { status: 'loading' }
  | { status: 'missing' }
  | { status: 'merged'; originalId: string }
  | { status: 'ready'; occurrence: Occurrence; nearby: NearbyOccurrence[] }

export function useOccurrenceDetail(id: string) {
  const [state, setState] = useState<DetailState>({ status: 'loading' })

  useEffect(() => {
    let active = true
    async function load() {
      const occurrence = await occurrencesRepo.get(id)
      if (!active) return
      if (!occurrence || occurrence.moderation === 'invalida') {
        setState({ status: 'missing' })
        return
      }
      if (occurrence.moderation === 'duplicada' && occurrence.duplicateOf) {
        setState({ status: 'merged', originalId: occurrence.duplicateOf })
        return
      }
      const nearby = await occurrencesRepo.listNearby(
        occurrence.location,
        occurrence.categoryId,
        NEARBY_RADIUS_METERS,
        occurrence.id,
      )
      if (active) setState({ status: 'ready', occurrence, nearby: nearby.slice(0, NEARBY_LIMIT) })
    }
    load()
    return () => {
      active = false
    }
  }, [id])

  const toggleConfirmation = useCallback(async () => {
    const updated = await occurrencesRepo.confirm(id)
    setState((current) =>
      current.status === 'ready' ? { ...current, occurrence: updated } : current,
    )
  }, [id])

  return { state, toggleConfirmation }
}
