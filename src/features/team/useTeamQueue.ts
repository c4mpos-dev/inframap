import { useCallback, useEffect, useState } from 'react'
import { teamRepo, type QueueItem } from '@/data/teamRepo'

export function useTeamQueue() {
  const [items, setItems] = useState<QueueItem[] | null>(null)

  const reload = useCallback(async () => {
    setItems(await teamRepo.queue())
  }, [])

  useEffect(() => {
    let active = true
    teamRepo.queue().then((queue) => active && setItems(queue))
    return () => {
      active = false
    }
  }, [])

  return { items, reload }
}
