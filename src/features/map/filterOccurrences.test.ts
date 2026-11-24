import { describe, expect, it } from 'vitest'
import { makeOccurrence } from '@/test/makeOccurrence'
import {
  filterOccurrences,
  formatOccurrenceCount,
  normalizeText,
  type OccurrenceFilters,
} from './filterOccurrences'

const occurrences = [
  makeOccurrence({ id: '1', categoryId: 'vias', title: 'Buraco', neighborhood: 'Jardim Jalisco' }),
  makeOccurrence({
    id: '2',
    categoryId: 'iluminacao',
    status: 'resolvida',
    title: 'Poste apagado',
    neighborhood: 'Centro',
  }),
  makeOccurrence({
    id: '3',
    categoryId: 'calcadas',
    status: 'andamento',
    title: 'Calçada quebrada',
    neighborhood: 'Campos Elíseos',
  }),
]

const filterIds = (filters: Partial<OccurrenceFilters>) =>
  filterOccurrences(occurrences, {
    category: 'todas',
    status: 'todas',
    search: '',
    ...filters,
  }).map((occurrence) => occurrence.id)

describe('filterOccurrences', () => {
  it('sem filtro devolve tudo', () => {
    expect(filterIds({})).toEqual(['1', '2', '3'])
  })

  it('filtra por categoria e situação juntas', () => {
    expect(filterIds({ category: 'iluminacao', status: 'resolvida' })).toEqual(['2'])
    expect(filterIds({ category: 'iluminacao', status: 'aberta' })).toEqual([])
  })

  it('a busca ignora acento e maiúscula e olha título e bairro', () => {
    expect(filterIds({ search: 'CAMPOS ELISEOS' })).toEqual(['3'])
    expect(filterIds({ search: 'calcada' })).toEqual(['3'])
    expect(filterIds({ search: '  poste ' })).toEqual(['2'])
  })
})

describe('normalizeText', () => {
  it('tira acentos e espaços das pontas', () => {
    expect(normalizeText('  Iluminação Pública ')).toBe('iluminacao publica')
  })
})

describe('formatOccurrenceCount', () => {
  it('conta no singular e no plural', () => {
    expect(formatOccurrenceCount(0)).toBe('Nenhum relato')
    expect(formatOccurrenceCount(1)).toBe('1 relato')
    expect(formatOccurrenceCount(12)).toBe('12 relatos')
  })
})
