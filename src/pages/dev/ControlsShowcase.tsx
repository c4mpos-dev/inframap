import { useState } from 'react'
import { allCategoriesIconPath, categories } from '@/domain/categories'
import { Button, ButtonLink } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { SegmentedControl } from '@/components/ui/SegmentedControl'
import { Switch } from '@/components/ui/Switch'
import { ShowcaseSection } from './ShowcaseSection'

type StatusFilter = 'todas' | 'aberta' | 'andamento' | 'resolvida'

const statusFilterOptions: { value: StatusFilter; label: string }[] = [
  { value: 'todas', label: 'Todas' },
  { value: 'aberta', label: 'Abertas' },
  { value: 'andamento', label: 'Andando' },
  { value: 'resolvida', label: 'Resolvidas' },
]

export function ControlsShowcase() {
  const [category, setCategory] = useState('todas')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('todas')
  const [anonymous, setAnonymous] = useState(true)

  return (
    <>
      <ShowcaseSection title="Botões">
        <div className="flex flex-wrap items-center gap-3">
          <Button>Enviar para o mapa</Button>
          <Button variant="secondary">Detalhes</Button>
          <Button variant="danger" size="md">
            Marcar inválido
          </Button>
          <Button disabled>Escolha uma categoria</Button>
          <ButtonLink to="/mapa" variant="secondary" size="md">
            Ver o mapa
          </ButtonLink>
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Chips de categoria">
        <div className="-mx-4 scrollbar-none flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
          <Chip
            label="Tudo"
            iconPath={allCategoriesIconPath}
            selected={category === 'todas'}
            onClick={() => setCategory('todas')}
          />
          {categories.map((item) => (
            <Chip
              key={item.id}
              label={item.shortLabel}
              iconPath={item.iconPath}
              selected={category === item.id}
              onClick={() => setCategory(item.id)}
            />
          ))}
        </div>
      </ShowcaseSection>

      <ShowcaseSection title="Controle segmentado e chave">
        <div className="grid max-w-md gap-4">
          <SegmentedControl
            label="Situação"
            options={statusFilterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
          <Switch
            label="Enviar sem meu nome"
            description="Ninguém vê quem marcou"
            checked={anonymous}
            onChange={setAnonymous}
          />
        </div>
      </ShowcaseSection>
    </>
  )
}
