import { getStatus } from '@/domain/statuses'
import type { StatusId } from '@/domain/types'

const steps = ['Registrada', 'Em andamento', 'Resolvida']
const reachedSteps: Record<StatusId, number> = { aberta: 1, andamento: 2, resolvida: 3 }

interface StatusProgressProps {
  status: StatusId
}

export function StatusProgress({ status }: StatusProgressProps) {
  const reached = reachedSteps[status]
  const color = getStatus(status).color

  return (
    <ol aria-label="Andamento" className="grid grid-cols-3 gap-1.5">
      {steps.map((label, index) => {
        const done = index < reached
        return (
          <li
            key={label}
            aria-current={index === reached - 1 ? 'step' : undefined}
            className="flex flex-col gap-1.5"
          >
            <span
              aria-hidden="true"
              className="h-1.5 rounded-[3px] bg-meio-fio"
              style={done ? { backgroundColor: color } : undefined}
            />
            <span className={`text-xs text-carvao ${done ? 'font-bold' : 'font-medium'}`}>
              {label}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
