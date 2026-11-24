import type { ReactNode } from 'react'
import { CategoryIcon } from '@/components/icons/CategoryIcon'
import { StrokeIcon } from '@/components/icons/StrokeIcon'
import { getCategory } from '@/domain/categories'
import type { MarkProblemDraft } from '../useMarkProblemForm'

const PLACE_PATH =
  'M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21zM12 7a2.5 2.5 0 1 0 0 5a2.5 2.5 0 1 0 0-5z'
const PERSON_PATH = 'M12 4a4 4 0 1 0 0 8a4 4 0 1 0 0-8zM4 21c1.5-4 4.5-6 8-6s6.5 2 8 6'

interface SummaryRowProps {
  icon: ReactNode
  iconClassName: string
  label: string
  value: string
}

function SummaryRow({ icon, iconClassName, label, value }: SummaryRowProps) {
  return (
    <div className="flex items-center gap-3 border-b border-meio-fio p-3.5 last:border-b-0">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-control ${iconClassName}`}
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-xs text-brita">{label}</span>
        <strong className="text-[15px]">{value}</strong>
      </span>
    </div>
  )
}

export function ReviewSummary({ draft }: { draft: MarkProblemDraft }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-[18px] bg-branco">
      {draft.categoryId && (
        <SummaryRow
          icon={<CategoryIcon categoryId={draft.categoryId} strokeWidth={2.2} />}
          iconClassName="bg-aberta text-branco"
          label="Categoria"
          value={getCategory(draft.categoryId).label}
        />
      )}
      <SummaryRow
        icon={<StrokeIcon path={PLACE_PATH} />}
        iconClassName="bg-meio-fio"
        label="Local"
        value={draft.place?.label ?? 'Resende'}
      />
      <SummaryRow
        icon={<StrokeIcon path={PERSON_PATH} />}
        iconClassName="bg-meio-fio"
        label="Quem marcou"
        value={draft.anonymous ? 'Nome oculto' : 'Com seu primeiro nome'}
      />
    </div>
  )
}
