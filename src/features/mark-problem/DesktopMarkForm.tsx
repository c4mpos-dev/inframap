import type { ReactNode } from 'react'
import { Switch } from '@/components/ui/Switch'
import { CategoryGrid } from './components/CategoryGrid'
import { DescriptionField } from './components/DescriptionField'
import { DuplicateNotice } from './components/DuplicateNotice'
import { LocationStep } from './components/LocationStep'
import { PhotoPicker } from './components/PhotoPicker'
import { SuccessDialog } from './components/SuccessDialog'
import { useFinishFlow } from './useFinishFlow'
import type { MarkProblemForm } from './useMarkProblemForm'
import { useNearbyOccurrence } from './useNearbyOccurrence'

function NumberedSection({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2.5 text-base font-extrabold">
        <span className="flex size-6.5 items-center justify-center rounded-lg bg-asfalto font-mono text-[13px] text-faixa">
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

export function DesktopMarkForm({ form }: { form: MarkProblemForm }) {
  const { draft, patch } = form
  const finish = useFinishFlow(form)
  const nearby = useNearbyOccurrence(draft.location, draft.categoryId)
  const blocked = !draft.categoryId || !draft.location || form.submitting

  return (
    <div className="relative flex h-[calc(100dvh-4.25rem)] flex-wrap overflow-hidden">
      <section
        aria-label="Escolher o local no mapa"
        className="relative flex h-full min-w-0 flex-[999_1_520px]"
      >
        <LocationStep form={form} variant="desktop" />
      </section>

      <aside className="flex h-full max-w-125 flex-[1_1_420px] flex-col gap-7 overflow-y-auto border-l border-linha bg-concreto p-8">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[34px] leading-none font-black tracking-[-0.02em] [font-stretch:118%]">
            Marcar um problema
          </h1>
          <p className="text-[15px] text-carvao">Leva menos de um minuto.</p>
        </div>

        <NumberedSection number={1} title="O que você viu?">
          <CategoryGrid
            variant="desktop"
            value={draft.categoryId}
            onChange={(categoryId) => patch({ categoryId })}
          />
        </NumberedSection>

        <NumberedSection number={2} title="Foto e descrição">
          <PhotoPicker
            variant="desktop"
            photoUrl={draft.photoUrl}
            processing={form.photoStatus === 'processing'}
            failed={form.photoStatus === 'error'}
            onChoose={form.choosePhoto}
            onRemove={() => patch({ photoUrl: null })}
          />
          <DescriptionField
            label="Descrição"
            value={draft.description}
            onChange={(description) => patch({ description })}
          />
        </NumberedSection>

        <NumberedSection number={3} title="Quem está marcando">
          <Switch
            label="Ocultar meu nome neste relato"
            description="Aparece como Morador(a) de Resende"
            checked={draft.anonymous}
            onChange={(anonymous) => patch({ anonymous })}
          />
        </NumberedSection>

        <div className="mt-auto flex flex-col gap-2.5">
          {nearby && (
            <DuplicateNotice
              nearby={nearby}
              onConfirmExisting={() => finish.confirmExisting(nearby)}
            />
          )}
          {form.submitError && (
            <p role="alert" className="text-sm font-semibold text-aberta">
              {form.submitError}
            </p>
          )}
          <button
            type="button"
            onClick={finish.send}
            disabled={blocked}
            className={`h-14 rounded-2xl border-2 border-asfalto text-[17px] font-extrabold ${
              blocked
                ? 'cursor-not-allowed bg-meio-fio text-brita'
                : 'bg-faixa text-asfalto shadow-hard'
            }`}
          >
            {form.submitting
              ? 'Enviando…'
              : draft.categoryId
                ? 'Enviar para o mapa'
                : 'Escolha uma categoria'}
          </button>
          <span className="text-[13px] leading-snug text-brita">
            O relato fica público no mapa. A gente organiza e repassa, mas não garante prazo de
            conserto.
          </span>
        </div>
      </aside>

      {finish.created && (
        <SuccessDialog occurrence={finish.created} onStartOver={finish.startOver} />
      )}
    </div>
  )
}
