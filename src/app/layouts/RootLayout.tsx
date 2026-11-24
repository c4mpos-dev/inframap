import { useEffect, useRef } from 'react'
import { Outlet, useLocation, useMatches } from 'react-router'
import { MAIN_CONTENT_ID } from '@/components/layout/mainContent'

const SITE_NAME = 'InfraMap · Resende'

function usePageTitle() {
  const matches = useMatches()
  const title = matches
    .map((match) => (match.handle as { title?: string } | undefined)?.title)
    .findLast(Boolean)

  useEffect(() => {
    document.title = title ? `${title} · InfraMap` : SITE_NAME
  }, [title])
}

// After a client-side navigation, screen readers stay on the link that was
// pressed. Moving focus to <main> makes them read the new page from the top.
function useFocusMainOnNavigation() {
  const { pathname } = useLocation()
  const previous = useRef(pathname)

  useEffect(() => {
    if (previous.current === pathname) return
    previous.current = pathname
    document.getElementById(MAIN_CONTENT_ID)?.focus({ preventScroll: true })
  }, [pathname])
}

export function RootLayout() {
  usePageTitle()
  useFocusMainOnNavigation()

  return (
    <>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only z-50 rounded-md bg-faixa font-bold text-asfalto shadow-hard focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:px-4 focus:py-3"
      >
        Pular para o conteúdo
      </a>
      <Outlet />
    </>
  )
}
