import type { Occurrence } from '@/domain/types'

export function makeOccurrence(overrides: Partial<Occurrence> = {}): Occurrence {
  return {
    id: '200',
    protocol: '#RES-0200',
    categoryId: 'vias',
    status: 'aberta',
    title: 'Buraco na pista',
    description: 'Buraco grande perto do ponto de ônibus.',
    neighborhood: 'Centro',
    location: { lat: -22.4705, lng: -44.4635 },
    createdAt: '2026-11-10T12:00:00.000Z',
    confirmations: 0,
    confirmedByMe: false,
    photoUrl: null,
    anonymous: false,
    authorName: 'Maria S.',
    events: [],
    forwardedTo: null,
    moderation: null,
    duplicateOf: null,
    ...overrides,
  }
}
