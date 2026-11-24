import type { User } from '@supabase/supabase-js'
import { useSession } from './useSession'

export interface Account {
  name: string
  firstName: string
  email: string
  avatarUrl: string | null
  provider: 'google' | 'email'
}

function toAccount(user: User): Account {
  const metadata = user.user_metadata as { full_name?: string; name?: string; avatar_url?: string }
  const email = user.email ?? ''
  const name = metadata.full_name ?? metadata.name ?? email.split('@')[0] ?? ''
  const usedGoogle = user.identities?.some((identity) => identity.provider === 'google') ?? false
  return {
    name,
    firstName: name.split(' ')[0] ?? name,
    email,
    avatarUrl: metadata.avatar_url ?? null,
    provider: usedGoogle ? 'google' : 'email',
  }
}

/** The signed-in person, or null while anonymous or signed out. */
export function useAccount(): { account: Account | null; loading: boolean } {
  const { session, loading } = useSession()
  const user = session?.user
  return { account: user && !user.is_anonymous ? toAccount(user) : null, loading }
}
