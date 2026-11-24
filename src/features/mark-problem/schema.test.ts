import { describe, expect, it } from 'vitest'
import { DESCRIPTION_MAX_LENGTH, markProblemSchema } from './schema'

const valid = {
  categoryId: 'vias',
  location: { lat: -22.47, lng: -44.46 },
  neighborhood: 'Centro',
  description: 'Buraco fundo.',
  photoUrl: null,
  anonymous: false,
}

const firstError = (input: unknown) => markProblemSchema.safeParse(input).error?.issues[0]?.message

describe('markProblemSchema', () => {
  it('aceita um relato completo e sem foto', () => {
    expect(markProblemSchema.safeParse(valid).success).toBe(true)
  })

  it('aceita descrição vazia', () => {
    expect(markProblemSchema.safeParse({ ...valid, description: '   ' }).success).toBe(true)
  })

  it('pede a categoria', () => {
    expect(firstError({ ...valid, categoryId: undefined })).toBe('Escolha uma categoria')
    expect(firstError({ ...valid, categoryId: 'buraco' })).toBe('Escolha uma categoria')
  })

  it('pede o local no mapa', () => {
    expect(firstError({ ...valid, location: null })).toBe('Marque o local no mapa')
  })

  it('limita a descrição', () => {
    expect(firstError({ ...valid, description: 'a'.repeat(DESCRIPTION_MAX_LENGTH + 1) })).toBe(
      `Use até ${DESCRIPTION_MAX_LENGTH} caracteres`,
    )
  })
})
