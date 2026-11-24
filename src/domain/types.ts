export type CategoryId =
  'vias' | 'calcadas' | 'saneamento' | 'sinalizacao' | 'iluminacao' | 'outros'

export type StatusId = 'aberta' | 'andamento' | 'resolvida'

export interface LatLng {
  lat: number
  lng: number
}

export type OccurrenceEventKind = 'confirmada' | 'andamento' | 'resolvida'

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
  events: OccurrenceEvent[]
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
