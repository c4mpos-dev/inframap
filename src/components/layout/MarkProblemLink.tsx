import { Link } from 'react-router'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { iconPaths } from '@/components/icons/paths'

export function MarkProblemLink() {
  return (
    <Link
      to="/marcar"
      className="flex h-11 items-center gap-2.5 rounded-control bg-faixa px-5 text-[15px] font-extrabold text-asfalto no-underline shadow-[0_2px_0_#000000] transition-transform hover:-translate-y-px"
    >
      <StrokeIcon path={iconPaths.plus} size={18} strokeWidth={2.6} />
      Marcar problema
    </Link>
  )
}
