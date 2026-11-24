import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-start gap-4 px-4 py-10 md:px-6 md:py-14">
      <span className="font-mono text-sm text-brita">404</span>
      <h1 className="text-4xl leading-none font-display md:text-5xl">Essa rua não existe.</h1>
      <p className="text-[15px] text-carvao">O endereço que você abriu não leva a nenhuma tela.</p>
      <Link
        to="/mapa"
        className="flex h-13 items-center rounded-[14px] border-2 border-asfalto bg-faixa px-5 font-extrabold text-asfalto no-underline shadow-hard"
      >
        Ver o mapa
      </Link>
    </section>
  )
}
