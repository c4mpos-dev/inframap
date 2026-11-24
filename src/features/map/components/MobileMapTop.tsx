import { useState } from 'react'
import { AppIcon } from '@/components/brand/AppIcon'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { iconPaths } from '@/components/icons/paths'
import type { OccurrenceFilters } from '../filterOccurrences'
import type { useMapFilters } from '../useMapFilters'
import { CategoryChips } from './CategoryChips'
import { SearchField } from './SearchField'
import { StatusFilterControl } from './StatusFilterControl'

interface MobileMapTopProps {
  filters: OccurrenceFilters
  actions: Pick<ReturnType<typeof useMapFilters>, 'setCategory' | 'setStatus' | 'setSearch'>
}

export function MobileMapTop({ filters, actions }: MobileMapTopProps) {
  const [statusOpen, setStatusOpen] = useState(false)
  const statusActive = filters.status !== 'todas'

  return (
    <div className="absolute inset-x-0 top-0 z-10 flex flex-col gap-2.5 px-4 pt-[calc(16px+env(safe-area-inset-top))] md:hidden">
      <div className="flex items-center gap-2">
        <AppIcon size={48} label="InfraMap" />
        <SearchField
          variant="floating"
          value={filters.search}
          onChange={actions.setSearch}
          placeholder="Buscar rua ou bairro"
        />
        <button
          type="button"
          aria-label="Filtrar por situação"
          aria-expanded={statusOpen}
          aria-controls="mobile-status-filter"
          onClick={() => setStatusOpen((open) => !open)}
          className={`relative flex size-12 shrink-0 items-center justify-center rounded-[14px] shadow-[0_2px_0_#D3CBB9] ${
            statusOpen ? 'bg-asfalto text-concreto' : 'bg-branco text-asfalto'
          }`}
        >
          <StrokeIcon path={iconPaths.filter} size={20} strokeWidth={2.2} />
          {statusActive && (
            <span className="absolute top-2 right-2 size-2.5 rounded-full border-2 border-branco bg-aberta" />
          )}
        </button>
      </div>
      <div className="-mx-4 scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1">
        <CategoryChips value={filters.category} onChange={actions.setCategory} />
      </div>
      {statusOpen && (
        <div
          id="mobile-status-filter"
          className="animate-rise rounded-[14px] bg-branco p-2 shadow-[0_2px_0_#D3CBB9]"
        >
          <StatusFilterControl value={filters.status} onChange={actions.setStatus} />
        </div>
      )}
    </div>
  )
}
