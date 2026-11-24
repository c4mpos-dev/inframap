import { ButtonLink } from '@/components/ui/Button'

export function DetailLoading() {
  return (
    <div className="flex flex-1 flex-col" aria-busy="true">
      <span className="sr-only">Carregando o relato…</span>
      <div className="h-75 animate-pulse bg-meio-fio" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-7 w-28 animate-pulse rounded-full bg-meio-fio" />
        <div className="h-8 w-3/4 animate-pulse rounded-lg bg-meio-fio" />
        <div className="h-20 animate-pulse rounded-[18px] bg-meio-fio" />
      </div>
    </div>
  )
}

export function DetailMissing() {
  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col items-start justify-center gap-4 px-5 py-12">
      <span className="font-mono text-sm text-brita">404</span>
      <h1 className="text-4xl leading-none font-display">
        Esse relato não existe ou foi removido.
      </h1>
      <p className="text-[15px] text-carvao">
        Pode ter sido tirado do ar pela equipe ou o link está incompleto.
      </p>
      <ButtonLink to="/mapa" size="md">
        Ver o mapa
      </ButtonLink>
    </section>
  )
}
