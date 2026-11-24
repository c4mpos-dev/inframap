import type { ReactNode } from 'react'
import { SiteFooter } from '@/components/layout/SiteFooter'

export interface LegalSection {
  title: string
  body: ReactNode
}

interface LegalPageProps {
  eyebrow: string
  title: string
  intro: string
  sections: LegalSection[]
}

export function LegalPage({ eyebrow, title, intro, sections }: LegalPageProps) {
  return (
    <div className="flex flex-1 flex-col">
      <article className="mx-auto flex w-full max-w-3xl flex-col gap-8 px-4 py-10 md:px-6 md:py-14">
        <header className="flex flex-col gap-3">
          <span className="flex items-center gap-2.5 font-mono text-xs tracking-[0.08em] text-brita uppercase">
            {eyebrow}
            <span className="rounded-md bg-meio-fio px-2 py-0.75 tracking-[0.02em] normal-case">
              rascunho para revisão do grupo
            </span>
          </span>
          <h1 className="text-4xl leading-none font-black tracking-[-0.02em] [font-stretch:120%] md:text-5xl">
            {title}
          </h1>
          <p className="text-[17px] leading-normal text-carvao">{intro}</p>
        </header>
        {sections.map((section) => (
          <section key={section.title} className="flex flex-col gap-2.5">
            <h2 className="text-xl font-extrabold">{section.title}</h2>
            <div className="flex flex-col gap-2.5 text-base leading-relaxed text-carvao [&_li]:ml-5 [&_li]:list-disc">
              {section.body}
            </div>
          </section>
        ))}
      </article>
      <SiteFooter />
    </div>
  )
}
