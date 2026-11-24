import { categories } from '@/domain/categories'
import { ENCOUNTER_DATES } from '@/domain/encounters'
import type { StatusId } from '@/domain/types'
import type { IndicatorRecord } from '@/domain/indicators'

export const SAMPLE_REGISTERED_RESIDENTS = 46

const SAMPLE_SIZE = 72
const FIRST_SAMPLE_DAY = new Date(2026, 8, 23)

const neighborhoodWeights: [string, number][] = [
  ['Campos Elíseos', 8],
  ['Jardim Jalisco', 7],
  ['Centro', 6],
  ['Cidade Alegria', 5],
  ['Paraíso', 5],
  ['Vila Julieta', 4],
  ['Manejo', 3],
  ['Itapuca', 2],
]

const categoryWeights = [8, 5, 6, 3, 4, 1]

function seededRandom(seed: number) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function pickWeighted<T>(items: T[], weights: number[], roll: number): T {
  const total = weights.reduce((sum, weight) => sum + weight, 0)
  let threshold = roll * total
  for (const [index, item] of items.entries()) {
    threshold -= weights[index] ?? 0
    if (threshold <= 0) return item
  }
  return items[items.length - 1] as T
}

function pickStatus(roll: number): StatusId {
  if (roll < 0.52) return 'aberta'
  if (roll < 0.8) return 'andamento'
  return 'resolvida'
}

export function buildIndicatorSample(now: Date = new Date()): IndicatorRecord[] {
  const random = seededRandom(2026)
  const span = Math.max(1, now.getTime() - FIRST_SAMPLE_DAY.getTime())
  const encounterDays = ENCOUNTER_DATES.map((day) => new Date(`${day}T10:00:00`))

  return Array.from({ length: SAMPLE_SIZE }, (_, index) => {
    const onEncounter = index % 3 === 0
    const encounterDay = encounterDays[index % encounterDays.length]
    const createdAt =
      onEncounter && encounterDay && encounterDay <= now
        ? new Date(encounterDay.getTime() + random() * 4 * 60 * 60 * 1000)
        : new Date(FIRST_SAMPLE_DAY.getTime() + random() ** 0.6 * span)
    const hasPhoto = random() < 0.78
    return {
      createdAt: createdAt.toISOString(),
      status: pickStatus(random()),
      categoryId: pickWeighted(
        categories.map((category) => category.id),
        categoryWeights,
        random(),
      ),
      neighborhood: pickWeighted(
        neighborhoodWeights.map(([name]) => name),
        neighborhoodWeights.map(([, weight]) => weight),
        random(),
      ),
      hasPhoto,
      hasDescription: random() < 0.85,
      confirmations: Math.floor(random() * 7),
    }
  })
}
