import type { StatusId } from './types'

export interface Status {
  id: StatusId
  label: string
  pluralLabel: string
  description: string
  color: string
}

export const statuses: Status[] = [
  {
    id: 'aberta',
    label: 'Aberta',
    pluralLabel: 'Abertas',
    description: 'Registrada, esperando alguém olhar',
    color: '#C2410C',
  },
  {
    id: 'andamento',
    label: 'Em andamento',
    pluralLabel: 'Andando',
    description: 'Encaminhada ou em obra',
    color: '#1D5FD1',
  },
  {
    id: 'resolvida',
    label: 'Resolvida',
    pluralLabel: 'Resolvidas',
    description: 'Consertada e conferida',
    color: '#157A4F',
  },
]

const statusesById = new Map(statuses.map((status) => [status.id, status]))

export function getStatus(id: StatusId): Status {
  const status = statusesById.get(id)
  if (!status) throw new Error(`Situação desconhecida: ${id}`)
  return status
}
