import { formatProtocol } from '@/domain/protocol'
import type {
  CategoryId,
  Moderation,
  Occurrence,
  OccurrenceEvent,
  OccurrenceEventKind,
  StatusId,
} from '@/domain/types'
import { getSupabase } from '@/lib/supabaseClient'

export const PHOTO_BUCKET = 'occurrence-photos'

export const OCCURRENCE_COLUMNS =
  'id, category_id, status, title, description, neighborhood, lat, lng, photo_path, anonymous, forwarded_to, moderation, duplicate_of, confirmations_count, confirmed_by_me, created_at'

export interface OccurrenceRow {
  id: number
  category_id: CategoryId
  status: StatusId
  title: string
  description: string
  neighborhood: string
  lat: number
  lng: number
  photo_path: string | null
  anonymous: boolean
  forwarded_to: string | null
  moderation: Moderation | null
  duplicate_of: number | null
  confirmations_count: number
  confirmed_by_me: boolean
  created_at: string
}

export interface EventRow {
  kind: OccurrenceEventKind
  note: string | null
  created_at: string
}

function photoUrl(path: string | null): string | null {
  if (!path) return null
  return getSupabase().storage.from(PHOTO_BUCKET).getPublicUrl(path).data.publicUrl
}

export function toOccurrence(row: OccurrenceRow, events: EventRow[] = []): Occurrence {
  return {
    id: String(row.id),
    protocol: formatProtocol(row.id),
    categoryId: row.category_id,
    status: row.status,
    title: row.title,
    description: row.description,
    neighborhood: row.neighborhood,
    location: { lat: row.lat, lng: row.lng },
    createdAt: row.created_at,
    confirmations: row.confirmations_count,
    confirmedByMe: row.confirmed_by_me,
    photoUrl: photoUrl(row.photo_path),
    anonymous: row.anonymous,
    events: events.map((event): OccurrenceEvent => ({
      kind: event.kind,
      at: event.created_at,
      note: event.note,
    })),
    forwardedTo: row.forwarded_to,
    moderation: row.moderation,
    duplicateOf: row.duplicate_of === null ? null : String(row.duplicate_of),
  }
}
