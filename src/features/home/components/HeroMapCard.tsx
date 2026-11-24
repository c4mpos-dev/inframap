import { StatusPinIcon } from '@/components/icons/StatusPinIcon'
import { CategoryIcon } from '@/components/icons/CategoryIcon'

export function HeroMapCard() {
  return (
    <div
      aria-hidden="true"
      className="relative h-110 w-105 max-w-full animate-tilt overflow-hidden rounded-[28px] border-3 border-concreto bg-mapa-fundo shadow-[14px_14px_0_var(--color-faixa)]"
    >
      <svg viewBox="0 0 420 440" className="absolute inset-0 size-full">
        <defs>
          <pattern id="hero-blocks" width="48" height="36" patternUnits="userSpaceOnUse">
            <rect x="4" y="4" width="40" height="28" rx="3" fill="#E0DBCF" />
          </pattern>
        </defs>
        <rect width="420" height="440" fill="url(#hero-blocks)" />
        <path
          d="M-20 300C90 260 170 350 250 310S360 240 440 270"
          fill="none"
          stroke="#B7D0DC"
          strokeWidth="36"
          strokeLinecap="round"
        />
        <g fill="none" stroke="#FFFFFF" strokeLinecap="round">
          <path d="M0 150C140 175 280 120 420 140" strokeWidth="12" />
          <path d="M210 -10C215 200 190 330 205 450" strokeWidth="10" />
          <path d="M80 -10C95 200 60 330 85 450" strokeWidth="8" />
          <path d="M340 -10L325 450" strokeWidth="8" />
        </g>
      </svg>
      <span className="absolute top-[30%] left-[22%] animate-drop-in [animation-delay:.2s]">
        <StatusPinIcon status="aberta" size={40} />
      </span>
      <span className="absolute top-[18%] left-[62%] animate-drop-in [animation-delay:.45s]">
        <StatusPinIcon status="andamento" size={40} />
      </span>
      <span className="absolute top-[52%] left-[70%] animate-drop-in [animation-delay:.7s]">
        <StatusPinIcon status="resolvida" size={40} />
      </span>
      <span className="absolute top-[46%] left-[40%]">
        <span className="absolute top-10 left-2.5 -mt-5 -ml-5 size-10 animate-ring rounded-full border-3 border-asfalto [animation-delay:0s] [animation-duration:2.2s]" />
        <svg
          width="56"
          height="70"
          viewBox="0 0 32 40"
          className="relative animate-drop-in [animation-delay:1s]"
        >
          <path
            d="M16 1C8 1 2 7 2 14.5C2 24 16 38 16 38C16 38 30 24 30 14.5C30 7 24 1 16 1Z"
            fill="#FFC21A"
            stroke="#1C1F1E"
            strokeWidth="2"
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
      </span>
      <div className="absolute inset-x-4 bottom-4 flex items-center gap-3 rounded-2xl border-2 border-asfalto bg-branco p-3.5 text-asfalto">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-control bg-aberta text-branco">
          <CategoryIcon categoryId="saneamento" size={20} strokeWidth={2.2} />
        </span>
        <span className="flex flex-1 flex-col">
          <strong className="text-[15px]">Bueiro entupido na esquina</strong>
          <span className="text-[13px] text-brita">Jardim Jalisco · 21 viram</span>
        </span>
      </div>
    </div>
  )
}
