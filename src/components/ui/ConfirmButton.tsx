import { StrokeIcon } from '@/components/icons/StrokeIcon'

const EYE_PATH =
  'M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6a3 3 0 1 0 0-6z'

interface ConfirmButtonProps {
  confirmed: boolean
  count: number
  onToggle: () => void
  className?: string
}

export function ConfirmButton({ confirmed, count, onToggle, className = '' }: ConfirmButtonProps) {
  return (
    <button
      type="button"
      aria-pressed={confirmed}
      onClick={onToggle}
      className={`flex h-12 items-center justify-center gap-2 rounded-control border-2 border-asfalto px-4 text-[15px] font-extrabold shadow-[0_2px_0_var(--color-asfalto)] transition-[transform,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[0_4px_0_var(--color-asfalto)] active:translate-y-px active:shadow-none ${
        confirmed ? 'bg-asfalto text-faixa' : 'bg-faixa text-asfalto'
      } ${className}`}
    >
      <StrokeIcon path={EYE_PATH} size={18} strokeWidth={2.4} />
      {confirmed ? 'Você confirmou' : 'Eu também vi'}
      <span className="font-mono font-semibold">{count}</span>
    </button>
  )
}
