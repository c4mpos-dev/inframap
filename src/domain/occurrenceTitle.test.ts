import { describe, expect, it } from 'vitest'
import { buildOccurrenceTitle } from './occurrenceTitle'

describe('buildOccurrenceTitle', () => {
  it('usa a primeira frase, com maiúscula e sem ponto final', () => {
    expect(buildOccurrenceTitle('buraco na esquina. Já faz um mês.', 'vias', 'Centro')).toBe(
      'Buraco na esquina',
    )
  })

  it('sem descrição usa categoria e bairro', () => {
    expect(buildOccurrenceTitle('  ', 'iluminacao', 'Paraíso')).toBe('Iluminação em Paraíso')
  })

  it('corta frases longas numa palavra inteira', () => {
    const title = buildOccurrenceTitle(
      'O bueiro da rua principal está entupido desde a última chuva forte e alaga toda a calçada',
      'saneamento',
      'Centro',
    )
    expect(title.length).toBeLessThanOrEqual(71)
    expect(title.endsWith('…')).toBe(true)
    expect(title).not.toMatch(/\s…$/)
  })
})
