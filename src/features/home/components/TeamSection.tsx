import { PROJECT_ADVISOR, PROJECT_MEMBERS } from '@/domain/project'

export function TeamSection() {
  return (
    <section className="mx-auto flex max-w-310 flex-wrap gap-12 px-4 py-10 md:px-6 md:py-22">
      <div className="flex flex-[1_1_360px] flex-col gap-3 md:gap-4">
        <span className="flex h-8 items-center self-start rounded-[9px] bg-asfalto px-3 font-mono text-[13px] font-semibold text-faixa md:h-9 md:px-3.5 md:text-sm">
          ODS 9.1
        </span>
        <h2 className="text-[28px] leading-none font-black [font-stretch:118%] md:text-4xl">
          Quem faz
        </h2>
        <p className="text-[15px] leading-normal text-carvao md:text-[17px]">
          Projeto de extensão do Grupo 3 da Associação Educacional Dom Bosco, ligado à meta 9.1 da
          Agenda 2030: infraestrutura de qualidade, confiável e acessível para todo mundo.
          Orientação de {PROJECT_ADVISOR}.
        </p>
      </div>
      <ul className="hidden flex-[2_1_520px] grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-2.5 md:grid">
        {PROJECT_MEMBERS.map((member) => (
          <li
            key={member}
            className="rounded-[14px] bg-branco px-4 py-3.5 text-[15px] font-semibold"
          >
            {member}
          </li>
        ))}
      </ul>
    </section>
  )
}
