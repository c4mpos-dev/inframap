import { MAIN_CONTENT_ID } from '@/components/layout/mainContent'
import { Outlet } from 'react-router'
import { FlowHeader } from '@/components/layout/FlowHeader'

interface FlowLayoutProps {
  title: string
}

export function FlowLayout({ title }: FlowLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <FlowHeader title={title} />
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex flex-1 flex-col outline-none">
        <Outlet />
      </main>
    </div>
  )
}
