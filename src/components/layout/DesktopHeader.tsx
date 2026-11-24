import { Link, NavLink } from 'react-router'
import { Logo } from '@/components/brand/Logo'
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
        <Link
          to="/entrar"
          className="py-3 text-[15px] font-semibold text-giz no-underline hover:text-concreto"
        >
          Entrar
        </Link>
        <MarkProblemLink />
      </div>
    </header>
  )
}
