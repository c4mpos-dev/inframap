import { getCategory } from '@/domain/categories'
import { getStatus } from '@/domain/statuses'
import type { IndicatorRecord } from '@/domain/indicators'

const BYTE_ORDER_MARK = String.fromCharCode(0xfeff)

const headers = [
  'data',
  'categoria',
  'bairro',
  'situacao',
  'confirmacoes',
  'tem_foto',
  'tem_descricao',
]

function escapeCell(value: string | number): string {
  const text = String(value)
  return /[",;\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

export function buildRecordsCsv(records: IndicatorRecord[]): string {
  const rows = records.map((record) => [
    record.createdAt.slice(0, 10),
    getCategory(record.categoryId).label,
    record.neighborhood,
    getStatus(record.status).label,
    record.confirmations,
    record.hasPhoto ? 'sim' : 'nao',
    record.hasDescription ? 'sim' : 'nao',
  ])
  return [headers, ...rows].map((row) => row.map(escapeCell).join(';')).join('\n')
}

export function downloadRecordsCsv(records: IndicatorRecord[]): void {
  const blob = new Blob([BYTE_ORDER_MARK + buildRecordsCsv(records)], {
    type: 'text/csv;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `inframap-relatos-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
