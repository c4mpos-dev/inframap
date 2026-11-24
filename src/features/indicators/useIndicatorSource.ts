import { useEffect, useState } from 'react'
import { indicatorsRepo, type IndicatorSource } from '@/data/indicatorsRepo'

export function useIndicatorSource() {
  const [source, setSource] = useState<IndicatorSource | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    indicatorsRepo
      .load()
      .then((loaded) => active && setSource(loaded))
      .catch(() => active && setFailed(true))
    return () => {
      active = false
    }
  }, [])

  return { source, failed }
}
