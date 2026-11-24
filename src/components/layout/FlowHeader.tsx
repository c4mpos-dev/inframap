import { Link } from 'react-router'
import { Logo } from '@/components/brand/Logo'

interface FlowHeaderProps {
  title: string
}

export function FlowHeader({ title }: FlowHeaderProps) {
  return (
    <header
      data-surface="dark"
      className="hidden h-17 shrink-0 items-center gap-6 bg-asfalto px-6 text-concreto md:flex"
    >
      <Logo />
      <span className="text-[15px] font-semibold text-poeira">/ {title}</span>
      <Link
        to="/mapa"
        className="ml-auto py-3 text-[15px] font-semibold text-giz no-underline hover:text-concreto"
      >
        Cancelar
      </Link>
    </header>
  )
}
