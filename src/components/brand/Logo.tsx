import { Link } from 'react-router'
import { AppIcon } from './AppIcon'

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3 text-concreto no-underline">
      <AppIcon size={36} tone="asfalto-2" />
      <span className="text-2xl font-display">
        infra<span className="text-faixa">map</span>
      </span>
    </Link>
  )
}
