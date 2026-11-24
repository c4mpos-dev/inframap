import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabaseClient'

export async function currentSession(): Promise<Session | null> {
  const { data } = await getSupabase().auth.getSession()
  return data.session
}

export async function ensureSession(): Promise<Session> {
  const existing = await currentSession()
  if (existing) return existing
  const { data, error } = await getSupabase().auth.signInAnonymously()
  if (error || !data.session) throw new Error('Não deu para abrir uma sessão agora. Tente de novo.')
  return data.session
}

function redirectTo(next: string): string {
  return new URL(next, window.location.origin).toString()
}

export const authRepo = {
  async sendMagicLink(email: string, next = '/mapa'): Promise<void> {
    const { error } = await getSupabase().auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo(next) },
    })
    if (error) throw new Error('Não deu para mandar o link. Confira o e-mail e tente de novo.')
  },

  async signInWithGoogle(next = '/mapa'): Promise<void> {
    const { error } = await getSupabase().auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: redirectTo(next) },
    })
    if (error) throw new Error('O login com Google ainda não está ligado neste projeto.')
  },

  async signOut(): Promise<void> {
    await getSupabase().auth.signOut()
  },

  async isStaff(): Promise<boolean> {
    const { data, error } = await getSupabase().rpc('is_staff')
    return !error && data === true
  },
}
