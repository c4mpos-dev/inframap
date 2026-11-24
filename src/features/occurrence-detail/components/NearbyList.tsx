import { Link } from 'react-router'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import type { NearbyOccurrence } from '@/data/occurrencesRepo'
import { formatDistance } from '@/domain/relativeTime'

const TARGET_PATH = 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8z'

export function NearbyList({ nearby }: { nearby: NearbyOccurrence[] }) {
  if (nearby.length === 0) return null

  return (
    <section className="flex flex-col gap-2.5 rounded-[18px] bg-meio-fio p-4">
      <h2 className="flex items-center gap-2 text-[15px] font-bold">
        <StrokeIcon path={TARGET_PATH} size={18} />
        Parecidos aqui perto
      </h2>
      <ul className="flex flex-col gap-2">
        {nearby.map(({ occurrence, distanceMeters }) => (
          <li key={occurrence.id}>
            <Link
              to={`/ocorrencia/${occurrence.id}`}
              className="flex min-h-11 items-center justify-between gap-3 rounded-control bg-branco px-3.5 py-3 text-sm font-semibold text-asfalto no-underline hover:bg-concreto"
            >
              <span>{occurrence.title}</span>
              <span className="shrink-0 font-mono text-xs font-normal text-brita">
                {formatDistance(distanceMeters)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="text-[13px] leading-snug text-carvao">
        É o mesmo problema? Confirme o relato que já existe em vez de abrir outro.
      </p>
    </section>
  )
}
