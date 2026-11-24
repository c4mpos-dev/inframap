import type { Occurrence } from '@/domain/types'
import { OccurrenceCard } from '@/components/ui/OccurrenceCard'
import { formatOccurrenceCount, type OccurrenceFilters } from '../filterOccurrences'
import type { useMapFilters } from '../useMapFilters'
import { CategoryChips } from './CategoryChips'
import { SearchField } from './SearchField'
import { StatusFilterControl } from './StatusFilterControl'

interface DesktopMapPanelProps {
  filters: OccurrenceFilters
  actions: Pick<ReturnType<typeof useMapFilters>, 'setCategory' | 'setStatus' | 'setSearch'>
  occurrences: Occurrence[]
  loading: boolean
  selectedId: string | null
  onSelect: (id: string) => void
}

export function DesktopMapPanel({
  filters,
  actions,
  occurrences,
  loading,
  selectedId,
  onSelect,
}: DesktopMapPanelProps) {
  return (
    <aside className="hidden h-full w-full max-w-105 min-w-90 flex-col gap-5 overflow-y-auto border-r border-linha px-6 py-7 md:flex md:w-[30%]">
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-xs tracking-[0.08em] text-brita uppercase">
          Resende · RJ
        </span>
        <h1 className="text-[34px] leading-none font-black tracking-[-0.02em] [font-stretch:118%]">
          O que tá pegando
          <br />
          no seu bairro
        </h1>
      </div>

      <SearchField
        variant="panel"
        value={filters.search}
        onChange={actions.setSearch}
        placeholder="Rua, bairro ou ponto de referência"
      />

      <div className="flex flex-col gap-2.5">
        <span className="text-[13px] font-bold text-carvao">Categoria</span>
        <div className="flex flex-wrap gap-2">
          <CategoryChips value={filters.category} onChange={actions.setCategory} />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="text-[13px] font-bold text-carvao">Situação</span>
        <StatusFilterControl value={filters.status} onChange={actions.setStatus} />
      </div>

      <div className="flex items-baseline justify-between border-t border-dashed border-[#CFC8B8] pt-1">
        <span aria-live="polite" className="pt-3.5 text-[15px] font-bold">
          {loading ? 'Carregando relatos…' : formatOccurrenceCount(occurrences.length)}
        </span>
        <span className="font-mono text-xs text-brita">mais recentes</span>
      </div>

      <div className="flex flex-col gap-2">
        {occurrences.map((occurrence) => (
          <OccurrenceCard
            key={occurrence.id}
            occurrence={occurrence}
            selected={occurrence.id === selectedId}
            onSelect={onSelect}
          />
        ))}
        {!loading && occurrences.length === 0 && (
          <p className="rounded-[14px] bg-branco/45 p-4 text-sm text-carvao">
            Nada por aqui com esses filtros. Tente outra categoria ou situação.
          </p>
        )}
      </div>
    </aside>
  )
}
