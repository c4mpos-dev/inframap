import { useSearchParams } from 'react-router'
import { categories } from '@/domain/categories'
import type { IndicatorFilters, IndicatorPeriod } from '@/domain/indicators'
import type { CategoryId } from '@/domain/types'

const periods: IndicatorPeriod[] = ['4s', 'tudo']
const categoryIds = new Set<string>(categories.map((category) => category.id))

export function useIndicatorFilters() {
  const [params, setParams] = useSearchParams()

  const periodParam = params.get('periodo')
  const categoryParam = params.get('categoria')
  const filters: IndicatorFilters = {
    period: periods.find((period) => period === periodParam) ?? 'tudo',
    neighborhood: params.get('bairro'),
    categoryId:
      categoryParam && categoryIds.has(categoryParam) ? (categoryParam as CategoryId) : null,
  }

  function update(key: string, value: string | null) {
    setParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (value) next.set(key, value)
        else next.delete(key)
        return next
      },
      { replace: true },
    )
  }

  return {
    filters,
    setPeriod: (period: IndicatorPeriod) => update('periodo', period === 'tudo' ? null : period),
    setNeighborhood: (neighborhood: string | null) => update('bairro', neighborhood),
    setCategory: (categoryId: CategoryId | null) => update('categoria', categoryId),
  }
}
