import { useState } from 'react'
import { teamRepo } from '@/data/teamRepo'
import type { Occurrence } from '@/domain/types'

interface DeleteForeverProps {
  occurrence: Occurrence
  isAdmin: boolean
  onDeleted: (message: string) => void
}

/** Invalid reports: the team sees why they're here; admins can erase them for good. */
export function DeleteForever({ occurrence, isAdmin, onDeleted }: DeleteForeverProps) {
  const [confirming, setConfirming] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function erase() {
    setDeleting(true)
    setError(null)
    try {
      await teamRepo.deleteOccurrence(occurrence.id)
      onDeleted(`${occurrence.protocol} foi apagado.`)
    } catch (problem) {
      setError((problem as Error).message)
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-aberta/60 bg-concreto p-4">
      <p className="text-sm leading-snug text-carvao">
        <strong className="text-asfalto">Marcado como inválido.</strong> Está fora do mapa e dos
        números, e quem abrir o link vê que o relato não existe.
      </p>

      {!isAdmin ? (
        <p className="text-[13px] text-brita">Só quem é admin da equipe pode apagar de vez.</p>
      ) : confirming ? (
        <div className="flex flex-col gap-2.5" role="alert">
          <p className="text-sm font-bold text-aberta">
            Apagar {occurrence.protocol} de vez, com a foto, as confirmações e o andamento? Não dá
            para desfazer.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={erase}
              disabled={deleting}
              className="h-11 flex-1 rounded-control border-2 border-aberta bg-aberta text-sm font-extrabold text-branco disabled:opacity-60"
            >
              {deleting ? 'Apagando…' : 'Sim, apagar'}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={deleting}
              className="h-11 rounded-control border-2 border-asfalto bg-branco px-4 text-sm font-bold"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="h-11 self-start rounded-control border-2 border-aberta bg-branco px-4 text-sm font-bold text-aberta hover:bg-aberta hover:text-branco"
        >
          Apagar de vez
        </button>
      )}

      {error && (
        <p role="alert" className="text-[13px] font-semibold text-aberta">
          {error}
        </p>
      )}
    </div>
  )
}
