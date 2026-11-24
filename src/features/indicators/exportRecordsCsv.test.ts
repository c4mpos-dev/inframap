import { describe, expect, it } from 'vitest'
import { buildRecordsCsv } from './exportRecordsCsv'

describe('buildRecordsCsv', () => {
  it('usa ponto e vírgula e escapa células com separador', () => {
    const csv = buildRecordsCsv([
      {
        createdAt: '2026-11-20T10:00:00.000Z',
        status: 'andamento',
        categoryId: 'vias',
        neighborhood: 'Vila; Nova',
        hasPhoto: true,
        hasDescription: false,
        confirmations: 3,
      },
    ])
    const [header, row] = csv.split('\n')
    expect(header).toBe('data;categoria;bairro;situacao;confirmacoes;tem_foto;tem_descricao')
    expect(row).toBe('2026-11-20;Vias e buracos;"Vila; Nova";Em andamento;3;sim;nao')
  })
})
