import type { Occurrence } from '@/domain/types'

export async function shareOccurrence(occurrence: Occurrence): Promise<'shared' | 'copied'> {
  const url = new URL(`/ocorrencia/${occurrence.id}`, window.location.origin).toString()
  if (navigator.share) {
    await navigator.share({ title: occurrence.title, url }).catch(() => undefined)
    return 'shared'
  }
  await navigator.clipboard.writeText(url)
  return 'copied'
}
