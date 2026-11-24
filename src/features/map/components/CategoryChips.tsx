import { allCategoriesIconPath, categories } from '@/domain/categories'
import { Chip } from '@/components/ui/Chip'
import type { CategoryFilter } from '../filterOccurrences'

interface CategoryChipsProps {
  value: CategoryFilter
  onChange: (value: CategoryFilter) => void
}

export function CategoryChips({ value, onChange }: CategoryChipsProps) {
  return (
    <>
      <Chip
        label="Tudo"
        iconPath={allCategoriesIconPath}
        selected={value === 'todas'}
        onClick={() => onChange('todas')}
      />
      {categories.map((category) => (
        <Chip
          key={category.id}
          label={category.shortLabel}
          iconPath={category.iconPath}
          selected={value === category.id}
          onClick={() => onChange(category.id)}
        />
      ))}
    </>
  )
}
