import { ControlsShowcase } from './ControlsShowcase'
import { OccurrencesShowcase } from './OccurrencesShowcase'
import { StatusShowcase } from './StatusShowcase'

export default function ComponentsPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12">
      <header className="flex flex-col gap-2">
        <span className="font-mono text-xs tracking-[0.08em] text-brita uppercase">
          Só em desenvolvimento
        </span>
        <h1 className="text-4xl leading-none font-display md:text-5xl">Componentes</h1>
      </header>
      <ControlsShowcase />
      <StatusShowcase />
      <OccurrencesShowcase />
    </div>
  )
}
