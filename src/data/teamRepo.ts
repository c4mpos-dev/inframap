import type { Occurrence, OccurrenceEvent, StatusId } from '@/domain/types'
import { findNearbyAmong, readContentReports, type NearbyOccurrence } from './occurrencesRepo'
import { occurrenceStore } from './occurrenceStore'

const DUPLICATE_RADIUS_METERS = 50

export interface QueueItem {
  occurrence: Occurrence
  reportCount: number
}

export interface TeamUpdate {
  status: StatusId
  forwardedTo: string | null
  note: string
}

const statusEventKind: Record<StatusId, OccurrenceEvent['kind']> = {
  aberta: 'nota',
  andamento: 'andamento',
  resolvida: 'resolvida',
}

export const teamRepo = {
  async queue(): Promise<QueueItem[]> {
    const reports = readContentReports()
    return occurrenceStore
      .visible()
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map((occurrence) => ({
        occurrence,
        reportCount: reports.filter((report) => report.occurrenceId === occurrence.id).length,
      }))
  },

  async possibleDuplicate(occurrence: Occurrence): Promise<NearbyOccurrence | null> {
    const dismissed = occurrenceStore.teamChange(occurrence.id).dismissedDuplicates ?? []
    const candidates = findNearbyAmong(
      occurrenceStore.visible(),
      occurrence.location,
      occurrence.categoryId,
      DUPLICATE_RADIUS_METERS,
      occurrence.id,
    )
    return candidates.find((candidate) => !dismissed.includes(candidate.occurrence.id)) ?? null
  },

  async update(id: string, { status, forwardedTo, note }: TeamUpdate): Promise<void> {
    const current = occurrenceStore.find(id)
    if (!current) throw new Error(`Ocorrência não encontrada: ${id}`)
    const statusChanged = status !== current.status
    const trimmedNote = note.trim()
    const previous = occurrenceStore.teamChange(id).events ?? []
    const event: OccurrenceEvent | null =
      statusChanged || trimmedNote
        ? { kind: statusEventKind[status], at: new Date().toISOString(), note: trimmedNote || null }
        : null
    occurrenceStore.saveTeamChange(id, {
      status,
      forwardedTo,
      events: event ? [...previous, event] : previous,
    })
  },

  async markDuplicate(id: string, originalId: string): Promise<void> {
    occurrenceStore.saveTeamChange(id, { moderation: 'duplicada', duplicateOf: originalId })
  },

  async dismissDuplicate(id: string, otherId: string): Promise<void> {
    const dismissed = occurrenceStore.teamChange(id).dismissedDuplicates ?? []
    occurrenceStore.saveTeamChange(id, { dismissedDuplicates: [...dismissed, otherId] })
    const otherDismissed = occurrenceStore.teamChange(otherId).dismissedDuplicates ?? []
    occurrenceStore.saveTeamChange(otherId, { dismissedDuplicates: [...otherDismissed, id] })
  },

  async markInvalid(id: string): Promise<void> {
    occurrenceStore.saveTeamChange(id, { moderation: 'invalida' })
  },
}
