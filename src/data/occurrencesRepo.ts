import type { NewOccurrence, Occurrence } from '@/domain/types'
import { buildMockOccurrences, firstProtocolNumber, formatProtocol } from './mock/occurrences'

let occurrences = buildMockOccurrences()

const copy = (occurrence: Occurrence): Occurrence => ({
  ...occurrence,
  location: { ...occurrence.location },
})

function findOrThrow(id: string): Occurrence {
  const occurrence = occurrences.find((item) => item.id === id)
  if (!occurrence) throw new Error(`Ocorrência não encontrada: ${id}`)
  return occurrence
}

export const occurrencesRepo = {
  async list(): Promise<Occurrence[]> {
    return [...occurrences].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).map(copy)
  },

  async get(id: string): Promise<Occurrence | null> {
    const occurrence = occurrences.find((item) => item.id === id)
    return occurrence ? copy(occurrence) : null
  },

  async create(input: NewOccurrence): Promise<Occurrence> {
    const sequence = firstProtocolNumber + occurrences.length
    const occurrence: Occurrence = {
      ...input,
      id: String(occurrences.length + 1),
      protocol: formatProtocol(sequence),
      status: 'aberta',
      createdAt: new Date().toISOString(),
      confirmations: 0,
      confirmedByMe: false,
    }
    occurrences = [...occurrences, occurrence]
    return copy(occurrence)
  },

  async confirm(id: string): Promise<Occurrence> {
    const current = findOrThrow(id)
    const confirmedByMe = !current.confirmedByMe
    const updated: Occurrence = {
      ...current,
      confirmedByMe,
      confirmations: current.confirmations + (confirmedByMe ? 1 : -1),
    }
    occurrences = occurrences.map((item) => (item.id === id ? updated : item))
    return copy(updated)
  },
}
