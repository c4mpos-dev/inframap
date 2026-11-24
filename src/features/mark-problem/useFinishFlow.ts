import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { occurrencesRepo, type NearbyOccurrence } from '@/data/occurrencesRepo'
import type { Occurrence } from '@/domain/types'
import type { MarkProblemForm } from './useMarkProblemForm'

export function useFinishFlow(form: MarkProblemForm) {
  const navigate = useNavigate()
  const [created, setCreated] = useState<Occurrence | null>(null)

  const send = useCallback(async () => {
    const occurrence = await form.submit()
    if (occurrence) setCreated(occurrence)
  }, [form])

  const confirmExisting = useCallback(
    async ({ occurrence }: NearbyOccurrence) => {
      if (!occurrence.confirmedByMe) await occurrencesRepo.confirm(occurrence.id)
      navigate(`/ocorrencia/${occurrence.id}`)
    },
    [navigate],
  )

  const share = useCallback(async () => {
    if (!created) return
    const url = new URL(`/ocorrencia/${created.id}`, window.location.origin).toString()
    if (navigator.share) {
      await navigator.share({ title: created.title, url }).catch(() => undefined)
      return
    }
    await navigator.clipboard.writeText(url)
  }, [created])

  const startOver = useCallback(() => {
    setCreated(null)
    form.reset()
  }, [form])

  return { created, send, confirmExisting, share, startOver }
}
