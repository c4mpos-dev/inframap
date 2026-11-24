import { useMemo, useState } from 'react'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { Toast } from '@/components/ui/Toast'
import { useToast } from '@/components/ui/useToast'
import { normalizeText } from '@/features/map/filterOccurrences'
import { QueueTable } from './components/QueueTable'
import { QueueTabs, type QueueTab } from './components/QueueTabs'
import { ReviewPanel } from './components/ReviewPanel'
import { useTeamQueue } from './useTeamQueue'

export function TeamQueue() {
  const { items, reload } = useTeamQueue()
  const [tab, setTab] = useState<QueueTab>('todos')
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const { toast, showToast } = useToast()

  const all = useMemo(() => items ?? [], [items])
  const counts = useMemo(
    () => ({
      todos: all.length,
      aberta: all.filter((item) => item.occurrence.status === 'aberta').length,
      andamento: all.filter((item) => item.occurrence.status === 'andamento').length,
      resolvida: all.filter((item) => item.occurrence.status === 'resolvida').length,
    }),
    [all],
  )
  const query = normalizeText(search)
  const rows = all.filter(
    ({ occurrence }) =>
      (tab === 'todos' || occurrence.status === tab) &&
      (!query ||
        normalizeText(`${occurrence.protocol} ${occurrence.neighborhood}`).includes(query)),
  )
  const selected =
    all.find((item) => item.occurrence.id === selectedId)?.occurrence ?? rows[0]?.occurrence

  async function handleSaved(message: string) {
    await reload()
    showToast(message)
  }

  return (
    <div className="flex min-h-[calc(100dvh-4.25rem)] flex-col lg:h-[calc(100dvh-4.25rem)] lg:flex-row">
      <section className="flex min-w-0 flex-1 flex-col gap-4.5 px-4 py-7 md:px-6 lg:overflow-hidden">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[34px] leading-none font-black tracking-[-0.02em] [font-stretch:118%]">
              Fila de relatos
            </h1>
            <span className="text-sm text-brita">
              Confira, junte duplicados e atualize a situação.
            </span>
          </div>
          <label className="flex h-11 min-w-65 items-center gap-2.5 rounded-control border-[1.5px] border-linha bg-branco px-3.5 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-asfalto">
            <StrokeIcon
              path="M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-3.5-3.5"
              size={18}
              className="text-brita"
            />
            <span className="sr-only">Buscar por protocolo ou bairro</span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Protocolo, bairro…"
              className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-[#6B655B]"
            />
          </label>
        </div>
        <QueueTabs value={tab} counts={counts} onChange={setTab} />
        <div className="min-h-0 flex-1 overflow-auto rounded-2xl bg-branco">
          {items === null ? (
            <p className="p-6 text-sm text-carvao">Carregando a fila…</p>
          ) : (
            <QueueTable items={rows} selectedId={selected?.id ?? null} onSelect={setSelectedId} />
          )}
        </div>
      </section>

      <aside className="w-full shrink-0 overflow-y-auto border-t border-linha bg-branco px-6 py-7 lg:w-115 lg:border-t-0 lg:border-l">
        {selected ? (
          <ReviewPanel
            key={`${selected.id}-${selected.status}`}
            occurrence={selected}
            onSaved={handleSaved}
          />
        ) : (
          <p className="text-sm text-carvao">Escolha um relato na fila.</p>
        )}
      </aside>
      <Toast toast={toast} />
    </div>
  )
}
