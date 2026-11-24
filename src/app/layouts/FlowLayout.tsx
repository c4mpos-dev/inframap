import { Outlet } from 'react-router'
import { FlowHeader } from '@/components/layout/FlowHeader'

interface FlowLayoutProps {
  title: string
}

export function FlowLayout({ title }: FlowLayoutProps) {
  return (
    <div className="flex min-h-dvh flex-col">
      <FlowHeader title={title} />
      <main className="flex flex-1 flex-col">
        <Outlet />
      </main>
    </div>
  )
}
