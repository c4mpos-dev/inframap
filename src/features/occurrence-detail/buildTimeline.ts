import { getStatus } from '@/domain/statuses'
import type { Occurrence, OccurrenceEventKind } from '@/domain/types'

export const NEIGHBORHOOD_CONFIRMATION_THRESHOLD = 5

export type TimelineStepState = 'done' | 'current' | 'pending' | 'skipped'

export interface TimelineStep {
  key: 'registrada' | OccurrenceEventKind
  title: string
  detail: string | null
  at: string | null
  state: TimelineStepState
  color: string
}

const progressOrder: Record<Occurrence['status'], number> = {
  aberta: 1,
  andamento: 2,
  resolvida: 3,
}

function formatMissingConfirmations(missing: number): string {
  return missing === 1
    ? 'Falta 1 confirmação para a vizinhança assinar embaixo'
    : `Faltam ${missing} confirmações para a vizinhança assinar embaixo`
}

export function buildTimeline(occurrence: Occurrence): TimelineStep[] {
  const eventOf = (kind: OccurrenceEventKind) =>
    occurrence.events.find((event) => event.kind === kind) ?? null
  const reached = progressOrder[occurrence.status]
  const confirmedByNeighbors =
    occurrence.confirmations >= NEIGHBORHOOD_CONFIRMATION_THRESHOLD ||
    eventOf('confirmada') !== null
  const inProgress = eventOf('andamento')
  const resolved = eventOf('resolvida')

  const finished = occurrence.status === 'resolvida'
  const stateFor = (stepLevel: number): TimelineStepState =>
    stepLevel < reached || finished ? 'done' : stepLevel === reached ? 'current' : 'pending'

  return [
    {
      key: 'registrada',
      title: 'Registrada',
      detail: null,
      at: occurrence.createdAt,
      state: 'done',
      color: getStatus('aberta').color,
    },
    {
      key: 'confirmada',
      title: 'Confirmada pela vizinhança',
      detail: confirmedByNeighbors
        ? `Passou de ${NEIGHBORHOOD_CONFIRMATION_THRESHOLD} confirmações`
        : reached > 1
          ? null
          : formatMissingConfirmations(
              NEIGHBORHOOD_CONFIRMATION_THRESHOLD - occurrence.confirmations,
            ),
      at: eventOf('confirmada')?.at ?? null,
      state: confirmedByNeighbors ? 'done' : reached > 1 ? 'skipped' : 'pending',
      color: getStatus('aberta').color,
    },
    {
      key: 'andamento',
      title: 'Em andamento',
      detail: inProgress?.note ?? null,
      at: inProgress?.at ?? null,
      state: stateFor(2),
      color: getStatus('andamento').color,
    },
    {
      key: 'resolvida',
      title: 'Resolvida',
      detail: resolved?.note ?? (reached < 3 ? 'Quando consertarem, avise aqui' : null),
      at: resolved?.at ?? null,
      state: stateFor(3),
      color: getStatus('resolvida').color,
    },
  ]
}
