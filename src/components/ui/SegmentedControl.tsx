import { useRef, type KeyboardEvent } from 'react'

interface SegmentOption<T extends string> {
  value: T
  label: string
}

interface SegmentedControlProps<T extends string> {
  label: string
  options: SegmentOption<T>[]
  value: T
  onChange: (value: T) => void
}

const nextIndexByKey: Record<string, (index: number, length: number) => number> = {
  ArrowRight: (index, length) => (index + 1) % length,
  ArrowDown: (index, length) => (index + 1) % length,
  ArrowLeft: (index, length) => (index - 1 + length) % length,
  ArrowUp: (index, length) => (index - 1 + length) % length,
  Home: () => 0,
  End: (_, length) => length - 1,
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentedControlProps<T>) {
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const move = nextIndexByKey[event.key]
    if (!move) return
    event.preventDefault()
    const currentIndex = options.findIndex((option) => option.value === value)
    const nextIndex = move(currentIndex, options.length)
    const next = options[nextIndex]
    if (!next) return
    onChange(next.value)
    buttonsRef.current[nextIndex]?.focus()
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="grid gap-1 rounded-control bg-meio-fio p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option, index) => {
        const checked = option.value === value
        return (
          <button
            key={option.value}
            ref={(element) => {
              buttonsRef.current[index] = element
            }}
            type="button"
            role="radio"
            aria-checked={checked}
            tabIndex={checked ? 0 : -1}
            onClick={() => onChange(option.value)}
            onKeyDown={handleKeyDown}
            className={`h-9 rounded-[9px] px-1 text-[13px] font-bold text-asfalto ${
              checked ? 'bg-branco shadow-[0_1px_0_#CFC8B8]' : 'hover:bg-branco/50'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
