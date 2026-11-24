import { useMemo, type ReactNode } from 'react'
import { computeIndicators, filterRecords } from '@/domain/indicators'
import { useIsDesktop } from '@/lib/useMediaQuery'
import type { IndicatorSource } from '@/data/indicatorsRepo'
import { DesktopIndicators } from './DesktopIndicators'
import { IndicatorFiltersBar } from './components/IndicatorFiltersBar'
import { MobileIndicators } from './MobileIndicators'
import { useIndicatorFilters } from './useIndicatorFilters'

export interface IndicatorsViewProps {
  registeredResidents: number
  isSample: boolean
  filtersBar: ReactNode
}

export function IndicatorsView({ source }: { source: IndicatorSource }) {
  const isDesktop = useIsDesktop()
  const { filters, setPeriod, setNeighborhood, setCategory } = useIndicatorFilters()

  const indicators = useMemo(() => computeIndicators(source.records, filters), [source, filters])
  const records = useMemo(() => filterRecords(source.records, filters), [source, filters])
  const neighborhoods = useMemo(
    () =>
      [...new Set(source.records.map((record) => record.neighborhood))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [source],
  )

  const filtersBar = (
    <IndicatorFiltersBar
      filters={filters}
      neighborhoods={neighborhoods}
      onPeriodChange={setPeriod}
      onNeighborhoodChange={setNeighborhood}
      onCategoryChange={setCategory}
      tone={isDesktop ? 'light' : 'dark'}
    />
  )
  const shared = {
    indicators,
    registeredResidents: source.registeredResidents,
    isSample: source.isSample,
    filtersBar,
  }

  return isDesktop ? (
    <DesktopIndicators {...shared} records={records} />
  ) : (
    <MobileIndicators {...shared} />
  )
}
