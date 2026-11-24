import { useState } from 'react'
import { readStorage, writeStorage } from '@/lib/storage'

const TEAM_MODE_KEY = 'inframap:team-mode'

export function useTeamMode() {
  const [enabled, setEnabled] = useState(() => readStorage<boolean>(TEAM_MODE_KEY, false))

  function toggle(next: boolean) {
    writeStorage(TEAM_MODE_KEY, next)
    setEnabled(next)
  }

  return { enabled, enter: () => toggle(true), leave: () => toggle(false) }
}
