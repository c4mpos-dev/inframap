import type { ReactNode } from 'react'

interface ChartCardProps {
  title: string
  aside?: ReactNode
  className?: string
  compact?: boolean
  children: ReactNode
}

export function ChartCard({
  title,
  aside,
  className = '',
  compact = false,
  children,
}: ChartCardProps) {
  return (
    <section
      className={`flex min-w-0 flex-col bg-branco ${compact ? 'gap-3.5 rounded-[18px] p-4.5' : 'gap-4.5 rounded-card p-6'} ${className}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className={compact ? 'text-[17px] font-extrabold' : 'text-xl font-extrabold'}>
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  )
}
