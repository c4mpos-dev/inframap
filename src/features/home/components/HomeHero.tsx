import { Link } from 'react-router'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { iconPaths } from '@/components/icons/paths'
import { RoadStripe } from '@/components/ui/RoadStripe'
import { TiltOnHover } from '@/components/ui/TiltOnHover'
import { HeroMapCard } from './HeroMapCard'

export function HomeHero() {
  return (
    <div data-surface="dark" className="bg-asfalto text-concreto">
      <section className="mx-auto flex max-w-310 flex-wrap items-center gap-12 px-4 pt-7 pb-10 md:px-6 md:pt-14 md:pb-18">
        <div className="flex w-full min-w-0 flex-col gap-5.5 md:w-auto md:flex-[1_1_520px] md:gap-7">
          <span className="flex h-7 items-center self-start rounded-full border-[1.5px] border-grafite px-2.5 font-mono text-[11px] text-poeira md:h-8 md:px-3 md:text-xs">
            Resende · RJ · projeto de extensão AEDB
          </span>
          <div className="flex items-end justify-between">
            <h1 className="text-[clamp(56px,19vw,76px)] leading-[0.86] font-black tracking-[-0.035em] [font-stretch:125%] md:text-[clamp(56px,7vw,104px)] md:leading-[0.88]">
              Viu?
              <br />
              <span className="text-faixa">Marca.</span>
            </h1>
            <svg
              width="56"
              height="70"
              viewBox="0 0 32 40"
              aria-hidden="true"
              className="mb-2 animate-drop-in [animation-delay:.3s] md:hidden"
            >
              <path
                d="M16 1C8 1 2 7 2 14.5C2 24 16 38 16 38C16 38 30 24 30 14.5C30 7 24 1 16 1Z"
                fill="#FFC21A"
              />
              <path
                d="M15.5 1.5L18 6.5L14.5 10L17.5 13.5L15.5 16"
                fill="none"
                stroke="#1C1F1E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <p className="max-w-130 text-[17px] leading-[1.45] text-giz md:text-[21px]">
            Buraco, bueiro entupido, calçada quebrada, poste apagado. Marque no mapa de Resende, a
            vizinhança confirma e todo mundo acompanha o que acontece depois.
          </p>
          <div className="flex flex-col gap-2.5 md:flex-row md:flex-wrap md:gap-3">
            <Link
              to="/marcar"
              className="flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-faixa px-6.5 text-[17px] font-extrabold text-asfalto no-underline shadow-hard-black transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[0_6px_0_#000000] md:h-14.5"
            >
              <StrokeIcon path={iconPaths.plus} size={20} strokeWidth={2.8} />
              Marcar um problema
            </Link>
            <Link
              to="/mapa"
              className="flex h-14 items-center justify-center rounded-2xl border-2 border-grafite px-6 text-[17px] font-bold text-concreto no-underline hover:border-giz md:h-14.5"
            >
              Ver o mapa
            </Link>
          </div>
          <span className="hidden text-sm text-[#A8A296] md:block">
            Gratuito. Dá para ocultar seu nome em cada relato.
          </span>
        </div>
        <div className="hidden flex-[1_1_400px] justify-center md:flex">
          <TiltOnHover>
            <HeroMapCard />
          </TiltOnHover>
        </div>
      </section>
      <RoadStripe className="h-10 md:h-12" />
    </div>
  )
}
