export type CategoryId =
  'vias' | 'calcadas' | 'saneamento' | 'sinalizacao' | 'iluminacao' | 'outros'

export type StatusId = 'aberta' | 'andamento' | 'resolvida'

export interface LatLng {
  lat: number
  lng: number
}

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
