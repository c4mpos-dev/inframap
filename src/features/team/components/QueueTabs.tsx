import type { StatusId } from '@/domain/types'

export type QueueTab = 'todos' | StatusId | 'invalida'

const tabs: { id: QueueTab; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'aberta', label: 'Novos' },
  { id: 'andamento', label: 'Em andamento' },
  { id: 'resolvida', label: 'Resolvidos' },
  { id: 'invalida', label: 'Inválidos' },
]

interface QueueTabsProps {
  value: QueueTab
  counts: Record<QueueTab, number>
  onChange: (tab: QueueTab) => void
}

export function QueueTabs({ value, counts, onChange }: QueueTabsProps) {
  return (
    <div role="tablist" aria-label="Filtrar a fila" className="flex flex-wrap gap-1.5">
      {tabs.map((tab) => {
        const selected = tab.id === value
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`flex h-10 items-center gap-2 rounded-[10px] border-[1.5px] px-3.5 text-sm font-bold ${
              selected
                ? 'border-asfalto bg-asfalto text-concreto'
                : 'border-linha bg-branco text-asfalto hover:bg-concreto'
            }`}
          >
            {tab.label}
            <span
              className={`rounded-md px-1.5 py-0.5 font-mono text-xs ${selected ? 'bg-[#3A3F3C]' : 'bg-concreto'}`}
            >
              {counts[tab.id]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
