const DAY_MS = 24 * 60 * 60 * 1000

export function formatRelativeDay(isoDate: string, now: Date = new Date()): string {
  const days = Math.round((startOfDay(now) - startOfDay(new Date(isoDate))) / DAY_MS)

  if (days <= 0) return 'hoje'
  if (days === 1) return 'ontem'
  if (days < 7) return `há ${days} dias`
  if (days < 30) {
    const weeks = Math.floor(days / 7)
    return weeks === 1 ? 'há 1 semana' : `há ${weeks} semanas`
  }
  const months = Math.floor(days / 30)
  return months === 1 ? 'há 1 mês' : `há ${months} meses`
}

function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

const shortDate = new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' })
const shortTime = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' })

export function formatEventDate(isoDate: string): string {
  const date = new Date(isoDate)
  return `${shortDate.format(date).replace('.', '').replace(' de ', ' ')} · ${shortTime.format(date)}`
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.max(1, Math.round(meters / 10) * 10)} m`
  return `${(meters / 1000).toFixed(1).replace('.', ',')} km`
}

export function formatElapsed(isoDate: string, now: Date = new Date()): string {
  const minutes = Math.max(1, Math.floor((now.getTime() - new Date(isoDate).getTime()) / 60000))
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} h`
  const days = Math.floor(hours / 24)
  if (days < 7) return days === 1 ? '1 dia' : `${days} dias`
  return `${Math.floor(days / 7)} sem`
}
