import { StrokeIcon } from '@/components/icons/StrokeIcon'

const steps = [
  {
    number: '01',
    title: 'Marca',
    text: 'Tira a foto, escolhe o tipo de problema e confirma o lugar. Pode ser sem nome.',
    icon: 'M3 8h3l2-3h8l2 3h3v11H3zM12 9.5a3.5 3.5 0 1 0 0 7a3.5 3.5 0 1 0 0-7z',
    className: 'bg-branco',
    numberClass: 'text-brita',
    textClass: 'text-carvao',
  },
  {
    number: '02',
    title: 'A vizinhança confirma',
    text: 'Quem passa por ali toca em “eu também vi”. Relato repetido vira um só, e mais forte.',
    icon: 'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z',
    className: 'bg-faixa',
    numberClass: '',
    textClass: '',
  },
  {
    number: '03',
    title: 'Todo mundo acompanha',
    text: 'A equipe organiza os relatos, repassa a quem cuida e atualiza a situação: aberta, em andamento, resolvida.',
    icon: 'M4 12h4l2-5 4 10 2-5h4',
    className: 'bg-asfalto text-concreto',
    numberClass: 'text-[#B8B3A8]',
    textClass: 'text-poeira',
  },
]

export function HowItWorks() {
  return (
    <section
      id="como"
      className="mx-auto flex max-w-310 scroll-mt-4 flex-col gap-5 px-4 pt-12 pb-6 md:gap-10 md:px-6 md:pt-24 md:pb-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-5">
        <h2 className="text-[34px] leading-[0.95] font-black tracking-[-0.02em] [font-stretch:120%] md:text-[clamp(36px,4vw,56px)]">
          Três passos,
          <br />
          um minuto.
        </h2>
        <p className="hidden max-w-110 text-lg leading-normal text-carvao md:block">
          Pelo celular ou pelo computador. Funciona com o GPS ligado ou apontando no mapa com o
          dedo.
        </p>
      </div>
      <ol className="grid grid-cols-1 gap-3.5 md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))] md:gap-5">
        {steps.map((step) => (
          <li
            key={step.number}
            className={`flex gap-4 rounded-card p-5 md:min-h-70 md:flex-col md:gap-4.5 md:rounded-3xl md:p-7 ${step.className}`}
          >
            <span className={`font-mono text-sm md:text-[15px] ${step.numberClass}`}>
              {step.number}
            </span>
            <StrokeIcon
              path={step.icon}
              size={48}
              strokeWidth={1.6}
              className={`hidden md:block ${step.number === '03' ? 'text-faixa' : ''}`}
            />
            <span className="flex flex-col gap-1 md:gap-4.5">
              <h3 className="text-xl font-extrabold md:text-[26px] md:[font-stretch:112%]">
                {step.title}
              </h3>
              <p
                className={`text-[15px] leading-[1.45] md:text-base md:leading-normal ${step.textClass}`}
              >
                {step.text}
              </p>
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
