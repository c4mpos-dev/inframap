import type { QueueItem } from '@/data/teamRepo'
import { getCategory } from '@/domain/categories'
import { formatElapsed } from '@/domain/relativeTime'
import { getStatus } from '@/domain/statuses'

interface QueueTableProps {
  items: QueueItem[]
  selectedId: string | null
  onSelect: (id: string) => void
}

const headerCell = 'border-b-2 border-asfalto py-3.5 font-bold'

export function QueueTable({ items, selectedId, onSelect }: QueueTableProps) {
  if (items.length === 0) {
    return <p className="p-6 text-sm text-carvao">Nenhum relato nessa aba.</p>
  }

  return (
    <table className="w-full min-w-180 border-collapse text-sm">
      <thead className="sticky top-0 z-1 bg-branco">
        <tr className="text-left text-xs tracking-[0.05em] text-brita uppercase">
          <th scope="col" className={`${headerCell} px-4`}>
            Protocolo
          </th>
          <th scope="col" className={`${headerCell} px-2`}>
            Relato
          </th>
          <th scope="col" className={`${headerCell} px-2`}>
            Bairro
          </th>
          <th scope="col" className={`${headerCell} px-2 text-right`}>
            Viram
          </th>
          <th scope="col" className={`${headerCell} px-2`}>
            Situação
          </th>
          <th scope="col" className={`${headerCell} px-4`}>
            Há
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map(({ occurrence, reportCount }) => {
          const selected = occurrence.id === selectedId
          const status = getStatus(occurrence.status)
          return (
            <tr
              key={occurrence.id}
              onClick={() => onSelect(occurrence.id)}
              className={`cursor-pointer transition-colors ${
                selected
                  ? 'bg-[#FFF4D1] shadow-[inset_4px_0_0_var(--color-asfalto)]'
                  : 'bg-branco hover:bg-[#F7F5F0]'
              }`}
            >
              <td className="border-b border-[#EEEAE2] px-4 py-3.5 font-mono text-[13px]">
                {occurrence.protocol}
              </td>
              <td className="border-b border-[#EEEAE2] px-2 py-3.5">
                <button
                  type="button"
                  aria-pressed={selected}
                  onClick={(event) => {
                    event.stopPropagation()
                    onSelect(occurrence.id)
                  }}
                  className="text-left font-semibold text-asfalto"
                >
                  {occurrence.title}
                </button>
                <span className="block text-xs text-brita">
                  {getCategory(occurrence.categoryId).shortLabel} ·{' '}
                  {occurrence.photoUrl ? 'com foto' : 'sem foto'}
                  {reportCount > 0 && (
                    <span className="ml-1.5 rounded bg-aberta px-1.5 py-0.5 font-semibold text-branco">
                      {reportCount === 1 ? '1 denúncia' : `${reportCount} denúncias`}
                    </span>
                  )}
                </span>
              </td>
              <td className="border-b border-[#EEEAE2] px-2 py-3.5">{occurrence.neighborhood}</td>
              <td className="border-b border-[#EEEAE2] px-2 py-3.5 text-right font-mono">
                {occurrence.confirmations}
              </td>
              <td className="border-b border-[#EEEAE2] px-2 py-3.5">
                <span className="inline-flex items-center gap-1.5 font-semibold">
                  <span
                    className="size-2.5 rounded-full"
                    style={{ backgroundColor: status.color }}
                  />
                  {status.label}
                </span>
              </td>
              <td className="border-b border-[#EEEAE2] px-4 py-3.5 text-brita">
                {formatElapsed(occurrence.createdAt)}
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
