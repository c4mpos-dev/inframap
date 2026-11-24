import { useId, useState, type FormEvent } from 'react'
import { z } from 'zod'
import { authRepo } from '@/data/session'

const emailSchema = z.email()
const codePattern = /^\d{6,8}$/

const inputClass =
  'h-13 rounded-[14px] border-2 border-faixa bg-asfalto-2 px-4 text-base font-normal text-concreto outline-none placeholder:text-[#8C877C]'
const submitClass = 'h-13 rounded-[14px] bg-faixa text-base font-extrabold text-asfalto'

type Message = { tone: 'error' | 'info'; text: string } | null

function FormMessage({ id, message, hint }: { id: string; message: Message; hint: string }) {
  if (!message) return <span className="text-[13px] text-[#A8A296]">{hint}</span>
  return (
    <p
      id={id}
      role={message.tone === 'error' ? 'alert' : 'status'}
      className={`text-[13px] ${message.tone === 'error' ? 'font-semibold text-faixa' : 'text-poeira'}`}
    >
      {message.text}
    </p>
  )
}

export function EmailSignInForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [message, setMessage] = useState<Message>(null)
  const [busy, setBusy] = useState(false)
  const messageId = useId()

  async function sendCode(event?: FormEvent) {
    event?.preventDefault()
    const address = email.trim()
    if (!emailSchema.safeParse(address).success) {
      setMessage({ tone: 'error', text: 'Confira o e-mail: parece que falta alguma coisa.' })
      return
    }
    setBusy(true)
    try {
      await authRepo.sendCode(address)
      setStep('code')
      setCode('')
      setMessage({ tone: 'info', text: `Mandamos um código para ${address}.` })
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message })
    } finally {
      setBusy(false)
    }
  }

  async function verify(event: FormEvent) {
    event.preventDefault()
    const typed = code.replace(/\s/g, '')
    if (!codePattern.test(typed)) {
      setMessage({ tone: 'error', text: 'O código tem 6 números. Confira o e-mail.' })
      return
    }
    setBusy(true)
    try {
      await authRepo.verifyCode(email.trim(), typed)
      setMessage({ tone: 'info', text: 'Pronto, você entrou.' })
    } catch (error) {
      setMessage({ tone: 'error', text: (error as Error).message })
      setBusy(false)
    }
  }

  if (step === 'code') {
    return (
      <form onSubmit={verify} noValidate className="flex animate-rise flex-col gap-2.5">
        <label className="flex flex-col gap-1.5 text-[13px] font-semibold text-poeira">
          Código que chegou no e-mail
          <input
            // eslint-disable-next-line jsx-a11y/no-autofocus -- the person just asked for the code
            autoFocus
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={8}
            value={code}
            onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
            aria-invalid={message?.tone === 'error'}
            aria-describedby={message ? messageId : undefined}
            placeholder="000000"
            className={`${inputClass} text-center font-mono text-2xl tracking-[0.4em]`}
          />
        </label>
        <button type="submit" disabled={busy} className={submitClass}>
          {busy ? 'Conferindo…' : 'Entrar'}
        </button>
        <FormMessage id={messageId} message={message} hint="" />
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => sendCode()}
            disabled={busy}
            className="h-11 text-sm font-bold text-faixa"
          >
            Mandar outro código
          </button>
          <button
            type="button"
            onClick={() => {
              setStep('email')
              setMessage(null)
            }}
            className="h-11 text-sm font-bold text-poeira"
          >
            Trocar e-mail
          </button>
        </div>
      </form>
    )
  }

  return (
    <form onSubmit={sendCode} noValidate className="flex animate-rise flex-col gap-2.5">
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
          className={inputClass}
        />
      </label>
      <button type="submit" disabled={busy} className={submitClass}>
        {busy ? 'Mandando…' : 'Mandar código'}
      </button>
      <FormMessage
        id={messageId}
        message={message}
        hint="Sem senha: você recebe um código de 6 números no e-mail."
      />
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
