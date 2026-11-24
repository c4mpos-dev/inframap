import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button, ButtonLink } from '@/components/ui/Button'
import { authRepo } from '@/data/session'
import { useAccount } from '@/data/useAccount'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { account, loading } = useAccount()
  const [leaving, setLeaving] = useState(false)

  async function signOut() {
    setLeaving(true)
    await authRepo.signOut()
    navigate('/mapa')
  }

  return (
    <section className="mx-auto flex w-full max-w-xl flex-1 flex-col gap-6 px-4 py-10 md:px-6 md:py-14">
      <h1 className="text-4xl leading-none font-display md:text-5xl">Perfil</h1>

      {loading ? null : account ? (
        <>
          <div className="flex items-center gap-4 rounded-2xl border-2 border-asfalto bg-branco p-4 shadow-hard">
            {account.avatarUrl ? (
              <img
                src={account.avatarUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="size-14 rounded-full"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-14 items-center justify-center rounded-full bg-asfalto text-2xl font-extrabold text-faixa"
              >
                {account.firstName.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="flex min-w-0 flex-col">
              <strong className="truncate text-lg">{account.name}</strong>
              <span className="truncate text-sm text-brita">{account.email}</span>
              <span className="text-xs text-brita">
                {account.provider === 'google' ? 'Entrou com Google' : 'Entrou com e-mail'}
              </span>
            </div>
          </div>
          <Button variant="secondary" onClick={signOut} disabled={leaving}>
            {leaving ? 'Saindo…' : 'Sair da conta'}
          </Button>
        </>
      ) : (
        <>
          <p className="text-[15px] text-carvao">
            Você está usando o InfraMap sem se identificar. Entre para guardar seus relatos e
            acompanhar as respostas da equipe.
          </p>
          <ButtonLink to="/entrar?voltar=/perfil">Entrar</ButtonLink>
        </>
      )}
    </section>
  )
}
