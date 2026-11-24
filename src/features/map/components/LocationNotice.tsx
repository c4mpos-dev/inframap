import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { iconPaths } from '@/components/icons/paths'

interface LocationNoticeProps {
  message: string
  onDismiss: () => void
}

export function LocationNotice({ message, onDismiss }: LocationNoticeProps) {
  return (
    <div
      role="alert"
      className="absolute inset-x-4 top-36 z-20 flex animate-rise items-start gap-3 rounded-[14px] border-2 border-asfalto bg-branco p-3.5 text-sm shadow-hard md:inset-x-auto md:top-22 md:right-5 md:w-80"
    >
      <span className="flex-1 text-carvao">{message}</span>
      <button
        type="button"
        aria-label="Fechar aviso"
        onClick={onDismiss}
        className="-m-1 flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-concreto"
      >
        <StrokeIcon path={iconPaths.close} size={14} strokeWidth={3} />
      </button>
    </div>
  )
}
