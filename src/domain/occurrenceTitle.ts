import { getCategory } from './categories'
import type { CategoryId } from './types'

const MAX_TITLE_LENGTH = 70

export function buildOccurrenceTitle(
  description: string,
  categoryId: CategoryId,
  neighborhood: string,
): string {
  const firstSentence =
    description
      .trim()
      .split(/(?<=[.!?])\s|\n/)[0]
      ?.trim() ?? ''
  if (!firstSentence) return `${getCategory(categoryId).label} em ${neighborhood}`

  const sentence = firstSentence.replace(/[.!?]+$/, '')
  const capitalized = sentence.charAt(0).toUpperCase() + sentence.slice(1)
  if (capitalized.length <= MAX_TITLE_LENGTH) return capitalized

  const cut = capitalized.slice(0, MAX_TITLE_LENGTH)
  return `${cut.slice(0, cut.lastIndexOf(' ')).trimEnd()}…`
}
