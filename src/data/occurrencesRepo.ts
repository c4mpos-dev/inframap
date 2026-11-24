import { distanceInMeters } from '@/domain/geo'
import type { CategoryId, LatLng, NewOccurrence, Occurrence } from '@/domain/types'
import { readStorage, writeStorage } from '@/lib/storage'
import { buildMockOccurrences, firstProtocolNumber, formatProtocol } from './mock/occurrences'

const CREATED_KEY = 'inframap:created-occurrences'
const CONFIRMED_KEY = 'inframap:confirmed-occurrences'

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

  async findNearby(
    location: LatLng,
    categoryId: CategoryId,
    radiusMeters: number,
  ): Promise<NearbyOccurrence | null> {
    const candidates = allOccurrences()
      .filter((item) => item.categoryId === categoryId && item.status !== 'resolvida')
      .map((occurrence) => ({
        occurrence,
        distanceMeters: distanceInMeters(location, occurrence.location),
      }))
      .filter((candidate) => candidate.distanceMeters <= radiusMeters)
      .sort((a, b) => a.distanceMeters - b.distanceMeters)
    return candidates[0] ?? null
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
