import { useEffect, useRef, useState } from 'react'
import { StrokeIcon } from '@/components/icons/StrokeIcon'

// Wait for a short pause in typing before filtering the map and rewriting the URL.
const DEBOUNCE_MS = 250

interface SearchFieldProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  variant: 'panel' | 'floating'
}

const variants = {
  // The panel stacks vertically, so the field keeps its own height there.
  panel: 'h-12 shrink-0 rounded-control border-[1.5px] border-linha',
  // On the phone it shares a row with the filter button and takes the free width.
  floating: 'h-12 flex-1 rounded-[14px] shadow-[0_2px_0_#D3CBB9]',
}

export function SearchField({ value, onChange, placeholder, variant }: SearchFieldProps) {
  const [draft, setDraft] = useState(value)
  const [lastValue, setLastValue] = useState(value)
  const timer = useRef<number | undefined>(undefined)

  // The search can change from outside (back button, a shared link): follow it.
  if (value !== lastValue) {
    setLastValue(value)
    setDraft(value)
  }

  useEffect(() => () => window.clearTimeout(timer.current), [])

  function handleChange(text: string) {
    setDraft(text)
    window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => onChange(text), DEBOUNCE_MS)
  }

  return (
    <label
      className={`flex min-w-0 items-center gap-2.5 bg-branco px-3.5 focus-within:outline-3 focus-within:outline-offset-2 focus-within:outline-asfalto ${variants[variant]}`}
    >
      <StrokeIcon
        path="M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14zM20 20l-3.5-3.5"
        size={18}
        className="text-brita"
      />
      <span className="sr-only">Buscar rua ou bairro</span>
      <input
        type="search"
        value={draft}
        onChange={(event) => handleChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-[15px] text-asfalto outline-none placeholder:text-[#6B655B]"
      />
    </label>
  )
}
