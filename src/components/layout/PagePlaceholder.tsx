interface PagePlaceholderProps {
  title: string
  stage: number
}

export function PagePlaceholder({ title, stage }: PagePlaceholderProps) {
  return (
    <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-3 px-4 py-10 md:px-6 md:py-14">
      <span className="self-start rounded-full border-[1.5px] border-asfalto px-2.5 py-1 font-mono text-xs">
        Etapa {stage}
      </span>
      <h1 className="text-4xl leading-none font-display md:text-5xl">{title}</h1>
      <p className="text-[15px] text-carvao">Esta tela ainda está em construção.</p>
    </section>
  )
}
