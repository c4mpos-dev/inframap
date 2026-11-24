import { statuses } from '@/domain/statuses'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import type { StatusFilter } from '../filterOccurrences'

const options: { value: StatusFilter; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  ...statuses.map((status) => ({ value: status.id, label: status.pluralLabel })),
]

interface StatusFilterControlProps {
  value: StatusFilter
  onChange: (value: StatusFilter) => void
}

export function StatusFilterControl({ value, onChange }: StatusFilterControlProps) {
  return <SegmentedControl label="Situação" options={options} value={value} onChange={onChange} />
}
