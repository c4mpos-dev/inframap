import type { Occurrence } from '@/domain/types'

export function ResidentStory({ occurrence }: { occurrence: Occurrence }) {
  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-sm font-bold tracking-[0.06em] text-brita uppercase">
        O que o morador contou
      </h2>
      {occurrence.description ? (
        <p className="text-[17px] leading-normal">“{occurrence.description}”</p>
      ) : (
        <p className="text-[15px] text-carvao">O morador não escreveu uma descrição.</p>
      )}
      <span className="text-[13px] text-brita">
        {occurrence.anonymous ? 'Enviado sem identificação' : 'Enviado com identificação'}
      </span>
    </section>
  )
}
