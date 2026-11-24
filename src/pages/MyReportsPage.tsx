import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { ButtonLink } from '@/components/ui/Button'
import { OccurrenceCard } from '@/components/ui/OccurrenceCard'
import { occurrencesRepo } from '@/data/occurrencesRepo'
import type { Occurrence } from '@/domain/types'
import { RequireAccount } from '@/features/auth/RequireAccount'
import { formatOccurrenceCount } from '@/features/map/filterOccurrences'

function MyReports() {
  const navigate = useNavigate()
  const [reports, setReports] = useState<Occurrence[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    occurrencesRepo
      .listMine()
      .then((items) => active && setReports(items))
      .catch(() => active && setFailed(true))
    return () => {
      active = false
    }
  }, [])

  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-5 px-4 py-10 md:px-6 md:py-14">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl leading-none font-display md:text-5xl">Meus relatos</h1>
        {reports && (
          <p className="font-mono text-[13px] text-brita">
            {formatOccurrenceCount(reports.length)}
          </p>
        )}
      </div>

      {failed ? (
        <p role="alert" className="text-[15px] text-carvao">
          Não deu para carregar seus relatos agora. Tente de novo daqui a pouco.
        </p>
      ) : reports === null ? (
        <p className="text-[15px] text-brita" aria-busy="true">
          Carregando…
        </p>
      ) : reports.length === 0 ? (
        <div className="flex flex-col gap-4 rounded-2xl border-2 border-dashed border-linha p-5">
          <p className="text-[15px] text-carvao">
            Você ainda não marcou nenhum problema. Viu um buraco, bueiro ou poste apagado?
          </p>
          <ButtonLink to="/marcar" className="self-start">
            Marcar um problema
          </ButtonLink>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {reports.map((occurrence) => (
            <li key={occurrence.id}>
              <OccurrenceCard
                occurrence={occurrence}
                onSelect={(id) => navigate(`/ocorrencia/${id}`)}
              />
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default function MyReportsPage() {
  return (
    <RequireAccount>
      <MyReports />
    </RequireAccount>
  )
}
