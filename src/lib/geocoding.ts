import type { LatLng } from '@/domain/types'

export interface PlaceName {
  neighborhood: string | null
  label: string
}

interface MapboxFeature {
  properties: {
    feature_type: string
    name: string
    context?: { place?: { name: string } }
  }
}

const FALLBACK_CITY = 'Resende'

export async function reverseGeocode({ lat, lng }: LatLng): Promise<PlaceName> {
  const token = import.meta.env.VITE_MAPBOX_TOKEN
  if (!token) return { neighborhood: null, label: FALLBACK_CITY }

  const params = new URLSearchParams({
    longitude: String(lng),
    latitude: String(lat),
    types: 'neighborhood,locality,place',
    language: 'pt',
    access_token: token,
  })

  try {
    const response = await fetch(`https://api.mapbox.com/search/geocode/v6/reverse?${params}`)
    if (!response.ok) throw new Error(String(response.status))
    const { features } = (await response.json()) as { features: MapboxFeature[] }
    const area = features.find((feature) =>
      ['neighborhood', 'locality'].includes(feature.properties.feature_type),
    )
    const city =
      area?.properties.context?.place?.name ??
      features.find((feature) => feature.properties.feature_type === 'place')?.properties.name ??
      FALLBACK_CITY
    const neighborhood = area?.properties.name ?? null
    return { neighborhood, label: neighborhood ? `${neighborhood}, ${city}` : city }
  } catch {
    return { neighborhood: null, label: FALLBACK_CITY }
  }
}
