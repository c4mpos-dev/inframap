import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabaseClient'

export class NotSignedInError extends Error {
  constructor() {
    super('Entre na sua conta para continuar.')
  }
}

export async function currentSession(): Promise<Session | null> {
  const { data } = await getSupabase().auth.getSession()
  return data.session
}

/** The signed-in session; anonymous sessions do not count. */
export async function requireAccount(): Promise<Session> {
  const session = await currentSession()
  if (!session || session.user.is_anonymous) throw new NotSignedInError()
  return session
}

function redirectTo(next: string): string {
  return new URL(next, window.location.origin).toString()
}

export const authRepo = {
  /** Sends a 6-digit code. New e-mails get the sign-up template, known ones the login one. */
  async sendCode(email: string): Promise<void> {
    const { error } = await getSupabase().auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })
    if (error) {
      throw new Error(
        error.status === 429
          ? 'Muitos pedidos seguidos. Espere um minuto e tente de novo.'
          : 'Não deu para mandar o código. Confira o e-mail e tente de novo.',
      )
    }
  },

  async verifyCode(email: string, code: string): Promise<void> {
    const { error } = await getSupabase().auth.verifyOtp({ email, token: code, type: 'email' })
    if (error) throw new Error('Código errado ou vencido. Confira o e-mail ou peça outro.')
  },

  async signInWithGoogle(next = '/mapa'): Promise<void> {
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo(next) },
    })
    if (error) throw new Error('Não deu para abrir o login do Google agora.')
  },

  async signOut(): Promise<void> {
    await getSupabase().auth.signOut()
  },

  async isStaff(): Promise<boolean> {
    const { data, error } = await getSupabase().rpc('is_staff')
    return !error && data === true
  },
}
