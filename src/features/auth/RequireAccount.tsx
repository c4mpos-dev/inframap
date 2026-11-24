import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router'
import { useAccount } from '@/data/useAccount'
import { signInPath } from './signInPath'

/** Screens that only make sense with an account and a name, like /marcar. */
export function RequireAccount({ children }: { children: ReactNode }) {
  const { account, loading } = useAccount()
  const location = useLocation()

  if (loading) return <div className="min-h-dvh bg-concreto" aria-busy="true" />
  if (!account?.name) return <Navigate to={signInPath(location)} replace />
  return children
}
