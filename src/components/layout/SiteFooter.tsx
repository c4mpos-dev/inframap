import { Link } from 'react-router'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { INSTAGRAM_PATH, instagramUrl } from '@/domain/instagram'
import { PROJECT_INSTAGRAM } from '@/domain/project'

export function SiteFooter() {
  return (
    <footer className="border-t border-linha">
      <div className="mx-auto flex max-w-310 flex-col-reverse justify-between gap-2.5 px-4 pt-5 pb-7 text-[13px] text-brita md:flex-row md:flex-wrap md:gap-4 md:px-6 md:pt-7 md:pb-10 md:text-sm">
        <span>InfraMap · 2026 · mapa © Mapbox © colaboradores do OpenStreetMap</span>
        <span className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a
            href={instagramUrl(PROJECT_INSTAGRAM)}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 text-asfalto hover:text-brita"
          >
            <StrokeIcon path={INSTAGRAM_PATH} size={16} />@{PROJECT_INSTAGRAM}
          </a>
          <Link to="/privacidade" className="text-asfalto hover:text-brita">
            Privacidade e LGPD
          </Link>
          <Link to="/termos" className="text-asfalto hover:text-brita">
            Termos de uso
          </Link>
          <Link to="/equipe" className="text-asfalto hover:text-brita">
            Área da equipe
          </Link>
        </span>
      </div>
    </footer>
  )
}
