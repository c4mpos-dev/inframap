import { useState } from 'react'
import { Link } from 'react-router'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { authRepo } from '@/data/session'

interface SignInOptionsProps {
  next: string
  onChooseEmail: () => void
}

export function SignInOptions({ next, onChooseEmail }: SignInOptionsProps) {
  const [googleError, setGoogleError] = useState<string | null>(null)

  async function continueWithGoogle() {
    try {
      await authRepo.signInWithGoogle(next)
    } catch (error) {
      setGoogleError((error as Error).message)
    }
  }

  return (
    <div className="flex animate-rise flex-col gap-2.5">
      <button
        type="button"
        onClick={continueWithGoogle}
        className="flex h-13.5 items-center justify-center gap-2.5 rounded-[14px] bg-concreto text-base font-bold text-asfalto"
      >
        <span
          aria-hidden="true"
          className="flex size-6 items-center justify-center rounded-full border-2 border-asfalto text-[13px] font-black"
        >
          G
        </span>
        Continuar com Google
      </button>
      {googleError && (
        <p role="alert" className="text-[13px] text-poeira">
          {googleError} Por enquanto, dá para entrar com e-mail ou marcar sem se identificar.
        </p>
      )}
      <button
        type="button"
        onClick={onChooseEmail}
        className="flex h-13.5 items-center justify-center gap-2.5 rounded-[14px] border-2 border-grafite text-base font-bold text-concreto"
      >
        <StrokeIcon path="M3 6h18v12H3zM3 7l9 6 9-6" size={20} />
        Entrar com e-mail
      </button>
      <div className="flex items-center gap-3 py-1 text-[13px] text-[#A8A296]">
        <span className="h-px flex-1 bg-[#3A3F3C]" />
        ou
        <span className="h-px flex-1 bg-[#3A3F3C]" />
      </div>
      <Link
        to="/marcar"
        className="flex h-13.5 items-center justify-center gap-2.5 rounded-[14px] bg-faixa text-base font-extrabold text-asfalto no-underline"
      >
        <StrokeIcon
          path="M3 12s3.5-6 9-6c2 0 3.7.8 5 1.8M21 12s-3.5 6-9 6c-2 0-3.7-.8-5-1.8M4 20L20 4"
          size={20}
          strokeWidth={2.2}
        />
        Marcar sem me identificar
      </Link>
      <p className="mt-1 text-[13px] leading-[1.45] text-[#A8A296]">
        Sem conta, seu relato entra anônimo. Seu nome nunca aparece no mapa. Leia os{' '}
        <Link to="/termos" className="text-faixa hover:text-[#FFD65C]">
          termos
        </Link>{' '}
        e a{' '}
        <Link to="/privacidade" className="text-faixa hover:text-[#FFD65C]">
          política de privacidade
        </Link>
        .
      </p>
    </div>
  )
}
