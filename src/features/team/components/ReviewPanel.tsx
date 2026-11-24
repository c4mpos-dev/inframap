import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { PhotoPlaceholder } from '@/components/ui/PhotoPlaceholder'
import type { NearbyOccurrence } from '@/data/occurrencesRepo'
import { teamRepo } from '@/data/teamRepo'
import { getCategory } from '@/domain/categories'
import type { Occurrence, StatusId } from '@/domain/types'
import { forwardTargets } from '../forwardTargets'
import { DuplicateCard } from './DuplicateCard'
import { StatusPicker } from './StatusPicker'

const NOT_FORWARDED = ''

interface ReviewPanelProps {
  occurrence: Occurrence
  onSaved: (message: string) => void
}

export function ReviewPanel({ occurrence, onSaved }: ReviewPanelProps) {
  const [status, setStatus] = useState<StatusId>(occurrence.status)
  const [forwardedTo, setForwardedTo] = useState(occurrence.forwardedTo ?? NOT_FORWARDED)
  const [note, setNote] = useState('')
  const [duplicate, setDuplicate] = useState<NearbyOccurrence | null>(null)

  useEffect(() => {
    let active = true
    teamRepo.possibleDuplicate(occurrence).then((candidate) => active && setDuplicate(candidate))
    return () => {
      active = false
    }
  }, [occurrence])

  async function save() {
    await teamRepo.update(occurrence.id, { status, forwardedTo: forwardedTo || null, note })
    setNote('')
    onSaved('Situação salva. O morador vai ver.')
  }

  async function merge(candidate: NearbyOccurrence) {
    const newer =
      candidate.occurrence.createdAt > occurrence.createdAt ? candidate.occurrence : occurrence
    const original = newer.id === occurrence.id ? candidate.occurrence : occurrence
    await teamRepo.markDuplicate(newer.id, original.id)
    onSaved(`${newer.protocol} virou duplicado de ${original.protocol}.`)
  }

  async function dismiss(candidate: NearbyOccurrence) {
    await teamRepo.dismissDuplicate(occurrence.id, candidate.occurrence.id)
    setDuplicate(null)
  }

  async function markInvalid() {
    await teamRepo.markInvalid(occurrence.id)
    onSaved(`${occurrence.protocol} saiu do mapa.`)
  }

  return (
    <div className="flex animate-slide-in flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <span className="font-mono text-xs text-brita">
          {occurrence.protocol} · {getCategory(occurrence.categoryId).shortLabel} ·{' '}
          {occurrence.neighborhood}
        </span>
        <h2 className="text-2xl leading-tight font-extrabold [font-stretch:110%]">
          {occurrence.title}
        </h2>
        <Link
          to={`/ocorrencia/${occurrence.id}`}
          className="flex items-center gap-1 self-start text-[13px] font-semibold text-brita"
        >
          Abrir como o morador vê
          <StrokeIcon path="M7 17L17 7M9 7h8v8" size={14} />
        </Link>
      </div>

      {occurrence.photoUrl ? (
        <img
          src={occurrence.photoUrl}
          alt="Foto do morador"
          className="h-37.5 rounded-[14px] object-cover"
        />
      ) : (
        <PhotoPlaceholder className="h-37.5 rounded-[14px]" label="sem foto" />
      )}

      {occurrence.description && (
        <p className="text-sm leading-snug text-carvao">“{occurrence.description}”</p>
      )}

      <StatusPicker value={status} onChange={setStatus} />

      <label className="relative flex flex-col gap-2 text-sm font-bold">
        Repassado para
        <select
          value={forwardedTo}
          onChange={(event) => setForwardedTo(event.target.value)}
          className="h-12 appearance-none rounded-control border-[1.5px] border-[#CFC8B8] bg-branco pr-10 pl-3.5 text-sm font-medium"
        >
          <option value={NOT_FORWARDED}>Ainda não repassado</option>
          {forwardTargets.map((target) => (
            <option key={target}>{target}</option>
          ))}
        </select>
        <StrokeIcon
          path="M6 9l6 6 6-6"
          size={18}
          strokeWidth={2.4}
          className="pointer-events-none absolute right-3.5 bottom-3.5"
        />
      </label>

      {duplicate && (
        <DuplicateCard
          candidate={duplicate}
          onMerge={() => merge(duplicate)}
          onDismiss={() => dismiss(duplicate)}
        />
      )}

      <label className="flex flex-col gap-2 text-sm font-bold">
        <span>
          Nota para o morador{' '}
          <span className="text-xs font-normal text-brita">Aparece no andamento do relato</span>
        </span>
        <textarea
          rows={3}
          value={note}
          maxLength={300}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Ex.: repassado à Secretaria de Obras junto com outros 3 relatos da rua."
          className="resize-y rounded-control border-[1.5px] border-[#CFC8B8] p-3 text-sm leading-snug font-normal outline-none placeholder:text-[#6B655B] focus:border-asfalto"
        />
      </label>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={save}
          className="h-13 flex-1 rounded-[14px] border-2 border-asfalto bg-faixa text-base font-extrabold shadow-hard"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={markInvalid}
          className="h-13 rounded-[14px] border-2 border-aberta bg-branco px-4 text-sm font-bold text-aberta"
        >
          Marcar inválido
        </button>
      </div>
    </div>
  )
}
