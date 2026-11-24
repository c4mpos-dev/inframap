import { useCallback, useEffect, useRef, useState } from 'react'

const TOAST_DURATION_MS = 2600

export interface ToastMessage {
  id: number
  text: string
}

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const timeoutRef = useRef<number | undefined>(undefined)

  const showToast = useCallback((text: string) => {
    window.clearTimeout(timeoutRef.current)
    setToast((previous) => ({ id: (previous?.id ?? 0) + 1, text }))
    timeoutRef.current = window.setTimeout(() => setToast(null), TOAST_DURATION_MS)
  }, [])

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  return { toast, showToast }
}
