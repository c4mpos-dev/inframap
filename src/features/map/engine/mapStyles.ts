import type { Map as MapboxMap } from 'mapbox-gl'
import { applyDesignTheme } from './designTheme'

export type MapStyleId = 'inframap' | 'ruas' | 'escuro'

export interface MapStyleOption {
  id: MapStyleId
  label: string
  url: string
  /** Two colors for the little preview swatch in the picker. */
  swatch: [string, string]
  /** The light style gets the InfraMap palette; the others keep Mapbox's look. */
  themed: boolean
}

const INFRAMAP_STYLE: MapStyleOption = {
  id: 'inframap',
  label: 'InfraMap',
  url: 'mapbox://styles/mapbox/light-v11',
  swatch: ['#E9E5DC', '#B7D0DC'],
  themed: true,
}

// Satellite (satellite-streets-v12) answered 429 on every tile with the project's
// Mapbox account, so it stays out until the account allows raster tiles.
export const mapStyles: MapStyleOption[] = [
  INFRAMAP_STYLE,
  {
    id: 'ruas',
    label: 'Ruas',
    url: 'mapbox://styles/mapbox/streets-v12',
    swatch: ['#F3EEE6', '#8BC7A2'],
    themed: false,
  },
  {
    id: 'escuro',
    label: 'Escuro',
    url: 'mapbox://styles/mapbox/dark-v11',
    swatch: ['#2B2E2D', '#454A47'],
    themed: false,
  },
]

export const DEFAULT_MAP_STYLE: MapStyleId = 'inframap'

export function getMapStyle(id: MapStyleId): MapStyleOption {
  return mapStyles.find((style) => style.id === id) ?? INFRAMAP_STYLE
}

export function isMapStyleId(value: unknown): value is MapStyleId {
  return mapStyles.some((style) => style.id === value)
}

export function themeMapStyle(map: MapboxMap, id: MapStyleId) {
  if (getMapStyle(id).themed) applyDesignTheme(map)
}
