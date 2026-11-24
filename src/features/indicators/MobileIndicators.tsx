import type { Indicators } from '@/domain/indicators'
import { CategoryChart } from './components/CategoryChart'
import { ChartCard } from './components/ChartCard'
import { KpiCards } from './components/KpiCards'
import { NeighborhoodRanking } from './components/NeighborhoodRanking'
import { StatusBreakdown } from './components/StatusBreakdown'
import { WeeklyChart } from './components/WeeklyChart'
import type { IndicatorsViewProps } from './IndicatorsView'

export function MobileIndicators({
  indicators,
  registeredResidents,
  isSample,
  filtersBar,
}: IndicatorsViewProps & { indicators: Indicators }) {
  return (
    <div className="flex flex-col">
      <header
        data-surface="dark"
        className="flex flex-col gap-3.5 bg-asfalto px-4 pt-6 pb-5 text-concreto"
      >
        <span className="flex items-center gap-2 font-mono text-xs text-[#B8B3A8]">
          RESENDE · RJ
          {isSample && (
            <span className="rounded-[5px] bg-asfalto-2 px-1.5 py-0.5">dados de exemplo</span>
          )}
        </span>
        <h1 className="text-[34px] leading-[0.95] font-black tracking-[-0.02em] [font-stretch:122%]">
          Os números
          <br />
          da cidade
        </h1>
        {filtersBar}
      </header>
      <div className="flex flex-col gap-3.5 px-4 pt-4 pb-8">
        <KpiCards
          indicators={indicators}
          registeredResidents={registeredResidents}
          variant="mobile"
        />
        <ChartCard title="Por semana" compact>
          <WeeklyChart key={indicators.weeks.length} weeks={indicators.weeks} variant="mobile" />
        </ChartCard>
        <ChartCard title="Situação" compact>
          <StatusBreakdown items={indicators.byStatus} variant="mobile" />
        </ChartCard>
        <ChartCard title="Por categoria" compact>
          <CategoryChart items={indicators.byCategory} view="chart" variant="mobile" />
        </ChartCard>
        <ChartCard title="Bairros com mais relatos" compact>
          <NeighborhoodRanking items={indicators.byNeighborhood.slice(0, 5)} variant="mobile" />
        </ChartCard>
      </div>
    </div>
  )
}
