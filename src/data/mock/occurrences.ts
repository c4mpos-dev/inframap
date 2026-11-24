import type { CategoryId, Occurrence, StatusId } from '@/domain/types'

interface Seed {
  categoryId: CategoryId
  status: StatusId
  title: string
  description: string
  neighborhood: string
  lat: number
  lng: number
  daysAgo: number
  confirmations: number
}

const seeds: Seed[] = [
  {
    categoryId: 'vias',
    status: 'aberta',
    title: 'Buraco que vira lagoa quando chove',
    description: 'O buraco fica cheio d’água quando chove e os carros desviam pela contramão.',
    neighborhood: 'Campos Elíseos',
    lat: -22.4602,
    lng: -44.4508,
    daysAgo: 2,
    confirmations: 14,
  },
  {
    categoryId: 'calcadas',
    status: 'andamento',
    title: 'Calçada levantada por raiz de árvore',
    description: 'A raiz levantou as placas e quem passa com carrinho precisa ir pela rua.',
    neighborhood: 'Centro',
    lat: -22.4706,
    lng: -44.4471,
    daysAgo: 5,
    confirmations: 9,
  },
  {
    categoryId: 'saneamento',
    status: 'aberta',
    title: 'Bueiro entupido na esquina',
    description: 'Com qualquer chuva a água volta e alaga a esquina inteira.',
    neighborhood: 'Jardim Jalisco',
    lat: -22.4561,
    lng: -44.4332,
    daysAgo: 1,
    confirmations: 21,
  },
  {
    categoryId: 'sinalizacao',
    status: 'resolvida',
    title: 'Placa de PARE caída',
    description: 'A placa caiu depois do temporal e o cruzamento ficou sem sinalização.',
    neighborhood: 'Manejo',
    lat: -22.4523,
    lng: -44.4618,
    daysAgo: 14,
    confirmations: 6,
  },
  {
    categoryId: 'iluminacao',
    status: 'andamento',
    title: 'Poste apagado no quarteirão todo',
    description: 'Os três postes da rua estão apagados há mais de uma semana.',
    neighborhood: 'Paraíso',
    lat: -22.4781,
    lng: -44.4562,
    daysAgo: 3,
    confirmations: 11,
  },
  {
    categoryId: 'sinalizacao',
    status: 'aberta',
    title: 'Faixa de pedestre apagada',
    description: 'A faixa em frente à escola quase não aparece mais.',
    neighborhood: 'Vila Julieta',
    lat: -22.4762,
    lng: -44.4383,
    daysAgo: 0,
    confirmations: 4,
  },
  {
    categoryId: 'saneamento',
    status: 'aberta',
    title: 'Esgoto correndo na sarjeta',
    description: 'O esgoto escorre pela sarjeta e o cheiro chega nas casas.',
    neighborhood: 'Cidade Alegria',
    lat: -22.4928,
    lng: -44.4312,
    daysAgo: 4,
    confirmations: 17,
  },
  {
    categoryId: 'vias',
    status: 'resolvida',
    title: 'Buraco na ciclovia',
    description: 'Buraco no meio da ciclovia, perigoso para quem passa de bicicleta à noite.',
    neighborhood: 'Itapuca',
    lat: -22.4643,
    lng: -44.4401,
    daysAgo: 31,
    confirmations: 3,
  },
]

export const firstProtocolNumber = 139

export function buildMockOccurrences(now: Date = new Date()): Occurrence[] {
  return seeds.map((seed, index) => {
    const createdAt = new Date(now)
    createdAt.setDate(createdAt.getDate() - seed.daysAgo)
    return {
      id: String(index + 1),
      protocol: formatProtocol(firstProtocolNumber + index),
      categoryId: seed.categoryId,
      status: seed.status,
      title: seed.title,
      description: seed.description,
      neighborhood: seed.neighborhood,
      location: { lat: seed.lat, lng: seed.lng },
      createdAt: createdAt.toISOString(),
      confirmations: seed.confirmations,
      confirmedByMe: false,
      photoUrl: null,
      anonymous: true,
    }
  })
}

export function formatProtocol(sequence: number): string {
  return `#RES-${String(sequence).padStart(4, '0')}`
}
