import { TeamGate } from '@/features/team/components/TeamGate'
import { TeamQueue } from '@/features/team/TeamQueue'
import { useTeamAccess } from '@/features/team/useTeamAccess'

export default function TeamPage() {
  const { access, email } = useTeamAccess()
  return access === 'staff' ? <TeamQueue /> : <TeamGate access={access} email={email} />
}
