import { distanceInMeters } from '@/domain/geo'
import type { CategoryId, LatLng, NewOccurrence, Occurrence, ReportReason } from '@/domain/types'
import { readStorage, writeStorage } from '@/lib/storage'
import { firstProtocolNumber, formatProtocol } from './mock/occurrences'
import { occurrenceStore } from './occurrenceStore'

const REPORTS_KEY = 'inframap:content-reports'

export interface ContentReport {
  occurrenceId: string
  reason: ReportReason
  details: string
  createdAt: string
}

export interface NearbyOccurrence {
  occurrence: Occurrence
  distanceMeters: number
}

export function findNearbyAmong(
  occurrences: Occurrence[],
  location: LatLng,
  categoryId: CategoryId,
  radiusMeters: number,
  excludeId?: string,
): NearbyOccurrence[] {
  return occurrences
    .filter(
      (item) =>
        item.id !== excludeId && item.categoryId === categoryId && item.status !== 'resolvida',
    )
    .map((occurrence) => ({
      occurrence,
      distanceMeters: distanceInMeters(location, occurrence.location),
    }))
    .filter((candidate) => candidate.distanceMeters <= radiusMeters)
    .sort((a, b) => a.distanceMeters - b.distanceMeters)
}

export function readContentReports(): ContentReport[] {
  return readStorage<ContentReport[]>(REPORTS_KEY, [])
}

export const occurrencesRepo = {
  async list(): Promise<Occurrence[]> {
    return occurrenceStore.visible().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async get(id: string): Promise<Occurrence | null> {
    return occurrenceStore.find(id)
  },

  async listNearby(
    location: LatLng,
    categoryId: CategoryId,
    radiusMeters: number,
    excludeId?: string,
  ): Promise<NearbyOccurrence[]> {
    return findNearbyAmong(occurrenceStore.visible(), location, categoryId, radiusMeters, excludeId)
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
    const report = { occurrenceId, reason, details, createdAt: new Date().toISOString() }
    writeStorage(REPORTS_KEY, [...readContentReports(), report])
  },

  async create(input: NewOccurrence): Promise<Occurrence> {
    const sequence = firstProtocolNumber + occurrenceStore.all().length
    const occurrence: Occurrence = {
      ...input,
      id: String(sequence),
      protocol: formatProtocol(sequence),
      status: 'aberta',
      createdAt: new Date().toISOString(),
      confirmations: 0,
      confirmedByMe: false,
      events: [],
      forwardedTo: null,
      moderation: null,
      duplicateOf: null,
    }
    occurrenceStore.addCreated(occurrence)
    return occurrence
  },

  async confirm(id: string): Promise<Occurrence> {
    occurrenceStore.toggleConfirmed(id)
    const occurrence = occurrenceStore.find(id)
    if (!occurrence) throw new Error(`Ocorrência não encontrada: ${id}`)
    return occurrence
  },
}
