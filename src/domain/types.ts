export type CategoryId =
  'vias' | 'calcadas' | 'saneamento' | 'sinalizacao' | 'iluminacao' | 'outros'

export type StatusId = 'aberta' | 'andamento' | 'resolvida'

export interface LatLng {
  lat: number
  lng: number
}

export type OccurrenceEventKind = 'nota' | 'confirmada' | 'andamento' | 'resolvida'

export type Moderation = 'duplicada' | 'invalida'

export interface OccurrenceEvent {
  kind: OccurrenceEventKind
  at: string
  note: string | null
}

export type ReportReason = 'dados_pessoais' | 'ofensivo' | 'nao_e_infraestrutura' | 'outro'

export interface Occurrence {
  id: string
  protocol: string
  categoryId: CategoryId
  status: StatusId
  title: string
  description: string
  neighborhood: string
  location: LatLng
  createdAt: string
  confirmations: number
  confirmedByMe: boolean
  photoUrl: string | null
  anonymous: boolean
  /** Public label like "Cauã C."; null when hidden or unknown. */
  authorName: string | null
  events: OccurrenceEvent[]
  forwardedTo: string | null
  moderation: Moderation | null
  duplicateOf: string | null
}

export interface NewOccurrence {
  categoryId: CategoryId
  title: string
  description: string
  neighborhood: string
  location: LatLng
  photoUrl: string | null
  anonymous: boolean
}
