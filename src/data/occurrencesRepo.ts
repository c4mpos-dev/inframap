import type { CategoryId, LatLng, NewOccurrence, Occurrence, ReportReason } from '@/domain/types'
import { getSupabase, unwrap } from '@/lib/supabaseClient'
import {
  OCCURRENCE_COLUMNS,
  PHOTO_BUCKET,
  toOccurrence,
  type EventRow,
  type OccurrenceRow,
} from './occurrenceRows'
import { requireAccount } from './session'

export interface NearbyOccurrence {
  occurrence: Occurrence
  distanceMeters: number
}

interface NearbyRow {
  occurrence_id: number
  distance_meters: number
}

const publicOccurrences = () => getSupabase().from('occurrences_public').select(OCCURRENCE_COLUMNS)

async function fetchByIds(ids: number[]): Promise<Map<number, Occurrence>> {
  if (ids.length === 0) return new Map()
  const rows = unwrap(await publicOccurrences().in('id', ids)) as OccurrenceRow[]
  return new Map(rows.map((row) => [row.id, toOccurrence(row)]))
}

export async function resolveNearby(rows: NearbyRow[]): Promise<NearbyOccurrence[]> {
  const occurrences = await fetchByIds(rows.map((row) => row.occurrence_id))
  return rows.flatMap((row) => {
    const occurrence = occurrences.get(row.occurrence_id)
    return occurrence ? [{ occurrence, distanceMeters: row.distance_meters }] : []
  })
}

async function uploadPhoto(dataUrl: string, userId: string): Promise<string> {
  const blob = await (await fetch(dataUrl)).blob()
  const path = `${userId}/${crypto.randomUUID()}.jpg`
  unwrap(
    await getSupabase()
      .storage.from(PHOTO_BUCKET)
      .upload(path, blob, { contentType: 'image/jpeg' }),
  )
  return path
}

export const occurrencesRepo = {
  async list(): Promise<Occurrence[]> {
    const rows = unwrap(
      await publicOccurrences().is('moderation', null).order('created_at', { ascending: false }),
    ) as OccurrenceRow[]
    return rows.map((row) => toOccurrence(row))
  },

  async listMine(): Promise<Occurrence[]> {
    await requireAccount()
    const rows = unwrap(
      await publicOccurrences().eq('is_mine', true).order('created_at', { ascending: false }),
    ) as OccurrenceRow[]
    return rows.map((row) => toOccurrence(row))
  },

  async get(id: string): Promise<Occurrence | null> {
    const numericId = Number(id)
    if (!Number.isInteger(numericId)) return null
    const row = unwrap(
      await publicOccurrences().eq('id', numericId).maybeSingle(),
    ) as OccurrenceRow | null
    if (!row) return null
    const events = unwrap(
      await getSupabase()
        .from('status_events')
        .select('kind, note, created_at')
        .eq('occurrence_id', numericId)
        .order('created_at'),
    ) as EventRow[]
    return toOccurrence(row, events)
  },

  async listNearby(
    location: LatLng,
    categoryId: CategoryId,
    radiusMeters: number,
    excludeId?: string,
  ): Promise<NearbyOccurrence[]> {
    const rows = unwrap(
      await getSupabase().rpc('nearby_occurrences', {
        p_lat: location.lat,
        p_lng: location.lng,
        p_category: categoryId,
        p_radius_meters: radiusMeters,
        p_exclude: excludeId ? Number(excludeId) : null,
      }),
    ) as NearbyRow[]
    return resolveNearby(rows)
  },

  async findNearby(
    location: LatLng,
    categoryId: CategoryId,
    radiusMeters: number,
  ): Promise<NearbyOccurrence | null> {
    const [closest] = await occurrencesRepo.listNearby(location, categoryId, radiusMeters)
    return closest ?? null
  },

  async report(occurrenceId: string, reason: ReportReason, details: string): Promise<void> {
    await requireAccount()
    unwrap(
      await getSupabase()
        .from('content_reports')
        .insert({ occurrence_id: Number(occurrenceId), reason, details }),
    )
  },

  async create(input: NewOccurrence): Promise<Occurrence> {
    const session = await requireAccount()
    const photoPath = input.photoUrl ? await uploadPhoto(input.photoUrl, session.user.id) : null
    const created = unwrap(
      await getSupabase()
        .from('occurrences')
        .insert({
          category_id: input.categoryId,
          title: input.title,
          description: input.description,
          neighborhood: input.neighborhood,
          location: `SRID=4326;POINT(${input.location.lng} ${input.location.lat})`,
          photo_path: photoPath,
          anonymous: input.anonymous,
        })
        .select('id')
        .single(),
    ) as { id: number }
    const occurrence = await occurrencesRepo.get(String(created.id))
    if (!occurrence) throw new Error('O relato foi enviado, mas não deu para abrir agora.')
    return occurrence
  },

  async confirm(id: string): Promise<Occurrence> {
    const session = await requireAccount()
    const current = await occurrencesRepo.get(id)
    if (!current) throw new Error('Esse relato não existe mais.')
    const confirmations = getSupabase().from('confirmations')
    unwrap(
      current.confirmedByMe
        ? await confirmations
            .delete()
            .eq('occurrence_id', Number(id))
            .eq('user_id', session.user.id)
        : await confirmations.insert({ occurrence_id: Number(id) }),
    )
    const updated = await occurrencesRepo.get(id)
    if (!updated) throw new Error('Esse relato não existe mais.')
    return updated
  },
}
