import { categories } from '@/domain/categories'
import type { CategoryId } from '@/domain/types'
import { CategoryIcon } from '@/components/icons/CategoryIcon'

const hints: Record<CategoryId, string> = {
  vias: 'buraco, asfalto, meio-fio',
  calcadas: 'quebrada, sem rampa',
  saneamento: 'bueiro, esgoto, alagamento',
  sinalizacao: 'placa, faixa, semáforo',
  iluminacao: 'poste apagado ou piscando',
  outros: 'não achou aqui',
}

interface CategoryGridProps {
  value: CategoryId | null
  onChange: (value: CategoryId | null) => void
  variant: 'mobile' | 'desktop'
}

export function CategoryGrid({ value, onChange, variant }: CategoryGridProps) {
  const mobile = variant === 'mobile'

  return (
    <div className={`grid gap-2.5 ${mobile ? 'grid-cols-2' : 'grid-cols-3 gap-2'}`}>
      {categories.map((category) => {
        const selected = category.id === value
        return (
          <button
            key={category.id}
            type="button"
            aria-pressed={selected}
            onClick={() => onChange(selected ? null : category.id)}
            className={`flex flex-col justify-between border-2 text-left transition-transform duration-150 ${
              mobile
                ? 'h-32 rounded-[18px] p-4 active:scale-96'
                : 'h-23 rounded-[14px] p-3 hover:-translate-y-0.5'
            } ${
              selected
                ? 'border-asfalto bg-asfalto text-faixa shadow-[0_3px_0_var(--color-faixa)]'
                : 'border-linha bg-branco text-asfalto'
            }`}
          >
            <CategoryIcon categoryId={category.id} size={mobile ? 34 : 26} strokeWidth={1.9} />
            <span className="flex flex-col gap-0.5">
              <strong className={mobile ? 'text-base font-extrabold' : 'text-sm font-bold'}>
                {category.label}
              </strong>
              {mobile && <span className="text-xs opacity-80">{hints[category.id]}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}
