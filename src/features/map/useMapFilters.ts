import { useCallback } from 'react'
import { useSearchParams } from 'react-router'
import { categories } from '@/domain/categories'
import { statuses } from '@/domain/statuses'
import type { CategoryFilter, OccurrenceFilters, StatusFilter } from './filterOccurrences'

const PARAMS = {
  category: 'categoria',
  status: 'situacao',
  search: 'busca',
  selected: 'id',
} as const

const categoryIds = new Set<string>(categories.map((category) => category.id))
const statusIds = new Set<string>(statuses.map((status) => status.id))

function readCategory(value: string | null): CategoryFilter {
  return value && categoryIds.has(value) ? (value as CategoryFilter) : 'todas'
}

function readStatus(value: string | null): StatusFilter {
  return value && statusIds.has(value) ? (value as StatusFilter) : 'todas'
}

export function useMapFilters() {
  const [params, setParams] = useSearchParams()

  const filters: OccurrenceFilters = {
    category: readCategory(params.get(PARAMS.category)),
    status: readStatus(params.get(PARAMS.status)),
    search: params.get(PARAMS.search) ?? '',
  }
  const selectedId = params.get(PARAMS.selected)

  const update = useCallback(
    (key: keyof typeof PARAMS, value: string | null) => {
      setParams(
        (current) => {
          const next = new URLSearchParams(current)
          if (value && value !== 'todas') next.set(PARAMS[key], value)
          else next.delete(PARAMS[key])
          return next
        },
        { replace: true },
      )
    },
    [setParams],
  )

  return {
    filters,
    selectedId,
    setCategory: (value: CategoryFilter) => update('category', value),
    setStatus: (value: StatusFilter) => update('status', value),
    setSearch: (value: string) => update('search', value),
    select: (id: string | null) => update('selected', id),
  }
}
