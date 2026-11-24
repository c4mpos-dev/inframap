import { TeamGate } from '@/features/team/components/TeamGate'
import { TeamQueue } from '@/features/team/TeamQueue'
import { useTeamMode } from '@/features/team/useTeamMode'

export default function TeamPage() {
  const { enabled, enter } = useTeamMode()
  return enabled ? <TeamQueue /> : <TeamGate onEnter={enter} />
}
