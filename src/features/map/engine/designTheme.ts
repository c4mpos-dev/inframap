import type { Map as MapboxMap } from 'mapbox-gl'

export const mapColors = {
  land: '#E9E5DC',
  block: '#E0DBCF',
  park: '#D2DFC2',
  water: '#B7D0DC',
  waterLabel: '#4F7C92',
  roadCasing: '#D3CBB9',
  road: '#FFFFFF',
  highwayCasing: '#C9B98E',
  highway: '#F4EBD2',
  highwayLabel: '#7A6A3E',
  label: '#6B655B',
  faixa: '#FFC21A',
}

const isHighway = (id: string) => /motorway|trunk/.test(id)

function paint(map: MapboxMap, layerId: string, property: string, value: unknown) {
  map.setPaintProperty(layerId, property as never, value as never)
}

export function applyDesignTheme(map: MapboxMap) {
  for (const layer of map.getStyle()?.layers ?? []) {
    const { id, type } = layer

    if (type === 'background') paint(map, id, 'background-color', mapColors.land)
    else if (type === 'fill' && /water/.test(id)) paint(map, id, 'fill-color', mapColors.water)
    else if (type === 'line' && /waterway/.test(id)) paint(map, id, 'line-color', mapColors.water)
    else if (type === 'fill' && /park|landuse|landcover|national/.test(id))
      paint(map, id, 'fill-color', mapColors.park)
    else if (type === 'fill' && /building/.test(id)) paint(map, id, 'fill-color', mapColors.block)
    else if (type === 'line' && /road|bridge|tunnel/.test(id)) themeRoad(map, id)
    else if (type === 'symbol') themeLabel(map, id)
  }
}

function themeRoad(map: MapboxMap, id: string) {
  const casing = /case/.test(id)
  if (isHighway(id))
    paint(map, id, 'line-color', casing ? mapColors.highwayCasing : mapColors.highway)
  else paint(map, id, 'line-color', casing ? mapColors.roadCasing : mapColors.road)
}

function themeLabel(map: MapboxMap, id: string) {
  if (/water/.test(id)) {
    paint(map, id, 'text-color', mapColors.waterLabel)
    return
  }
  if (/road/.test(id)) {
    paint(map, id, 'text-color', mapColors.highwayLabel)
    return
  }
  paint(map, id, 'text-color', mapColors.label)
  if (/settlement-subdivision|settlement-minor/.test(id)) {
    map.setLayoutProperty(id, 'text-transform', 'uppercase')
    map.setLayoutProperty(id, 'text-letter-spacing', 0.2)
  }
}
