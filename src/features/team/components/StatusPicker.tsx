import { statuses } from '@/domain/statuses'
import type { StatusId } from '@/domain/types'

interface StatusPickerProps {
  value: StatusId
  onChange: (status: StatusId) => void
}

export function StatusPicker({ value, onChange }: StatusPickerProps) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className="mb-2.5 text-sm font-bold">Situação</legend>
      <div className="grid grid-cols-3 gap-1.5">
        {statuses.map((status) => {
          const selected = status.id === value
          return (
            <button
              key={status.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(status.id)}
              className="h-12 rounded-control border-2 text-sm font-bold"
              style={
                selected
                  ? { backgroundColor: status.color, borderColor: status.color, color: '#FFFFFF' }
                  : { borderColor: '#E0DACD', backgroundColor: '#FFFFFF' }
              }
            >
              {status.label}
            </button>
          )
        })}
      </div>
    </fieldset>
  )
}
