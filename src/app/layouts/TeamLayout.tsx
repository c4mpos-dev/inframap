import { MAIN_CONTENT_ID } from '@/components/layout/mainContent'
import { Outlet } from 'react-router'
import { TeamHeader } from '@/components/layout/TeamHeader'

export function TeamLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <TeamHeader />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <Outlet />
      </main>
    </div>
  )
}
