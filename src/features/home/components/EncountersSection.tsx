import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { ENCOUNTERS, PROJECT_INSTAGRAM } from '@/domain/project'

const INSTAGRAM_PATH =
  'M8 3h8a5 5 0 0 1 5 5v8a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5zM12 8a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM17.5 6.5h.01'

export function EncountersSection() {
  const instagramLabel = `Siga @${PROJECT_INSTAGRAM ?? '[perfil do projeto]'} para saber as datas`
  const instagramClass =
    'flex h-13 items-center justify-center gap-2.5 self-stretch rounded-[14px] border-2 border-grafite px-5 text-[15px] font-bold text-concreto no-underline md:self-start md:text-base'

  return (
    <section
      id="encontros"
      data-surface="dark"
      className="mt-6 scroll-mt-4 bg-asfalto text-concreto md:mt-0"
    >
      <div className="mx-auto flex max-w-310 flex-col gap-4 px-4 py-11 md:gap-9 md:px-6 md:py-22">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h2 className="text-[34px] leading-[0.95] font-black tracking-[-0.02em] [font-stretch:120%] md:text-[clamp(36px,4vw,56px)]">
            A gente vai
            <br />
            até o <span className="text-faixa">seu bairro.</span>
          </h2>
          <p className="max-w-115 text-[15px] leading-normal text-poeira md:text-lg">
            Quatro encontros nas associações de moradores para mostrar a plataforma, tirar dúvidas e
            marcar os problemas juntos. Traga o celular.
          </p>
        </div>
        <ol className="grid grid-cols-2 gap-2.5 md:grid-cols-[repeat(auto-fit,minmax(240px,1fr))] md:gap-4">
          {ENCOUNTERS.map((encounter, index) => (
            <li
              key={index}
              className="flex flex-col gap-1.5 rounded-2xl bg-asfalto-2 p-4 md:gap-2.5 md:rounded-card md:p-6"
            >
              <span className="font-mono text-[11px] text-faixa md:text-[13px]">
                ENCONTRO {index + 1}
              </span>
              <strong className="text-sm md:text-xl">
                {encounter.association ?? '[Associação de moradores]'}
              </strong>
              <span className="text-[13px] text-poeira md:text-[15px]">
                {encounter.schedule ?? '[data e horário]'}
              </span>
            </li>
          ))}
        </ol>
        {PROJECT_INSTAGRAM ? (
          <a href={`https://instagram.com/${PROJECT_INSTAGRAM}`} className={instagramClass}>
            <StrokeIcon path={INSTAGRAM_PATH} size={20} />
            {instagramLabel}
          </a>
        ) : (
          <span className={instagramClass}>
            <StrokeIcon path={INSTAGRAM_PATH} size={20} />
            {instagramLabel}
          </span>
        )}
      </div>
    </section>
  )
}
