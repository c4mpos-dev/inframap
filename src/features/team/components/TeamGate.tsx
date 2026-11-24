import { Button, ButtonLink } from '@/components/ui/Button'

export function TeamGate({ onEnter }: { onEnter: () => void }) {
  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-5 py-12">
      <span className="font-mono text-xs tracking-[0.08em] text-brita uppercase">
        Área da equipe
      </span>
      <h1 className="text-4xl leading-none font-display">Só para quem cuida da fila.</h1>
      <p className="text-[15px] leading-snug text-carvao">
        Aqui a equipe do InfraMap confere os relatos, junta duplicados e atualiza a situação. Por
        enquanto o acesso é de demonstração e não pede senha; o login de verdade chega com o banco
        de dados.
      </p>
      <div className="flex flex-wrap gap-2.5">
        <Button onClick={onEnter}>Entrar como equipe</Button>
        <ButtonLink to="/mapa" variant="secondary">
          Voltar ao mapa
        </ButtonLink>
      </div>
    </section>
  )
}
