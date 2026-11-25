import { useCallback, useSyncExternalStore } from 'react'
import { DEFAULT_MAP_STYLE, isMapStyleId, type MapStyleId } from './engine/mapStyles'

const STORAGE_KEY = 'inframap:estilo-do-mapa'
const CHANGE_EVENT = 'inframap:estilo-do-mapa'

// Fallback when storage is blocked, so the choice still works for this visit.
let memory: MapStyleId = DEFAULT_MAP_STYLE

function read(): MapStyleId {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return isMapStyleId(saved) ? saved : memory
  } catch {
    return memory
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(CHANGE_EVENT, onChange)
  window.addEventListener('storage', onChange)
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange)
    window.removeEventListener('storage', onChange)
  }
}

/** The map type the person picked, remembered on this device for every map in the app. */
export function useMapStyle(): [MapStyleId, (id: MapStyleId) => void] {
  const styleId = useSyncExternalStore(subscribe, read, () => DEFAULT_MAP_STYLE)

  const setStyleId = useCallback((id: MapStyleId) => {
    memory = id
    try {
      window.localStorage.setItem(STORAGE_KEY, id)
    } catch {
      // Private mode or blocked storage: the choice just won't be remembered.
    }
    window.dispatchEvent(new Event(CHANGE_EVENT))
  }, [])

  return [styleId, setStyleId]
}
