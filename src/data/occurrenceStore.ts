import type { Moderation, Occurrence, OccurrenceEvent, StatusId } from '@/domain/types'
import { readStorage, writeStorage } from '@/lib/storage'
import { buildMockOccurrences } from './mock/occurrences'

const CREATED_KEY = 'inframap:created-occurrences'
const CONFIRMED_KEY = 'inframap:confirmed-occurrences'
const TEAM_CHANGES_KEY = 'inframap:team-changes'

export interface TeamChange {
  status?: StatusId
  forwardedTo?: string | null
  moderation?: Moderation | null
  duplicateOf?: string | null
  events?: OccurrenceEvent[]
  dismissedDuplicates?: string[]
}

let createdOccurrences = readStorage<Occurrence[]>(CREATED_KEY, [])
let confirmedIds = new Set(readStorage<string[]>(CONFIRMED_KEY, []))
let teamChanges = readStorage<Record<string, TeamChange>>(TEAM_CHANGES_KEY, {})

function applyChanges(occurrence: Occurrence): Occurrence {
  const change = teamChanges[occurrence.id] ?? {}
  const confirmedByMe = confirmedIds.has(occurrence.id)
  return {
    ...occurrence,
    status: change.status ?? occurrence.status,
    forwardedTo: change.forwardedTo ?? occurrence.forwardedTo ?? null,
    moderation: change.moderation ?? occurrence.moderation ?? null,
    duplicateOf: change.duplicateOf ?? occurrence.duplicateOf ?? null,
    events: [...(occurrence.events ?? []), ...(change.events ?? [])],
    confirmedByMe,
    confirmations: occurrence.confirmations + (confirmedByMe ? 1 : 0),
    location: { ...occurrence.location },
  }
}

export const occurrenceStore = {
  all(): Occurrence[] {
    return [...buildMockOccurrences(), ...createdOccurrences].map(applyChanges)
  },

  visible(): Occurrence[] {
    return occurrenceStore.all().filter((occurrence) => occurrence.moderation === null)
  },

  find(id: string): Occurrence | null {
    return occurrenceStore.all().find((occurrence) => occurrence.id === id) ?? null
  },

  addCreated(occurrence: Occurrence): void {
    createdOccurrences = [...createdOccurrences, occurrence]
    writeStorage(CREATED_KEY, createdOccurrences)
  },

  toggleConfirmed(id: string): void {
    const next = new Set(confirmedIds)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    confirmedIds = next
    writeStorage(CONFIRMED_KEY, [...confirmedIds])
  },

  teamChange(id: string): TeamChange {
    return teamChanges[id] ?? {}
  },

  saveTeamChange(id: string, change: TeamChange): void {
    teamChanges = { ...teamChanges, [id]: { ...teamChanges[id], ...change } }
    writeStorage(TEAM_CHANGES_KEY, teamChanges)
  },
}
