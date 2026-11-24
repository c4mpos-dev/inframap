import { IndicatorsView } from '@/features/indicators/IndicatorsView'
import { useIndicatorSource } from '@/features/indicators/useIndicatorSource'

export default function IndicatorsPage() {
  const { source, failed } = useIndicatorSource()

  if (failed) {
    return (
      <p role="alert" className="mx-auto max-w-md px-4 py-12 text-[15px] text-carvao">
        Não deu para carregar os números agora. Tente de novo em instantes.
      </p>
    )
  }

  if (!source) {
    return (
      <p aria-busy="true" className="mx-auto max-w-md px-4 py-12 text-[15px] text-carvao">
        Carregando os números…
      </p>
    )
  }

  return <IndicatorsView source={source} />
}
