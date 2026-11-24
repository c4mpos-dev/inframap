import type { ReactNode } from 'react'

interface ShowcaseSectionProps {
  title: string
  children: ReactNode
}

export function ShowcaseSection({ title, children }: ShowcaseSectionProps) {
  return (
    <section className="flex flex-col gap-4 border-t border-dashed border-[#CFC8B8] pt-6">
      <h2 className="font-mono text-xs tracking-[0.08em] text-brita uppercase">{title}</h2>
      {children}
    </section>
  )
}
