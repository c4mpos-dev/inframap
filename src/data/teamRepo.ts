import type { Occurrence, StatusId } from '@/domain/types'
import { getSupabase, unwrap } from '@/lib/supabaseClient'
import { OCCURRENCE_COLUMNS, toOccurrence, type OccurrenceRow } from './occurrenceRows'
import { resolveNearby, type NearbyOccurrence } from './occurrencesRepo'

export interface QueueItem {
  occurrence: Occurrence
  reportCount: number
}

export interface TeamUpdate {
  status: StatusId
  forwardedTo: string | null
  note: string
}

interface QueueRow {
  occurrence_id: number
  report_count: number
}

export const teamRepo = {
  async queue(): Promise<QueueItem[]> {
    const queue = unwrap(await getSupabase().rpc('team_queue')) as QueueRow[]
    const rows = unwrap(
      await getSupabase()
        .from('occurrences_public')
        .select(OCCURRENCE_COLUMNS)
        .in(
          'id',
          queue.map((item) => item.occurrence_id),
        ),
    ) as OccurrenceRow[]
    const byId = new Map(rows.map((row) => [row.id, toOccurrence(row)]))
    return queue.flatMap((item) => {
      const occurrence = byId.get(item.occurrence_id)
      return occurrence ? [{ occurrence, reportCount: item.report_count }] : []
    })
  },

  async possibleDuplicate(occurrence: Occurrence): Promise<NearbyOccurrence | null> {
    const rows = unwrap(
      await getSupabase().rpc('team_possible_duplicate', { p_id: Number(occurrence.id) }),
    ) as { occurrence_id: number; distance_meters: number }[]
    const [candidate] = await resolveNearby(rows)
    return candidate ?? null
  },

  async update(id: string, { status, forwardedTo, note }: TeamUpdate): Promise<void> {
    unwrap(
      await getSupabase().rpc('team_update_occurrence', {
        p_id: Number(id),
        p_status: status,
        p_forwarded_to: forwardedTo ?? '',
        p_note: note,
      }),
    )
  },

  async markDuplicate(id: string, originalId: string): Promise<void> {
    unwrap(
      await getSupabase().rpc('team_mark_duplicate', {
        p_id: Number(id),
        p_original_id: Number(originalId),
      }),
    )
  },

  async dismissDuplicate(id: string, otherId: string): Promise<void> {
    unwrap(
      await getSupabase().rpc('team_dismiss_duplicate', {
        p_id: Number(id),
        p_other_id: Number(otherId),
      }),
    )
  },

  async markInvalid(id: string): Promise<void> {
    unwrap(await getSupabase().rpc('team_mark_invalid', { p_id: Number(id) }))
  },
}
