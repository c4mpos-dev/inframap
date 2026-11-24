import { describe, expect, it } from 'vitest'
import {
  computeIndicators,
  filterRecords,
  type IndicatorFilters,
  type IndicatorRecord,
} from './indicators'

const now = new Date(2026, 10, 24, 12)
const day = (month: number, date: number) => new Date(2026, month, date, 10).toISOString()

const record = (overrides: Partial<IndicatorRecord>): IndicatorRecord => ({
  createdAt: day(10, 20),
  status: 'aberta',
  categoryId: 'vias',
  neighborhood: 'Centro',
  hasPhoto: false,
  hasDescription: false,
  confirmations: 0,
  ...overrides,
})

const records = [
  record({ hasPhoto: true, hasDescription: true, confirmations: 4 }),
  record({
    categoryId: 'iluminacao',
    status: 'resolvida',
    neighborhood: 'Paraíso',
    confirmations: 2,
    hasPhoto: true,
  }),
  record({ createdAt: day(9, 24), status: 'andamento', neighborhood: 'Paraíso' }),
  record({ createdAt: day(5, 1), categoryId: 'calcadas' }),
]

const filters = (overrides: Partial<IndicatorFilters>): IndicatorFilters => ({
  period: 'tudo',
  neighborhood: null,
  categoryId: null,
  ...overrides,
})

describe('filterRecords', () => {
  it('últimas 4 semanas deixa de fora os antigos', () => {
    expect(filterRecords(records, filters({ period: '4s' }), now)).toHaveLength(2)
  })

  it('encontros só pega os dias dos encontros', () => {
    expect(filterRecords(records, filters({ period: 'encontros' }), now)).toHaveLength(1)
  })

  it('filtra por bairro e categoria', () => {
    expect(filterRecords(records, filters({ neighborhood: 'Paraíso' }), now)).toHaveLength(2)
    expect(
      filterRecords(records, filters({ neighborhood: 'Paraíso', categoryId: 'iluminacao' }), now),
    ).toHaveLength(1)
  })
})

describe('computeIndicators', () => {
  const result = computeIndicators(records, filters({}), now)

  it('conta total, completos e confirmações por relato', () => {
    expect(result.total).toBe(4)
    expect(result.withPhotoAndDescription).toBe(1)
    expect(result.withPhotoAndDescriptionShare).toBe(0.25)
    expect(result.confirmationsPerReport).toBe(1.5)
  })

  it('separa por situação na ordem fixa', () => {
    expect(result.byStatus.map((item) => [item.id, item.value])).toEqual([
      ['aberta', 2],
      ['andamento', 1],
      ['resolvida', 1],
    ])
  })

  it('ordena categorias e bairros do maior para o menor', () => {
    expect(result.byCategory[0]).toMatchObject({ id: 'vias', value: 2, share: 0.5 })
    expect(result.byNeighborhood.map((item) => item.label)).toEqual(['Centro', 'Paraíso'])
  })

  it('agrupa por semana da primeira até a atual', () => {
    const total = result.weeks.reduce((sum, week) => sum + week.value, 0)
    expect(total).toBe(4)
    expect(result.weeks.at(-1)?.label).toBe('23/11')
  })

  it('sem relatos não divide por zero', () => {
    const empty = computeIndicators([], filters({ period: '4s' }), now)
    expect(empty.total).toBe(0)
    expect(empty.confirmationsPerReport).toBe(0)
    expect(empty.weeks).toEqual([])
  })
})
