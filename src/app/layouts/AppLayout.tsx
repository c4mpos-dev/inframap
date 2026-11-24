import { Outlet } from 'react-router'
import { DesktopHeader } from '@/components/layout/DesktopHeader'
import { MobileNav } from '@/components/layout/MobileNav'

interface AppLayoutProps {
  showMobileNav?: boolean
}

export function AppLayout({ showMobileNav = true }: AppLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <DesktopHeader />
      <main className={`flex flex-1 flex-col ${showMobileNav ? 'pb-24 md:pb-0' : ''}`}>
        <Outlet />
      </main>
      {showMobileNav && <MobileNav />}
    </div>
  )
}
