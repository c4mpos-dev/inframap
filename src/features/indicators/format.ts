const decimal = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})

export const formatPercent = (share: number) => `${Math.round(share * 100)}%`

export const formatDecimal = (value: number) => decimal.format(value)

export function niceMax(value: number): number {
  if (value <= 5) return 5
  const step = value <= 20 ? 5 : 10
  return Math.ceil(value / step) * step
}
