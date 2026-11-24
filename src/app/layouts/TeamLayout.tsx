import { Outlet } from 'react-router'
import { TeamHeader } from '@/components/layout/TeamHeader'

export function TeamLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <TeamHeader />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
