import { distanceInMeters } from '@/domain/geo'
import type { CategoryId, LatLng, NewOccurrence, Occurrence, ReportReason } from '@/domain/types'
import { readStorage, writeStorage } from '@/lib/storage'
import { buildMockOccurrences, firstProtocolNumber, formatProtocol } from './mock/occurrences'

const CREATED_KEY = 'inframap:created-occurrences'
const CONFIRMED_KEY = 'inframap:confirmed-occurrences'
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

let createdOccurrences = readStorage<Occurrence[]>(CREATED_KEY, [])
let confirmedIds = new Set(readStorage<string[]>(CONFIRMED_KEY, []))

function allOccurrences(): Occurrence[] {
  return [...buildMockOccurrences(), ...createdOccurrences].map((occurrence) => {
    const confirmedByMe = confirmedIds.has(occurrence.id)
    return {
      ...occurrence,
      confirmedByMe,
      confirmations: occurrence.confirmations + (confirmedByMe ? 1 : 0),
      location: { ...occurrence.location },
      events: occurrence.events ?? [],
    }
  })
}

function findOrThrow(id: string): Occurrence {
  const occurrence = allOccurrences().find((item) => item.id === id)
  if (!occurrence) throw new Error(`Ocorrência não encontrada: ${id}`)
  return occurrence
}

export const occurrencesRepo = {
  async list(): Promise<Occurrence[]> {
    return allOccurrences().sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  },

  async get(id: string): Promise<Occurrence | null> {
    return allOccurrences().find((item) => item.id === id) ?? null
  },

  async listNearby(
    location: LatLng,
    categoryId: CategoryId,
    radiusMeters: number,
    excludeId?: string,
  ): Promise<NearbyOccurrence[]> {
    return allOccurrences()
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
    const reports = readStorage<ContentReport[]>(REPORTS_KEY, [])
    const report = { occurrenceId, reason, details, createdAt: new Date().toISOString() }
    writeStorage(REPORTS_KEY, [...reports, report])
  },

  async create(input: NewOccurrence): Promise<Occurrence> {
    const sequence = firstProtocolNumber + allOccurrences().length
    const occurrence: Occurrence = {
      ...input,
      id: String(sequence),
      protocol: formatProtocol(sequence),
      status: 'aberta',
      createdAt: new Date().toISOString(),
      confirmations: 0,
      confirmedByMe: false,
      events: [],
    }
    createdOccurrences = [...createdOccurrences, occurrence]
    writeStorage(CREATED_KEY, createdOccurrences)
    return occurrence
  },

  async confirm(id: string): Promise<Occurrence> {
    const next = new Set(confirmedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    confirmedIds = next
    writeStorage(CONFIRMED_KEY, [...confirmedIds])
    return findOrThrow(id)
  },
}
