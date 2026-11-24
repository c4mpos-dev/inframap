import { Button, ButtonLink } from '@/components/ui/Button'
import { authRepo } from '@/data/session'
import type { TeamAccess } from '../useTeamAccess'

interface TeamGateProps {
  access: Exclude<TeamAccess, 'staff'>
  email: string | null
}

export function TeamGate({ access, email }: TeamGateProps) {
  return (
    <section className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center gap-4 px-5 py-12">
      <span className="font-mono text-xs tracking-[0.08em] text-brita uppercase">
        Área da equipe
      </span>
      <h1 className="text-4xl leading-none font-display">Só para quem cuida da fila.</h1>
      {access === 'loading' && (
        <p aria-busy="true" className="text-[15px] text-carvao">
          Conferindo seu acesso…
        </p>
      )}
      {access === 'signed-out' && (
        <>
          <p className="text-[15px] leading-snug text-carvao">
            Entre com o e-mail que a coordenação cadastrou na equipe. O link de acesso chega na sua
            caixa de entrada.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <ButtonLink to="/entrar?voltar=/equipe">Entrar com e-mail</ButtonLink>
            <ButtonLink to="/mapa" variant="secondary">
              Voltar ao mapa
            </ButtonLink>
          </div>
        </>
      )}
      {access === 'not-staff' && (
        <>
          <p className="text-[15px] leading-snug text-carvao">
            A conta {email} ainda não faz parte da equipe. Peça para a coordenação liberar o seu
            acesso.
          </p>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="secondary" onClick={() => authRepo.signOut()}>
              Sair desta conta
            </Button>
            <ButtonLink to="/mapa" variant="secondary">
              Voltar ao mapa
            </ButtonLink>
          </div>
        </>
      )}
    </section>
  )
}
