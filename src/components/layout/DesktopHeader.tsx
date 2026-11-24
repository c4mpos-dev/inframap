import { Link, NavLink } from 'react-router'
import { Logo } from '@/components/brand/Logo'
import { firstName, useAccount } from '@/data/useAccount'
import { MarkProblemLink } from './MarkProblemLink'

const links = [
  { to: '/mapa', label: 'Mapa' },
  { to: '/indicadores', label: 'Indicadores' },
  { to: '/', label: 'Como funciona', end: true },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-[10px] px-3.5 py-2.5 no-underline ${
    isActive ? 'bg-asfalto-2 text-faixa' : 'text-giz hover:text-concreto'
  }`

export function DesktopHeader() {
  const { account } = useAccount()

  return (
    <header
      data-surface="dark"
      className="hidden min-h-17 flex-wrap items-center gap-8 bg-asfalto px-6 text-concreto md:flex"
    >
      <Logo />
      <nav aria-label="Principal" className="flex gap-1 text-[15px] font-semibold">
        {links.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClass}>
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-4">
        {account ? (
          <Link
            to="/perfil"
            className="flex items-center gap-2 py-2 text-[15px] font-semibold text-giz no-underline hover:text-concreto"
          >
            {account.avatarUrl ? (
              <img
                src={account.avatarUrl}
                alt=""
                referrerPolicy="no-referrer"
                className="size-8 rounded-full"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-8 items-center justify-center rounded-full bg-asfalto-2 font-extrabold text-faixa"
              >
                {firstName(account).charAt(0).toUpperCase()}
              </span>
            )}
            {firstName(account)}
          </Link>
        ) : (
          <Link
            to="/entrar"
            className="py-3 text-[15px] font-semibold text-giz no-underline hover:text-concreto"
          >
            Entrar
          </Link>
        )}
        <MarkProblemLink />
      </div>
    </header>
  )
}
