import { categories } from '@/domain/categories'
import { statuses } from '@/domain/statuses'
import { CategoryIcon } from '@/components/icons/CategoryIcon'
import { StatusPinIcon } from '@/components/icons/StatusPinIcon'
import { MapPin } from '@/components/ui/MapPin'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { ShowcaseSection } from './ShowcaseSection'

export function StatusShowcase() {
  return (
    <>
      <ShowcaseSection title="Situação">
        <div className="grid gap-3 md:grid-cols-3">
          {statuses.map((status) => (
            <div
              key={status.id}
              className="flex items-center gap-4 rounded-[14px] bg-branco px-4 py-3.5"
            >
              <StatusPinIcon status={status.id} />
              <span className="flex flex-col gap-1.5">
                <StatusBadge status={status.id} />
                <span className="text-sm text-brita">{status.description}</span>
              </span>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {statuses.map((status) => (
            <StatusBadge key={status.id} status={status.id} size="sm" />
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Categorias">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {categories.map((category) => (
            <div key={category.id} className="flex flex-col gap-3.5 rounded-[14px] bg-branco p-5">
              <CategoryIcon categoryId={category.id} size={32} strokeWidth={1.8} />
              <strong className="text-[17px]">{category.label}</strong>
            </div>
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Pinos do mapa">
        <div className="flex flex-wrap items-end gap-6 rounded-card bg-mapa-fundo px-6 pt-14 pb-8">
          {categories.map((category, index) => (
            <MapPin
              key={category.id}
              categoryId={category.id}
              status={statuses[index % statuses.length]?.id ?? 'aberta'}
              dropDelayMs={index * 70}
            />
          ))}
          <span className="ml-4 flex flex-col items-center gap-3">
            <MapPin categoryId="saneamento" status="aberta" selected />
            <span className="font-mono text-xs text-brita">selecionado</span>
          </span>
        </div>
      </ShowcaseSection>
    </>
  )
}
