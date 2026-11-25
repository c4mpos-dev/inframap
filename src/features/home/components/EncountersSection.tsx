import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { PROJECT_INSTAGRAM } from '@/domain/project'
import { INSTAGRAM_PATH, instagramUrl } from '@/domain/instagram'

const steps = [
  { title: 'A gente combina', text: 'com a associação de moradores do bairro.' },
  { title: 'Leva o InfraMap', text: 'e mostra como marcar no celular de cada um.' },
  { title: 'Marca junto', text: 'os problemas que a vizinhança aponta na hora.' },
]

export function EncountersSection() {
  return (
    <section
      id="encontros"
      data-surface="dark"
      className="mt-6 scroll-mt-4 bg-asfalto text-concreto md:mt-0"
    >
      <div className="mx-auto flex max-w-310 flex-col gap-6 px-4 py-11 md:gap-9 md:px-6 md:py-22">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <h2 className="text-[34px] leading-[0.95] font-black tracking-[-0.02em] [font-stretch:120%] md:text-[clamp(36px,4vw,56px)]">
            A gente vai
            <br />
            até o <span className="text-faixa">seu bairro.</span>
          </h2>
          <p className="max-w-115 text-[15px] leading-normal text-poeira md:text-lg">
            Encontros nas associações de moradores para mostrar a plataforma, tirar dúvidas e marcar
            os problemas juntos. Traga o celular.
          </p>
        </div>
        <ol className="grid gap-2.5 md:grid-cols-3 md:gap-4">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex items-start gap-4 rounded-2xl bg-asfalto-2 p-4 transition-transform duration-200 hover:-translate-y-1 md:rounded-card md:p-6"
            >
              <span className="font-mono text-2xl font-semibold text-faixa md:text-3xl">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="flex flex-col gap-1">
                <strong className="text-base md:text-xl">{step.title}</strong>
                <span className="text-[13px] text-poeira md:text-[15px]">{step.text}</span>
              </span>
            </li>
          ))}
        </ol>
        <a
          href={instagramUrl(PROJECT_INSTAGRAM)}
          target="_blank"
          rel="noreferrer"
          className="flex h-13 items-center justify-center gap-2.5 self-stretch rounded-[14px] border-2 border-grafite px-5 text-[15px] font-bold text-concreto no-underline transition-colors hover:border-faixa hover:text-faixa md:self-start md:text-base"
        >
          <StrokeIcon path={INSTAGRAM_PATH} size={20} />
          Siga @{PROJECT_INSTAGRAM} para saber dos próximos encontros
        </a>
      </div>
    </section>
  )
}
