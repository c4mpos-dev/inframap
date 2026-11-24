import { useId, useState, type FormEvent } from 'react'
import { z } from 'zod'

const emailSchema = z.email()

interface EmailSignInFormProps {
  onBack: () => void
}

export function EmailSignInForm({ onBack }: EmailSignInFormProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState<{ tone: 'error' | 'info'; text: string } | null>(null)
  const messageId = useId()

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!emailSchema.safeParse(email.trim()).success) {
      setMessage({ tone: 'error', text: 'Confira o e-mail: parece que falta alguma coisa.' })
      return
    }
    setMessage({
      tone: 'info',
      text: 'O link por e-mail chega em breve. Por enquanto, dá para marcar sem se identificar.',
    })
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
        className="h-13 rounded-[14px] bg-faixa text-base font-extrabold text-asfalto"
      >
        Mandar link de acesso
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
