import { Link, NavLink } from 'react-router'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { iconPaths } from '@/components/icons/paths'

interface NavItem {
  to: string
  label: string
  icon: string
}

const leftItems: NavItem[] = [
  { to: '/mapa', label: 'Mapa', icon: iconPaths.map },
  { to: '/indicadores', label: 'Números', icon: iconPaths.chart },
]

const rightItems: NavItem[] = [
  { to: '/meus-relatos', label: 'Meus relatos', icon: iconPaths.myReports },
  { to: '/perfil', label: 'Perfil', icon: iconPaths.profile },
]

function MobileNavLink({ to, label, icon }: NavItem) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex h-15 flex-col items-center justify-center gap-1 text-[11px] no-underline ${
          isActive ? 'font-bold text-faixa' : 'font-semibold text-giz'
        }`
      }
    >
      <StrokeIcon path={icon} />
      {label}
    </NavLink>
  )
}

export function MobileNav() {
  return (
    <nav
      aria-label="Principal"
      data-surface="dark"
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 items-end bg-asfalto px-3 pb-[calc(12px+env(safe-area-inset-bottom))] md:hidden"
    >
      {leftItems.map((item) => (
        <MobileNavLink key={item.to} {...item} />
      ))}
      <span className="flex justify-center">
        <Link
          to="/marcar"
          aria-label="Marcar problema"
          className="mb-3.5 flex size-16 animate-bob items-center justify-center rounded-[20px] border-3 border-asfalto bg-faixa text-asfalto shadow-hard-black"
        >
          <StrokeIcon path={iconPaths.plus} size={28} strokeWidth={3} />
        </Link>
      </span>
      {rightItems.map((item) => (
        <MobileNavLink key={item.to} {...item} />
      ))}
    </nav>
  )
}
