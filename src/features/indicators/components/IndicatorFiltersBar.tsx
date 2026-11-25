import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { categories } from '@/domain/categories'
import type { IndicatorFilters, IndicatorPeriod } from '@/domain/indicators'
import type { CategoryId } from '@/domain/types'
import { SelectField } from './SelectField'

const periodOptions: { value: IndicatorPeriod; label: string }[] = [
  { value: '4s', label: '4 semanas' },
  { value: 'tudo', label: 'Desde o início' },
]

const ALL = 'todos'

interface IndicatorFiltersBarProps {
  filters: IndicatorFilters
  neighborhoods: string[]
  onPeriodChange: (period: IndicatorPeriod) => void
  onNeighborhoodChange: (neighborhood: string | null) => void
  onCategoryChange: (categoryId: CategoryId | null) => void
  tone: 'light' | 'dark'
}

export function IndicatorFiltersBar({
  filters,
  neighborhoods,
  onPeriodChange,
  onNeighborhoodChange,
  onCategoryChange,
  tone,
}: IndicatorFiltersBarProps) {
  return (
    <div className="flex flex-wrap gap-2.5">
      <div className={tone === 'dark' ? 'w-full' : 'w-full sm:w-auto'}>
        <SegmentedControl
          label="Período"
          options={periodOptions}
          value={filters.period}
          onChange={onPeriodChange}
          tone={tone}
          size={tone === 'light' ? 'md' : 'sm'}
        />
      </div>
      <SelectField
        label="Bairro"
        value={filters.neighborhood ?? ALL}
        onChange={(value) => onNeighborhoodChange(value === ALL ? null : value)}
        options={[
          { value: ALL, label: tone === 'dark' ? 'Bairros' : 'Todos os bairros' },
          ...neighborhoods.map((name) => ({ value: name, label: name })),
        ]}
      />
      <SelectField
        label="Categoria"
        value={filters.categoryId ?? ALL}
        onChange={(value) => onCategoryChange(value === ALL ? null : (value as CategoryId))}
        options={[
          { value: ALL, label: tone === 'dark' ? 'Categorias' : 'Todas as categorias' },
          ...categories.map((category) => ({ value: category.id, label: category.label })),
        ]}
      />
    </div>
  )
}
