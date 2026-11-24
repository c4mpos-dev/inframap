import { useState } from 'react'
import { useNavigate } from 'react-router'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { Switch } from '@/components/ui/Switch'
import { CategoryGrid } from './components/CategoryGrid'
import { DescriptionField } from './components/DescriptionField'
import { DuplicateNotice } from './components/DuplicateNotice'
import { FlowHeader } from './components/FlowHeader'
import { LocationStep } from './components/LocationStep'
import { MobileSuccess } from './components/MobileSuccess'
import { PhotoPicker } from './components/PhotoPicker'
import { ReviewSummary } from './components/ReviewSummary'
import { useFinishFlow } from './useFinishFlow'
import type { MarkProblemForm } from './useMarkProblemForm'
import { useNearbyOccurrence } from './useNearbyOccurrence'

const stepTitles = [
  'Onde é o problema?',
  'O que você viu?',
  'Foto e detalhes',
  'Confere antes de enviar',
]
const LAST_STEP = stepTitles.length - 1

export function MobileMarkFlow({ form }: { form: MarkProblemForm }) {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const { draft, patch } = form
  const finish = useFinishFlow(form)
  const nearby = useNearbyOccurrence(draft.location, draft.categoryId)

  if (finish.created) return <MobileSuccess occurrence={finish.created} onShare={finish.share} />

  const needsCategory = step === 1 && !draft.categoryId
  const blocked = needsCategory || (step === 0 && !draft.location) || form.submitting
  const nextLabel =
    step === LAST_STEP
      ? 'Enviar para o mapa'
      : needsCategory
        ? 'Escolha uma categoria'
        : 'Continuar'

  function goBack() {
    if (step === 0) navigate('/mapa')
    else setStep(step - 1)
  }

  function goNext() {
    if (step === LAST_STEP) finish.send()
    else setStep(step + 1)
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-concreto">
      <FlowHeader
        step={step + 1}
        totalSteps={stepTitles.length}
        title={stepTitles[step] ?? ''}
        onBack={goBack}
      />

      {step === 0 && (
        <div className="flex min-h-0 flex-1 animate-slide-in flex-col">
          <LocationStep form={form} variant="mobile" />
        </div>
      )}

      {step === 1 && (
        <div className="flex min-h-0 flex-1 animate-slide-in flex-col gap-3.5 overflow-y-auto px-4 pt-2 pb-4">
          <p className="text-[15px] text-carvao">
            Escolha o que mais parece. Se ficar em dúvida, “Outros” serve.
          </p>
          <CategoryGrid
            variant="mobile"
            value={draft.categoryId}
            onChange={(categoryId) => patch({ categoryId })}
          />
        </div>
      )}

      {step === 2 && (
        <div className="flex min-h-0 flex-1 animate-slide-in flex-col gap-4.5 overflow-y-auto px-4 pt-2 pb-4">
          <PhotoPicker
            variant="mobile"
            photoUrl={draft.photoUrl}
            processing={form.photoStatus === 'processing'}
            failed={form.photoStatus === 'error'}
            onChoose={form.choosePhoto}
            onRemove={() => patch({ photoUrl: null })}
          />
          <DescriptionField
            label="Conta rapidinho o que tá acontecendo"
            value={draft.description}
            onChange={(description) => patch({ description })}
          />
          <Switch
            label="Ocultar meu nome neste relato"
            description="Aparece como Morador(a) de Resende"
            checked={draft.anonymous}
            onChange={(anonymous) => patch({ anonymous })}
          />
        </div>
      )}

      {step === LAST_STEP && (
        <div className="flex min-h-0 flex-1 animate-slide-in flex-col gap-3.5 overflow-y-auto px-4 pt-2 pb-4">
          {nearby && (
            <DuplicateNotice
              nearby={nearby}
              onConfirmExisting={() => finish.confirmExisting(nearby)}
            />
          )}
          <ReviewSummary draft={draft} />
          <p className="text-[13px] leading-snug text-brita">
            O relato fica público no mapa. A equipe do InfraMap organiza e repassa aos órgãos
            responsáveis, mas não consegue garantir prazo de conserto.
          </p>
          {form.submitError && (
            <p role="alert" className="text-sm font-semibold text-aberta">
              {form.submitError}
            </p>
          )}
        </div>
      )}

      <footer className="shrink-0 border-t border-linha bg-concreto px-4 pt-3 pb-[calc(20px+env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={goNext}
          disabled={blocked}
          className={`flex h-14 w-full items-center justify-center gap-2.5 rounded-2xl border-2 border-asfalto text-[17px] font-extrabold ${
            blocked
              ? 'cursor-not-allowed bg-meio-fio text-brita'
              : 'bg-faixa text-asfalto shadow-hard'
          }`}
        >
          {form.submitting ? 'Enviando…' : nextLabel}
          <StrokeIcon path="M5 12h14M13 6l6 6-6 6" size={18} strokeWidth={2.8} />
        </button>
      </footer>
    </div>
  )
}
