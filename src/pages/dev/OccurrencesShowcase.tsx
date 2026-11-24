import { useEffect, useState } from 'react'
import { occurrencesRepo } from '@/data/occurrencesRepo'
import { getCategory } from '@/domain/categories'
import { formatRelativeDay } from '@/domain/relativeTime'
import type { Occurrence } from '@/domain/types'
import { BottomSheet } from '@/components/ui/BottomSheet'
import { Button } from '@/components/ui/Button'
import { OccurrenceCard } from '@/components/ui/OccurrenceCard'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Toast } from '@/components/ui/Toast'
import { useToast } from '@/components/ui/useToast'
import { ShowcaseSection } from './ShowcaseSection'

export function OccurrencesShowcase() {
  const [occurrences, setOccurrences] = useState<Occurrence[]>([])
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { toast, showToast } = useToast()

  useEffect(() => {
    occurrencesRepo.list().then((items) => {
      setOccurrences(items)
      setSelectedId(items[0]?.id ?? null)
    })
  }, [])

  const selected = occurrences.find((item) => item.id === selectedId)

  async function toggleConfirmation(id: string) {
    const updated = await occurrencesRepo.confirm(id)
    setOccurrences((items) => items.map((item) => (item.id === id ? updated : item)))
  }

  return (
    <>
      <ShowcaseSection title={`Cards de ocorrência · ${occurrences.length} relatos de exemplo`}>
        <div className="grid gap-2 md:grid-cols-2">
          {occurrences.map((occurrence) => (
            <OccurrenceCard
              key={occurrence.id}
              occurrence={occurrence}
              selected={occurrence.id === selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Folha inferior">
        {selected && (
          <div className="max-w-sm">
            <BottomSheet key={selected.id} label="Ocorrência selecionada">
              <div className="flex flex-col gap-1">
                <StatusBadge status={selected.status} size="sm" />
                <span className="font-mono text-xs text-brita">
                  {selected.protocol} · {getCategory(selected.categoryId).shortLabel}
                </span>
                <h3 className="text-lg leading-tight font-extrabold">{selected.title}</h3>
                <span className="text-[13px] text-brita">
                  {selected.neighborhood} · {formatRelativeDay(selected.createdAt)}
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  size="md"
                  variant={selected.confirmedByMe ? 'secondary' : 'primary'}
                  className="flex-1"
                  aria-pressed={selected.confirmedByMe}
                  onClick={() => toggleConfirmation(selected.id)}
                >
                  {selected.confirmedByMe ? 'Você confirmou' : 'Eu também vi'}
                  <span className="font-mono font-semibold">{selected.confirmations}</span>
                </Button>
                <Button size="md" variant="secondary">
                  Detalhes
                </Button>
              </div>
            </BottomSheet>
          </div>
        )}
      </ShowcaseSection>

      <ShowcaseSection title="Aviso">
        <div>
          <Button
            size="md"
            variant="secondary"
            onClick={() => showToast('Situação salva. O morador vai ver.')}
          >
            Mostrar aviso
          </Button>
        </div>
        <Toast toast={toast} />
      </ShowcaseSection>
    </>
  )
}
