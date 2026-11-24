import { useCallback, useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { profileRepo } from './profileRepo'
import { useSession } from './useSession'

export interface Account {
  id: string
  /** Name chosen on the profile; null until the person picks one. */
  name: string | null
  email: string
  avatarUrl: string | null
  provider: 'google' | 'email'
}

export function firstName(account: Account): string {
  return (account.name ?? account.email.split('@')[0] ?? '').split(' ')[0] ?? ''
}

function toAccount(user: User, name: string | null): Account {
  const metadata = user.user_metadata as { avatar_url?: string }
  const usedGoogle = user.identities?.some((identity) => identity.provider === 'google') ?? false
  return {
    id: user.id,
    name,
    email: user.email ?? '',
    avatarUrl: metadata.avatar_url ?? null,
    provider: usedGoogle ? 'google' : 'email',
  }
}

/** The signed-in person with their profile, or null while signed out. */
export function useAccount(): {
  account: Account | null
  loading: boolean
  refresh: () => Promise<void>
} {
  const { session, loading: sessionLoading } = useSession()
  const user = session && !session.user.is_anonymous ? session.user : null
  const [profile, setProfile] = useState<{ userId: string; name: string | null } | null>(null)

  const refresh = useCallback(async () => {
    if (!user) return
    const name = await profileRepo.getName(user.id).catch(() => null)
    setProfile({ userId: user.id, name })
  }, [user])

  useEffect(() => {
    let active = true
    if (user) {
      profileRepo
        .getName(user.id)
        .catch(() => null)
        .then((name) => active && setProfile({ userId: user.id, name }))
    }
    return () => {
      active = false
    }
  }, [user])

  if (sessionLoading) return { account: null, loading: true, refresh }
  if (!user) return { account: null, loading: false, refresh }
  if (profile?.userId !== user.id) return { account: null, loading: true, refresh }
  return { account: toAccount(user, profile.name), loading: false, refresh }
}
