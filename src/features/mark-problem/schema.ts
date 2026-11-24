import { z } from 'zod'
import { categories } from '@/domain/categories'
import type { CategoryId } from '@/domain/types'

export const DESCRIPTION_MAX_LENGTH = 500

const categoryIds = categories.map((category) => category.id) as [CategoryId, ...CategoryId[]]

export const markProblemSchema = z.object({
  categoryId: z.enum(categoryIds, { error: 'Escolha uma categoria' }),
  location: z.object({ lat: z.number(), lng: z.number() }, { error: 'Marque o local no mapa' }),
  neighborhood: z.string().trim().min(1),
  description: z
    .string()
    .trim()
    .max(DESCRIPTION_MAX_LENGTH, `Use até ${DESCRIPTION_MAX_LENGTH} caracteres`),
  photoUrl: z.string().nullable(),
  anonymous: z.boolean(),
})

export type MarkProblemInput = z.infer<typeof markProblemSchema>
