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
