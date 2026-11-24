import { useState } from 'react'
import { AppIcon } from '@/components/brand/AppIcon'
import { EmailSignInForm } from '@/features/sign-in/EmailSignInForm'
import { SignInOptions } from '@/features/sign-in/SignInOptions'

export default function SignInPage() {
  const [mode, setMode] = useState<'options' | 'email'>('options')

  return (
    <div className="flex flex-1 items-stretch justify-center bg-asfalto md:items-center md:bg-concreto md:p-10">
      <div
        data-surface="dark"
        className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-asfalto text-concreto md:h-auto md:min-h-0 md:max-w-105 md:rounded-[28px] md:border-2 md:border-asfalto md:shadow-hard"
      >
        <div aria-hidden="true" className="absolute inset-y-0 left-1/2 -ml-15 w-30 bg-[#232725]" />
        <div
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 -ml-0.75 w-1.5 road-stripe-y opacity-90"
        />
        <div className="relative flex min-h-60 flex-1 items-center justify-center md:min-h-56">
          <span className="animate-drop-in [animation-delay:.15s]">
            <AppIcon size={132} tone="faixa" label="InfraMap" />
          </span>
        </div>
        <div className="relative flex flex-col gap-4.5 rounded-t-[28px] border-t border-[#343936] bg-asfalto px-5 pt-7 pb-[calc(28px+env(safe-area-inset-bottom))]">
          <div className="flex flex-col gap-2.5">
            <h1 className="text-[40px] leading-[0.95] font-black tracking-[-0.02em] [font-stretch:125%]">
              Seu bairro
              <br />
              no <span className="text-faixa">mapa.</span>
            </h1>
            <p className="text-base leading-[1.45] text-poeira">
              Marque o que tá quebrado em Resende e acompanhe até alguém resolver.
            </p>
          </div>
          {mode === 'options' ? (
            <SignInOptions onChooseEmail={() => setMode('email')} />
          ) : (
            <EmailSignInForm onBack={() => setMode('options')} />
          )}
        </div>
      </div>
    </div>
  )
}
