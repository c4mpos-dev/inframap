import { useId, useState, type FormEvent } from 'react'
import { z } from 'zod'
import { authRepo } from '@/data/session'

const emailSchema = z.email()

interface EmailSignInFormProps {
  next: string
  onBack: () => void
}

export function EmailSignInForm({ next, onBack }: EmailSignInFormProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<{ tone: 'error' | 'info'; text: string } | null>(null)
  const [sending, setSending] = useState(false)
  const messageId = useId()

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const address = email.trim()
    if (!emailSchema.safeParse(address).success) {
      setMessage({ tone: 'error', text: 'Confira o e-mail: parece que falta alguma coisa.' })
      return
    }
    setSending(true)
    try {
      await authRepo.sendMagicLink(address, next)
      setMessage({
        tone: 'info',
        text: `Pronto! Mandamos o link para ${address}. Abra no celular ou no computador.`,
      })
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message })
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex animate-rise flex-col gap-2.5">
      <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-poeira">
        Seu e-mail
        <input
          type="email"
          autoComplete="email"
          inputMode="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={message?.tone === 'error'}
          aria-describedby={message ? messageId : undefined}
          placeholder="nome@email.com"
          className="h-13 rounded-[14px] border-2 border-faixa bg-asfalto-2 px-4 text-base font-normal text-concreto outline-none placeholder:text-[#8C877C]"
        />
      </label>
      <button
        type="submit"
        disabled={sending}
        className="h-13 rounded-[14px] bg-faixa text-base font-extrabold text-asfalto"
      >
        {sending ? 'Mandando…' : 'Mandar link de acesso'}
      </button>
      {message ? (
        <p
          id={messageId}
          role={message.tone === 'error' ? 'alert' : 'status'}
          className={`text-[13px] ${message.tone === 'error' ? 'font-semibold text-faixa' : 'text-poeira'}`}
        >
          {message.text}
        </p>
      ) : (
        <span className="text-[13px] text-[#A8A296]">
          Sem senha: você entra pelo link que chega no e-mail.
        </span>
      )}
      <button
        type="button"
        onClick={onBack}
        className="h-11 self-start text-sm font-bold text-faixa"
      >
        Voltar
      </button>
    </form>
  )
}
