import { useId } from 'react'

interface SwitchProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Switch({ label, description, checked, onChange }: SwitchProps) {
  const descriptionId = useId()

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-describedby={description ? descriptionId : undefined}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center gap-3.5 rounded-2xl bg-meio-fio p-3.5 text-left text-asfalto"
    >
      <span className="flex flex-1 flex-col gap-0.5">
        <strong className="text-[15px]">{label}</strong>
        {description && (
          <span id={descriptionId} className="text-[13px] text-carvao">
            {description}
          </span>
        )}
      </span>
      <span
        aria-hidden="true"
        className={`relative h-8 w-13 shrink-0 rounded-full transition-colors duration-200 ${
          checked ? 'bg-resolvida' : 'bg-brita'
        }`}
      >
        <span
          className={`absolute top-1 size-6 rounded-full bg-branco transition-[left] duration-200 ${
            checked ? 'left-6' : 'left-1'
          }`}
        />
      </span>
    </button>
  )
}
