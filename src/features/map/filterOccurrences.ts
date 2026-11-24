import type { CategoryId, Occurrence, StatusId } from '@/domain/types'

export type CategoryFilter = CategoryId | 'todas'
export type StatusFilter = StatusId | 'todas'

export interface OccurrenceFilters {
  category: CategoryFilter
  status: StatusFilter
  search: string
}

export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export function filterOccurrences(
  occurrences: Occurrence[],
  { category, status, search }: OccurrenceFilters,
): Occurrence[] {
  const query = normalizeText(search)
  return occurrences.filter(
    (occurrence) =>
      (category === 'todas' || occurrence.categoryId === category) &&
      (status === 'todas' || occurrence.status === status) &&
      (!query || normalizeText(`${occurrence.title} ${occurrence.neighborhood}`).includes(query)),
  )
}

export function formatOccurrenceCount(count: number): string {
  if (count === 0) return 'Nenhum relato'
  return count === 1 ? '1 relato' : `${count} relatos`
}
