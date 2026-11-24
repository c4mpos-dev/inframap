import { useId, useState, type FormEvent } from 'react'
import { NAME_MAX_LENGTH, profileRepo } from '@/data/profileRepo'

interface NameFormProps {
  userId: string
  onSaved: () => void
}

/** First visit after an e-mail sign-up: the only thing the profile asks for. */
export function NameForm({ userId, onSaved }: NameFormProps) {
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const errorId = useId()

  async function save(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    try {
      await profileRepo.setName(userId, name)
      onSaved()
    } catch (problem) {
      setError((problem as Error).message)
      setSaving(false)
    }
  }

  return (
    <form onSubmit={save} noValidate className="flex animate-rise flex-col gap-2.5">
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-poeira">
        Como você quer ser chamado(a)?
        <input
          // eslint-disable-next-line jsx-a11y/no-autofocus -- this is the only field on the step
          autoFocus
          autoComplete="name"
          maxLength={NAME_MAX_LENGTH}
          value={name}
          onChange={(event) => setName(event.target.value)}
          aria-invalid={error !== null}
          aria-describedby={error ? errorId : undefined}
          placeholder="Seu nome"
          className="h-13 rounded-[14px] border-2 border-faixa bg-asfalto-2 px-4 text-base font-normal text-concreto outline-none placeholder:text-[#8C877C]"
        />
      </label>
      <button
        type="submit"
        disabled={saving}
        className="h-13 rounded-[14px] bg-faixa text-base font-extrabold text-asfalto"
      >
        {saving ? 'Salvando…' : 'Continuar'}
      </button>
      {error ? (
        <p id={errorId} role="alert" className="text-[13px] font-semibold text-faixa">
          {error}
        </p>
      ) : (
        <span className="text-[13px] leading-[1.45] text-[#A8A296]">
          Nos relatos aparece só o primeiro nome e a inicial do sobrenome, e você pode ocultar em
          cada relato.
        </span>
      )}
    </form>
  )
}
