import type { Map as MapboxMap } from 'mapbox-gl'
import { mapColors } from './designTheme'

const LAYER_ID = 'via-dutra-faixa'
const DASH_FRAMES = [
  [0, 4, 3],
  [0.5, 4, 2.5],
  [1, 4, 2],
  [1.5, 4, 1.5],
  [2, 4, 1],
  [2.5, 4, 0.5],
  [3, 4, 0],
  [0, 0.5, 3, 3.5],
  [0, 1, 3, 3],
  [0, 1.5, 3, 2.5],
  [0, 2, 3, 2],
  [0, 2.5, 3, 1.5],
  [0, 3, 3, 1],
  [0, 3.5, 3, 0.5],
]
const FRAME_MS = 80

export function addViaDutraLayer(map: MapboxMap, animate: boolean): () => void {
  if (!map.getSource('composite') || map.getLayer(LAYER_ID)) return () => {}

  map.addLayer({
    id: LAYER_ID,
    type: 'line',
    source: 'composite',
    'source-layer': 'road',
    filter: [
      'all',
      ['match', ['get', 'class'], ['motorway', 'trunk'], true, false],
      [
        'any',
        ['in', 'Dutra', ['coalesce', ['get', 'name'], '']],
        ['in', 'BR-116', ['coalesce', ['get', 'ref'], '']],
      ],
    ],
    paint: {
      'line-color': mapColors.faixa,
      'line-width': ['interpolate', ['linear'], ['zoom'], 10, 1, 15, 3],
      'line-dasharray': [0, 4, 3],
    },
  })

  if (!animate) return () => {}

  let frame = 0
  const timer = window.setInterval(() => {
    frame = (frame + 1) % DASH_FRAMES.length
    if (map.getLayer(LAYER_ID)) map.setPaintProperty(LAYER_ID, 'line-dasharray', DASH_FRAMES[frame])
  }, FRAME_MS)

  return () => window.clearInterval(timer)
}
