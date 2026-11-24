import type { CategoryId } from './types'

export interface Category {
  id: CategoryId
  label: string
  shortLabel: string
  iconPath: string
}

export const categories: Category[] = [
  {
    id: 'vias',
    label: 'Vias e buracos',
    shortLabel: 'Vias',
    iconPath: 'M5 20L9.5 4M19 20L14.5 4M9 14.5a3 1.6 0 1 0 6 0a3 1.6 0 1 0 -6 0',
  },
  {
    id: 'calcadas',
    label: 'Calçadas',
    shortLabel: 'Calçadas',
    iconPath: 'M3 12h18v8H3zM9 12v8M15 12v8M3 16h18M7 8l3-4 3 4',
  },
  {
    id: 'saneamento',
    label: 'Saneamento',
    shortLabel: 'Saneamento',
    iconPath: 'M12 3C12 3 6 10 6 14a6 6 0 0 0 12 0C18 10 12 3 12 3z',
  },
  {
    id: 'sinalizacao',
    label: 'Sinalização',
    shortLabel: 'Sinalização',
    iconPath: 'M12 3L21.5 19.5H2.5zM12 9.5v4.5M12 16.6v.4',
  },
  {
    id: 'iluminacao',
    label: 'Iluminação',
    shortLabel: 'Iluminação',
    iconPath: 'M8 21h8M12 21V9M6 4h12c0 3-2.7 5-6 5S6 7 6 4z',
  },
  {
    id: 'outros',
    label: 'Outros',
    shortLabel: 'Outros',
    iconPath: 'M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18zM8 12h.01M12 12h.01M16 12h.01',
  },
]

const categoriesById = new Map(categories.map((category) => [category.id, category]))

export function getCategory(id: CategoryId): Category {
  const category = categoriesById.get(id)
  if (!category) throw new Error(`Categoria desconhecida: ${id}`)
  return category
}

export const allCategoriesIconPath = 'M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z'
