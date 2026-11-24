import { useRef } from 'react'
import { Link } from 'react-router'
import { AppIcon } from '@/components/brand/AppIcon'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { iconPaths } from '@/components/icons/paths'
import { AccountLink } from '@/components/layout/AccountLink'
import { firstName, useAccount } from '@/data/useAccount'

const links = [
  { to: '/mapa', label: 'Mapa' },
  { to: '/indicadores', label: 'Indicadores' },
  { to: '#como', label: 'Como funciona' },
  { to: '#encontros', label: 'Encontros' },
]

function Wordmark({ size }: { size: 'md' | 'lg' }) {
  return (
    <Link to="/" className="flex items-center gap-2.5 text-concreto no-underline md:gap-3">
      <AppIcon size={size === 'lg' ? 38 : 34} tone="asfalto-2" />
      <span className={`font-display ${size === 'lg' ? 'text-[25px]' : 'text-[22px]'}`}>
        infra<span className="text-faixa">map</span>
      </span>
    </Link>
  )
}

function NavAnchor({
  to,
  label,
  onNavigate,
}: {
  to: string
  label: string
  onNavigate?: () => void
}) {
  const className = 'px-3.5 py-2.5 text-giz no-underline hover:text-concreto'
  return to.startsWith('#') ? (
    <a href={to} className={className} onClick={onNavigate}>
      {label}
    </a>
  ) : (
    <Link to={to} className={className} onClick={onNavigate}>
      {label}
    </Link>
  )
}

export function HomeHeader() {
  const { account } = useAccount()
  const accountLinks = account
    ? [
        { to: '/meus-relatos', label: 'Meus relatos' },
        { to: '/perfil', label: `Perfil · ${firstName(account)}` },
      ]
    : [{ to: '/entrar', label: 'Entrar' }]
  const menuRef = useRef<HTMLDialogElement>(null)
  const closeMenu = () => menuRef.current?.close()

  return (
    <header className="mx-auto flex min-h-16 max-w-310 flex-wrap items-center gap-7 px-4 md:min-h-19 md:px-6">
      <Wordmark size="lg" />
      <nav aria-label="Principal" className="hidden gap-1 text-[15px] font-semibold md:flex">
        {links.map((link) => (
          <NavAnchor key={link.to} {...link} />
        ))}
      </nav>
      <AccountLink className="ml-auto hidden md:flex" />
      <button
        type="button"
        aria-label="Abrir menu"
        aria-haspopup="dialog"
        onClick={() => menuRef.current?.showModal()}
        className="ml-auto flex size-11 items-center justify-center rounded-control border-[1.5px] border-grafite md:hidden"
      >
        <StrokeIcon path="M4 7h16M4 12h16M4 17h10" size={20} strokeWidth={2.2} />
      </button>

      <dialog
        ref={menuRef}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none animate-rise bg-asfalto p-0 text-concreto backdrop:bg-asfalto/70 md:hidden"
      >
        <div
          data-surface="dark"
          className="flex flex-col gap-2 px-4 pt-4 pb-[calc(20px+env(safe-area-inset-bottom))]"
        >
          <div className="flex items-center justify-between">
            <Wordmark size="md" />
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={closeMenu}
              className="flex size-11 items-center justify-center rounded-control border-[1.5px] border-grafite"
            >
              <StrokeIcon path={iconPaths.close} size={18} strokeWidth={2.4} />
            </button>
          </div>
          <nav aria-label="Menu" className="flex flex-col text-lg font-bold">
            {[...links, ...accountLinks].map((link) => (
              <NavAnchor key={link.to} {...link} onNavigate={closeMenu} />
            ))}
          </nav>
          <Link
            to="/marcar"
            onClick={closeMenu}
            className="mt-2 flex h-14 items-center justify-center gap-2.5 rounded-2xl bg-faixa text-[17px] font-extrabold text-asfalto no-underline"
          >
            <StrokeIcon path={iconPaths.plus} size={20} strokeWidth={2.8} />
            Marcar um problema
          </Link>
        </div>
      </dialog>
    </header>
  )
}
