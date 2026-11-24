import { useId, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { Button, ButtonLink } from '@/components/ui/Button'
import { NAME_MAX_LENGTH, profileRepo } from '@/data/profileRepo'
import { authRepo } from '@/data/session'
import { firstName, useAccount, type Account } from '@/data/useAccount'

function Avatar({ account }: { account: Account }) {
  return account.avatarUrl ? (
    <img
      src={account.avatarUrl}
      alt=""
      referrerPolicy="no-referrer"
      className="size-14 rounded-full"
    />
  ) : (
    <span
      aria-hidden="true"
      className="flex size-14 shrink-0 items-center justify-center rounded-full bg-asfalto text-2xl font-extrabold text-faixa"
    >
      {firstName(account).charAt(0).toUpperCase()}
    </span>
  )
}

function NameEditor({ account, onSaved }: { account: Account; onSaved: () => Promise<void> }) {
  const [name, setName] = useState(account.name ?? '')
  const [feedback, setFeedback] = useState<{ tone: 'error' | 'ok'; text: string } | null>(null)
  const [saving, setSaving] = useState(false)
  const feedbackId = useId()

  async function save(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      await profileRepo.setName(account.id, name)
      await onSaved()
      setFeedback({ tone: 'ok', text: 'Nome salvo.' })
    } catch (error) {
      setFeedback({ tone: 'error', text: (error as Error).message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} noValidate className="flex flex-col gap-2">
      <label className="flex flex-col gap-1.5 text-sm font-bold">
        Seu nome
        <input
          autoComplete="name"
          maxLength={NAME_MAX_LENGTH}
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={feedback?.tone === 'error'}
          aria-describedby={feedback ? feedbackId : undefined}
          className="h-12 rounded-control border-2 border-linha bg-branco px-3.5 text-base font-normal outline-none focus:border-asfalto"
        />
      </label>
      <span className="text-[13px] text-brita">
        Nos relatos aparece só o primeiro nome e a inicial do sobrenome.
      </span>
      <div className="flex items-center gap-3">
        <Button type="submit" size="md" disabled={saving || name.trim() === (account.name ?? '')}>
          {saving ? 'Salvando…' : 'Salvar nome'}
        </Button>
        {feedback && (
          <span
            id={feedbackId}
            role={feedback.tone === 'error' ? 'alert' : 'status'}
            className={`text-sm ${feedback.tone === 'error' ? 'font-semibold text-aberta' : 'text-brita'}`}
          >
            {feedback.text}
          </span>
        )}
      </div>
    </form>
  )
}

export default function ProfilePage() {
  const navigate = useNavigate()
  const { account, loading, refresh } = useAccount()
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
            <Avatar account={account} />
            <div className="flex min-w-0 flex-col">
              <strong className="truncate text-lg">{account.name ?? firstName(account)}</strong>
              <span className="truncate text-sm text-brita">{account.email}</span>
              <span className="text-xs text-brita">
                {account.provider === 'google' ? 'Entrou com Google' : 'Entrou com e-mail'}
              </span>
            </div>
          </div>
          <NameEditor key={account.name ?? ''} account={account} onSaved={refresh} />
          <ButtonLink to="/meus-relatos" variant="secondary">
            Ver meus relatos
          </ButtonLink>
          <Button variant="secondary" onClick={signOut} disabled={leaving}>
            {leaving ? 'Saindo…' : 'Sair da conta'}
          </Button>
        </>
      ) : (
        <>
          <p className="text-[15px] text-carvao">
            Entre para marcar problemas, confirmar o que a vizinhança viu e acompanhar as respostas
            da equipe.
          </p>
          <ButtonLink to="/entrar?voltar=/perfil">Entrar</ButtonLink>
        </>
      )}
    </section>
  )
}
