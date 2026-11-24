import type { ReactNode } from 'react'

interface BottomSheetProps {
  label: string
  children: ReactNode
}

export function BottomSheet({ label, children }: BottomSheetProps) {
  return (
    <section
      aria-label={label}
      className="flex animate-rise flex-col gap-3 rounded-[22px] border-2 border-asfalto bg-branco px-4 pt-2.5 pb-4 shadow-[0_3px_0_var(--color-asfalto),0_14px_30px_rgba(28,31,30,0.18)]"
    >
      <span aria-hidden="true" className="h-1 w-10 self-center rounded-sm bg-[#D3CBB9]" />
      {children}
    </section>
  )
}
