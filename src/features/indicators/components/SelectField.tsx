import { StrokeIcon } from '@/components/icons/StrokeIcon'

interface SelectFieldProps {
  label: string
  value: string
  options: { value: string; label: string }[]
  onChange: (value: string) => void
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <label className="relative flex min-w-0 flex-1 items-center sm:flex-none">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full min-w-0 appearance-none rounded-control border-[1.5px] border-[#CFC8B8] bg-branco pr-10 pl-3.5 text-sm font-semibold text-asfalto"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <StrokeIcon
        path="M6 9l6 6 6-6"
        size={18}
        strokeWidth={2.4}
        className="pointer-events-none absolute right-3.5"
      />
    </label>
  )
}
