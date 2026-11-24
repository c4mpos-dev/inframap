import { useState } from 'react'
import type { IndicatorRecord, Indicators } from '@/domain/indicators'
import { CategoryChart } from './components/CategoryChart'
import { ChartCard } from './components/ChartCard'
import { KpiCards } from './components/KpiCards'
import { NeighborhoodRanking } from './components/NeighborhoodRanking'
import { StatusBreakdown } from './components/StatusBreakdown'
import { WeeklyChart } from './components/WeeklyChart'
import { downloadRecordsCsv } from './exportRecordsCsv'
import type { IndicatorsViewProps } from './IndicatorsView'

export function DesktopIndicators({
  indicators,
  records,
  registeredResidents,
  isSample,
  filtersBar,
}: IndicatorsViewProps & { indicators: Indicators; records: IndicatorRecord[] }) {
  const [categoryView, setCategoryView] = useState<'chart' | 'table'>('chart')

  return (
    <div className="mx-auto flex w-full max-w-320 flex-col gap-6 px-6 pt-9 pb-14">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div className="flex flex-col gap-2">
          <span className="flex items-center gap-2.5 font-mono text-xs tracking-[0.08em] text-brita uppercase">
            Resende · RJ
            {isSample && (
              <span className="rounded-md bg-meio-fio px-2 py-0.75 tracking-[0.02em] normal-case">
                dados de exemplo
              </span>
            )}
          </span>
          <h1 className="text-[44px] leading-none font-black tracking-[-0.02em] [font-stretch:120%]">
            Os números da cidade
          </h1>
        </div>
        {filtersBar}
      </div>

      <KpiCards
        indicators={indicators}
        registeredResidents={registeredResidents}
        variant="desktop"
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ChartCard
          title="Relatos por semana"
          className="lg:col-span-2"
          aside={
            <span className="text-[13px] text-brita">Passe o mouse ou o teclado nas barras</span>
          }
        >
          <WeeklyChart key={indicators.weeks.length} weeks={indicators.weeks} variant="desktop" />
        </ChartCard>

        <ChartCard title="Situação dos relatos">
          <StatusBreakdown items={indicators.byStatus} variant="desktop" />
          <p className="mt-auto border-t border-dashed border-[#CFC8B8] pt-3.5 text-[13px] leading-snug text-carvao">
            “Resolvida” só depois que alguém confere no local. Status atualizado conta andamento e
            resolvidas.
          </p>
        </ChartCard>

        <ChartCard
          title="Por categoria"
          aside={
            <button
              type="button"
              onClick={() => setCategoryView((view) => (view === 'chart' ? 'table' : 'chart'))}
              className="h-9 rounded-[10px] border-[1.5px] border-[#CFC8B8] bg-branco px-3 text-[13px] font-bold hover:bg-concreto"
            >
              {categoryView === 'chart' ? 'Ver tabela' : 'Ver gráfico'}
            </button>
          }
        >
          <CategoryChart items={indicators.byCategory} view={categoryView} variant="desktop" />
        </ChartCard>

        <ChartCard
          title="Onde mais aparece"
          className="lg:col-span-2"
          aside={
            <span className="text-[13px] text-brita">Bairros com mais relatos no período</span>
          }
        >
          <NeighborhoodRanking items={indicators.byNeighborhood} variant="desktop" />
        </ChartCard>
      </div>

      <div className="flex flex-wrap justify-between gap-3 text-[13px] text-brita">
        <span>Relatos marcados como duplicados ou inválidos não entram na conta.</span>
        <button
          type="button"
          onClick={() => downloadRecordsCsv(records)}
          className="font-semibold text-asfalto underline hover:text-brita"
        >
          Baixar dados em CSV
        </button>
      </div>
    </div>
  )
}
