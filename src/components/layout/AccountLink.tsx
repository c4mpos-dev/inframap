import { Link } from 'react-router'
import { firstName, useAccount } from '@/data/useAccount'

/** "Entrar" for visitors; avatar and first name (linking to /perfil) once signed in. */
export function AccountLink({ className = '' }: { className?: string }) {
  const { account, loading } = useAccount()
  const base = `text-[15px] font-semibold text-giz no-underline hover:text-concreto ${className}`

  if (loading) return <span className={`${base} invisible`}>Entrar</span>
  if (!account) {
    return (
      <Link to="/entrar" className={`py-3 ${base}`}>
        Entrar
      </Link>
    )
  }

  const name = firstName(account)
  return (
    <Link
      to="/perfil"
      aria-label={`Perfil de ${name}`}
      className={`flex items-center gap-2 py-2 ${base}`}
    >
      {account.avatarUrl ? (
        <img
          src={account.avatarUrl}
          alt=""
          referrerPolicy="no-referrer"
          className="size-8 rounded-full"
        />
      ) : (
        <span
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-full bg-asfalto-2 font-extrabold text-faixa"
        >
          {name.charAt(0).toUpperCase()}
        </span>
      )}
      {name}
    </Link>
  )
}
