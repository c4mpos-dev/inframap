import { useCallback, useRef, useState } from 'react'
import { occurrencesRepo } from '@/data/occurrencesRepo'
import { buildOccurrenceTitle } from '@/domain/occurrenceTitle'
import type { CategoryId, LatLng, Occurrence } from '@/domain/types'
import { reverseGeocode, type PlaceName } from '@/lib/geocoding'
import { compressPhoto } from '@/lib/photo'
import { markProblemSchema } from './schema'

export type LocationSource = 'gps' | 'manual'

export interface MarkProblemDraft {
  location: LatLng | null
  locationSource: LocationSource
  accuracyMeters: number | null
  place: PlaceName | null
  categoryId: CategoryId | null
  photoUrl: string | null
  description: string
  anonymous: boolean
}

const emptyDraft: MarkProblemDraft = {
  location: null,
  locationSource: 'manual',
  accuracyMeters: null,
  place: null,
  categoryId: null,
  photoUrl: null,
  description: '',
  anonymous: false,
}

export function useMarkProblemForm() {
  const [draft, setDraft] = useState<MarkProblemDraft>(emptyDraft)
  const [photoStatus, setPhotoStatus] = useState<'idle' | 'processing' | 'error'>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const geocodeRequest = useRef(0)

  const patch = useCallback((changes: Partial<MarkProblemDraft>) => {
    setDraft((current) => ({ ...current, ...changes }))
  }, [])

  const setLocation = useCallback(
    async (location: LatLng) => {
      patch({ location })
      const request = ++geocodeRequest.current
      const place = await reverseGeocode(location)
      if (request === geocodeRequest.current) patch({ place })
    },
    [patch],
  )

  const setGpsAccuracy = useCallback(
    (accuracyMeters: number) => patch({ locationSource: 'gps', accuracyMeters }),
    [patch],
  )

  const markLocationAsManual = useCallback(
    () => patch({ locationSource: 'manual', accuracyMeters: null }),
    [patch],
  )

  const choosePhoto = useCallback(
    async (file: File) => {
      setPhotoStatus('processing')
      try {
        patch({ photoUrl: await compressPhoto(file) })
        setPhotoStatus('idle')
      } catch {
        setPhotoStatus('error')
      }
    },
    [patch],
  )

  const submit = useCallback(async (): Promise<Occurrence | null> => {
    const neighborhood = draft.place?.neighborhood ?? 'Resende'
    const parsed = markProblemSchema.safeParse({ ...draft, neighborhood })
    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message ?? 'Confira os campos')
      return null
    }
    setSubmitting(true)
    setSubmitError(null)
    try {
      const { categoryId, description, location, photoUrl, anonymous } = parsed.data
      return await occurrencesRepo.create({
        categoryId,
        description,
        location,
        photoUrl,
        anonymous,
        neighborhood,
        title: buildOccurrenceTitle(description, categoryId, neighborhood),
      })
    } catch {
      setSubmitError('Não deu para enviar agora. Tente de novo em instantes.')
      return null
    } finally {
      setSubmitting(false)
    }
  }, [draft])

  const reset = useCallback(() => {
    setDraft((current) => ({ ...emptyDraft, location: current.location, place: current.place }))
    setSubmitError(null)
  }, [])

  return {
    draft,
    patch,
    setLocation,
    setGpsAccuracy,
    markLocationAsManual,
    choosePhoto,
    photoStatus,
    submit,
    submitting,
    submitError,
    reset,
  }
}

export type MarkProblemForm = ReturnType<typeof useMarkProblemForm>
