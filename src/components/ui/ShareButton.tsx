import { StrokeIcon } from '@/components/icons/StrokeIcon'

interface ShareButtonProps {
  title: string
  path: string
  onCopied: () => void
}

export function ShareButton({ title, path, onCopied }: ShareButtonProps) {
  async function share() {
    const url = new URL(path, window.location.origin).toString()
    if (navigator.share) {
      await navigator.share({ title, url }).catch(() => undefined)
      return
    }
    await navigator.clipboard.writeText(url)
    onCopied()
  }

  return (
    <button
      type="button"
      aria-label="Compartilhar"
      onClick={share}
      className="flex size-12 shrink-0 items-center justify-center rounded-control border-2 border-asfalto bg-branco hover:bg-concreto"
    >
      <StrokeIcon
        path="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M12 3v13M7 8l5-5 5 5"
        size={18}
        strokeWidth={2.2}
      />
    </button>
  )
}
