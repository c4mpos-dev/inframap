import { useEffect, useState } from 'react'
import { authRepo } from '@/data/session'
import { useSession } from '@/data/useSession'

export type TeamAccess = 'loading' | 'signed-out' | 'not-staff' | 'staff'

export function useTeamAccess(): { access: TeamAccess; email: string | null } {
  const { session, loading } = useSession()
  const [staffCheck, setStaffCheck] = useState<{ userId: string; staff: boolean } | null>(null)
  const user = session?.user
  const identified = user && !user.is_anonymous ? user : null

  useEffect(() => {
    if (!identified) return
    let active = true
    authRepo.isStaff().then((staff) => active && setStaffCheck({ userId: identified.id, staff }))
    return () => {
      active = false
    }
  }, [identified])

  if (loading) return { access: 'loading', email: null }
  if (!identified) return { access: 'signed-out', email: null }
  if (staffCheck?.userId !== identified.id)
    return { access: 'loading', email: identified.email ?? null }
  return { access: staffCheck.staff ? 'staff' : 'not-staff', email: identified.email ?? null }
}
