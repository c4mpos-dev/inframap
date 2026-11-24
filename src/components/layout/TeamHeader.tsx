import { Logo } from '@/components/brand/Logo'

export function TeamHeader() {
  return (
    <header
      data-surface="dark"
      className="flex h-17 shrink-0 items-center gap-5 bg-asfalto px-6 text-concreto"
    >
      <Logo />
      <span className="flex h-7 items-center rounded-lg bg-faixa px-2.5 text-[13px] font-extrabold text-asfalto">
        Equipe
      </span>
      <div className="ml-auto flex items-center gap-3 text-sm text-giz">
        <span>Grupo 3 · AEDB</span>
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-full bg-asfalto-2 font-extrabold text-faixa"
        >
          G3
        </span>
      </div>
    </header>
  )
}
