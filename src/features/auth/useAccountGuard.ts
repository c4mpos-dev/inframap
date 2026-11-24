import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { useAccount } from '@/data/useAccount'
import { signInPath } from './signInPath'

/**
 * Wraps an action that needs an account (confirm, report…). Signed-out people
 * go to /entrar and come back here afterwards.
 */
export function useAccountGuard() {
  const { account } = useAccount()
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(
    (action: () => void | Promise<void>) => {
      if (account) return action()
      navigate(signInPath(location))
    },
    [account, navigate, location],
  )
}
