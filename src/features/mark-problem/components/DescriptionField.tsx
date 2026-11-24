import { useId } from 'react'
import { DESCRIPTION_MAX_LENGTH } from '../schema'

interface DescriptionFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
}

export function DescriptionField({ label, value, onChange }: DescriptionFieldProps) {
  const counterId = useId()

  return (
    <label className="flex flex-col gap-2 text-sm font-bold">
      {label}
      <textarea
        rows={3}
        value={value}
        maxLength={DESCRIPTION_MAX_LENGTH}
        aria-describedby={counterId}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Ex.: o buraco fica cheio d’água quando chove e os carros desviam pela contramão."
        className="resize-y rounded-[14px] border-2 border-[#CFC8B8] bg-branco p-3.5 text-[15px] leading-normal font-normal text-asfalto outline-none placeholder:text-[#6B655B] focus:border-asfalto"
      />
      <span id={counterId} className="self-end font-mono text-xs font-normal text-brita">
        {value.length}/{DESCRIPTION_MAX_LENGTH}
      </span>
    </label>
  )
}
