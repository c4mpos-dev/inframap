import { StrokeIcon } from '@/components/icons/StrokeIcon'
import type { ToastMessage } from './useToast'

interface ToastProps {
  toast: ToastMessage | null
}

export function Toast({ toast }: ToastProps) {
  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-4 bottom-28 z-50 flex justify-center md:bottom-7"
    >
      {toast && (
        <div
          key={toast.id}
          className="flex w-85 max-w-full animate-toast items-center gap-2.5 rounded-[14px] bg-asfalto px-4.5 py-3.5 text-[15px] font-semibold text-concreto"
        >
          <StrokeIcon
            path="M5 12.5l4.5 4.5L19 7.5"
            size={18}
            strokeWidth={3}
            className="text-faixa"
          />
          {toast.text}
        </div>
      )}
    </div>
  )
}
