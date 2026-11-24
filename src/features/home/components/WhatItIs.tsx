import { StrokeIcon } from '@/components/icons/StrokeIcon'

const is = [
  'Um lugar só para juntar os relatos que hoje se perdem em grupo de WhatsApp.',
  'Um mapa público que mostra onde os problemas se acumulam.',
  'Dados organizados para levar à prefeitura e às concessionárias.',
]

const isNot = [
  'Não é canal oficial da prefeitura.',
  'Não garante conserto nem prazo.',
  'Não mostra seu nome completo nem seu e-mail.',
]

export function WhatItIs() {
  return (
    <section className="mx-auto grid max-w-310 grid-cols-1 gap-3 px-4 py-6 md:grid-cols-2 md:gap-5 md:px-6 md:py-16">
      <div className="flex flex-col gap-3 rounded-card border-2 border-asfalto p-5.5 md:gap-4 md:rounded-3xl md:p-8">
        <h2 className="text-[22px] font-black [font-stretch:115%] md:text-[28px]">
          O que o InfraMap é
        </h2>
        <ul className="flex flex-col gap-3 text-[15px] leading-[1.45] md:text-[17px]">
          {is.map((item) => (
            <li key={item} className="flex gap-3">
              <StrokeIcon
                path="M5 12.5l4.5 4.5L19 7.5"
                size={22}
                strokeWidth={2.8}
                className="mt-0.5 shrink-0 text-resolvida"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3 rounded-card bg-meio-fio p-5.5 md:gap-4 md:rounded-3xl md:p-8">
        <h2 className="text-[22px] font-black [font-stretch:115%] md:text-[28px]">E o que não é</h2>
        <ul className="flex flex-col gap-3 text-[15px] leading-[1.45] text-carvao md:text-[17px]">
          {isNot.map((item) => (
            <li key={item} className="flex gap-3">
              <StrokeIcon
                path="M6 6l12 12M18 6L6 18"
                size={22}
                strokeWidth={2.8}
                className="mt-0.5 shrink-0 text-aberta"
              />
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
