import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
  if (client) return client
  const url = import.meta.env.VITE_SUPABASE_URL
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  if (!url || !anonKey) {
    throw new Error(
      'Supabase não configurado: preencha VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.',
    )
  }
  client = createClient(url, anonKey)
  return client
}

export class DataError extends Error {}

export function unwrap<T>(result: {
  data: T | null
  error: { message: string; code?: string } | null
}): T {
  if (result.error) {
    throw new DataError(
      result.error.code === 'P0001'
        ? result.error.message
        : 'Não deu para falar com o servidor agora.',
    )
  }
  return result.data as T
}
