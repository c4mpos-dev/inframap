import { getSupabase, unwrap } from '@/lib/supabaseClient'

export const NAME_MIN_LENGTH = 2
export const NAME_MAX_LENGTH = 60

export const profileRepo = {
  async getName(userId: string): Promise<string | null> {
    const row = unwrap(
      await getSupabase().from('profiles').select('display_name').eq('id', userId).maybeSingle(),
    ) as { display_name: string | null } | null
    return row?.display_name ?? null
  },

  async setName(userId: string, name: string): Promise<void> {
    const clean = name.trim().replace(/\s+/g, ' ')
    if (clean.length < NAME_MIN_LENGTH || clean.length > NAME_MAX_LENGTH) {
      throw new Error(`Use entre ${NAME_MIN_LENGTH} e ${NAME_MAX_LENGTH} letras.`)
    }
    unwrap(await getSupabase().from('profiles').update({ display_name: clean }).eq('id', userId))
  },
}
