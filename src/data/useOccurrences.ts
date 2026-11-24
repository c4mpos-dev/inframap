import { useCallback, useEffect, useState } from 'react'
import type { Occurrence } from '@/domain/types'
import { occurrencesRepo } from './occurrencesRepo'

type LoadState = 'loading' | 'ready' | 'error'

export function useOccurrences() {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([])
  const [state, setState] = useState<LoadState>('loading')

  useEffect(() => {
    let active = true
    occurrencesRepo
      .list()
      .then((items) => {
        if (!active) return
        setOccurrences(items)
        setState('ready')
      })
      .catch(() => active && setState('error'))
    return () => {
      active = false
    }
  }, [])

  const toggleConfirmation = useCallback(async (id: string) => {
    const updated = await occurrencesRepo.confirm(id)
    setOccurrences((items) => items.map((item) => (item.id === id ? updated : item)))
  }, [])

  return { occurrences, state, toggleConfirmation }
}
